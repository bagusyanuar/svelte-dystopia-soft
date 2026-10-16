import { SvelteMap } from 'svelte/reactivity';
import type {
	ComboboxFilter,
	ComboboxOption,
	ComboboxRenderGroup,
	ComboboxValue
} from './Combobox.types.js';

function normalize(value: string): string {
	return value
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase()
		.trim();
}

export function defaultFilter<T extends ComboboxValue>(
	option: ComboboxOption<T>,
	query: string
): boolean {
	const needle = normalize(query);
	if (!needle) return true;
	if (normalize(option.label).includes(needle)) return true;
	return (option.keywords ?? []).some((keyword) => normalize(keyword).includes(needle));
}

export type HighlightPart = { text: string; match: boolean };

/** Splits a label around the first case-insensitive occurrence of the query. */
export function splitMatch(label: string, query: string): HighlightPart[] {
	const needle = query.trim().toLowerCase();
	if (!needle) return [{ text: label, match: false }];

	const start = label.toLowerCase().indexOf(needle);
	if (start === -1) return [{ text: label, match: false }];

	const parts: HighlightPart[] = [];
	if (start > 0) parts.push({ text: label.slice(0, start), match: false });
	parts.push({ text: label.slice(start, start + needle.length), match: true });
	if (start + needle.length < label.length) {
		parts.push({ text: label.slice(start + needle.length), match: false });
	}
	return parts;
}

/**
 * Everything the state machine needs from the host component. Passed as an
 * object of getters so props stay the single source of truth (no prop/state
 * mirroring, no sync loops).
 */
export type ComboboxStateDeps<T extends ComboboxValue> = {
	readonly options: ComboboxOption<T>[];
	readonly value: T | T[] | undefined;
	readonly multiple: boolean;
	readonly manualFilter: boolean;
	readonly searchDebounce: number;
	readonly filter: ComboboxFilter<T> | undefined;
	readonly creatable: boolean;
	readonly creating: boolean;
	setValue: (next: T | T[] | undefined) => void;
	setSearch: (query: string) => void;
	onCreate?: (query: string) => void | Promise<void>;
};

export class ComboboxState<T extends ComboboxValue> {
	open = $state(false);
	/** Raw text in the search box. Updates on every keystroke. */
	inputValue = $state('');
	activeIndex = $state(0);
	isCreatingInternal = $state(false);

	get isCreating(): boolean {
		return Boolean(this.#deps.creating || this.isCreatingInternal);
	}

	/**
	 * Labels of options that were selected at some point. In remote-search mode
	 * `options` is replaced on every query, so a selected option can vanish from
	 * the list while still being the current value — this cache keeps the trigger
	 * able to render its label.
	 */
	readonly selectedOptions = new SvelteMap<T, ComboboxOption<T>>();

	#deps: ComboboxStateDeps<T>;
	#timer: ReturnType<typeof setTimeout> | undefined;

	constructor(deps: ComboboxStateDeps<T>) {
		this.#deps = deps;
	}

	get multiple(): boolean {
		return this.#deps.multiple;
	}

	get values(): T[] {
		const current = this.#deps.value;
		if (current === undefined || current === null) return [];
		return Array.isArray(current) ? current : [current];
	}

	/**
	 * Local filtering runs off the raw input so results feel instant. The debounce
	 * only delays what we hand to the parent. With `manualFilter` the parent has
	 * already filtered server-side, so we pass its list through untouched.
	 */
	readonly filtered: ComboboxOption<T>[] = $derived.by(() => {
		const options = this.#deps.options;
		if (this.#deps.manualFilter) return options;
		if (!this.inputValue.trim()) return options;
		const filter = this.#deps.filter ?? defaultFilter;
		return options.filter((option) => filter(option, this.inputValue));
	});

	readonly canCreate = $derived.by(() => {
		if (!this.#deps.creatable) return false;
		const query = this.inputValue.trim();
		if (!query) return false;
		const needle = query.toLowerCase();
		return !this.#deps.options.some(
			(opt) =>
				opt.label.trim().toLowerCase() === needle ||
				String(opt.value).trim().toLowerCase() === needle
		);
	});

	get totalCount(): number {
		return this.filtered.length + (this.canCreate ? 1 : 0);
	}

	get isCreateActive(): boolean {
		return this.canCreate && this.activeIndex === this.filtered.length;
	}

	readonly groups: ComboboxRenderGroup<T>[] = $derived.by(() => {
		const groups: ComboboxRenderGroup<T>[] = [];
		// Plain lookup object, not a Map: this index is transient scratch space
		// rebuilt on every recompute, so it must not be reactive.
		const byKey: Record<string, ComboboxRenderGroup<T>> = Object.create(null);

		this.filtered.forEach((option, index) => {
			const key = option.group ?? '';
			let group = byKey[key];
			if (!group) {
				group = { label: option.group, items: [] };
				byKey[key] = group;
				groups.push(group);
			}
			group.items.push({ option, index });
		});

		return groups;
	});

	readonly selectedItems: ComboboxOption<T>[] = $derived.by(() =>
		this.values.map(
			(value) =>
				this.selectedOptions.get(value) ??
				this.#deps.options.find((option) => option.value === value) ?? {
					value,
					label: String(value)
				}
		)
	);

	isSelected(value: T): boolean {
		return this.values.includes(value);
	}

	/** Keeps labels of currently selected options available after `options` changes. */
	cacheSelected(): void {
		for (const option of this.#deps.options) {
			if (this.isSelected(option.value)) this.selectedOptions.set(option.value, option);
		}
	}

	setInputValue(next: string): void {
		this.inputValue = next;
		this.resetActive();

		clearTimeout(this.#timer);
		if (this.#deps.searchDebounce <= 0) {
			this.#deps.setSearch(next);
			return;
		}
		this.#timer = setTimeout(() => this.#deps.setSearch(next), this.#deps.searchDebounce);
	}

	#flushSearch(next: string): void {
		clearTimeout(this.#timer);
		this.inputValue = next;
		this.#deps.setSearch(next);
	}

	openMenu(): void {
		if (this.open) return;
		this.open = true;
		this.resetActive();
	}

	closeMenu(): void {
		if (!this.open) return;
		this.open = false;
		// Single-select commits on pick, so the next open should start clean.
		if (!this.multiple && this.inputValue) this.#flushSearch('');
	}

	toggleMenu(): void {
		if (this.open) this.closeMenu();
		else this.openMenu();
	}

	#isEnabled(index: number): boolean {
		if (this.canCreate && index === this.filtered.length) return !this.isCreating;
		const option = this.filtered[index];
		return option !== undefined && !option.disabled;
	}

	resetActive(): void {
		const next = this.filtered.findIndex((option) => !option.disabled);
		if (next !== -1) {
			this.activeIndex = next;
		} else if (this.canCreate) {
			this.activeIndex = this.filtered.length;
		} else {
			this.activeIndex = 0;
		}
	}

	clampActive(): void {
		const total = this.totalCount;
		if (total === 0) {
			this.activeIndex = 0;
			return;
		}
		if (this.activeIndex > total - 1 || !this.#isEnabled(this.activeIndex)) {
			this.resetActive();
		}
	}

	/** Moves the highlight by `delta`, skipping disabled options and wrapping around. */
	move(delta: number): void {
		const total = this.totalCount;
		if (total === 0) return;

		let index = this.activeIndex;
		for (let step = 0; step < total; step += 1) {
			index = (index + delta + total) % total;
			if (this.#isEnabled(index)) {
				this.activeIndex = index;
				return;
			}
		}
	}

	moveTo(edge: 'first' | 'last'): void {
		const total = this.totalCount;
		if (total === 0) return;
		this.activeIndex = edge === 'first' ? -1 : total;
		this.move(edge === 'first' ? 1 : -1);
	}

	setActive(index: number): void {
		if (this.#isEnabled(index)) this.activeIndex = index;
	}

	select(option: ComboboxOption<T>): void {
		if (option.disabled) return;
		this.selectedOptions.set(option.value, option);

		if (this.multiple) {
			const next = this.isSelected(option.value)
				? this.values.filter((value) => value !== option.value)
				: [...this.values, option.value];
			this.#deps.setValue(next);
			// Menu stays open and the query is kept so several picks in a row are cheap
			// — clearing it here would refire the parent's remote search.
			return;
		}

		this.#deps.setValue(option.value);
		this.closeMenu();
	}

	selectActive(): void {
		if (this.canCreate && this.activeIndex === this.filtered.length) {
			this.selectCreate();
			return;
		}
		const option = this.filtered[this.activeIndex];
		if (option) this.select(option);
	}

	async selectCreate(): Promise<void> {
		if (!this.canCreate || this.isCreating) return;
		const query = this.inputValue.trim();
		this.selectedOptions.set(query as unknown as T, {
			value: query as unknown as T,
			label: query
		});

		try {
			const res = this.#deps.onCreate?.(query);
			if (res && typeof (res as Promise<unknown>).then === 'function') {
				this.isCreatingInternal = true;
				await res;
			}
			if (this.multiple) {
				this.setInputValue('');
			} else {
				this.closeMenu();
			}
		} finally {
			this.isCreatingInternal = false;
		}
	}

	deselect(value: T): void {
		if (this.multiple) {
			this.#deps.setValue(this.values.filter((current) => current !== value));
			return;
		}
		this.#deps.setValue(undefined);
	}

	clear(): void {
		this.#deps.setValue(this.multiple ? [] : undefined);
	}

	/** Backspace on an empty query removes the last chip. */
	popLast(): void {
		const last = this.values.at(-1);
		if (last !== undefined) this.deselect(last);
	}

	destroy(): void {
		clearTimeout(this.#timer);
	}
}
