import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { ComboboxVariantProps } from './Combobox.variants.js';

export type ComboboxValue = string | number;

export interface ComboboxOption<T extends ComboboxValue = ComboboxValue> {
	value: T;
	label: string;
	disabled?: boolean;
	/** Flat grouping key. Options sharing a key are rendered under one header. */
	group?: string;
	/** Extra terms matched by the local filter in addition to the label. */
	keywords?: string[];
}

/** A filtered option paired with its index in the flat filtered list. */
export interface ComboboxRenderItem<T extends ComboboxValue = ComboboxValue> {
	option: ComboboxOption<T>;
	index: number;
}

export interface ComboboxRenderGroup<T extends ComboboxValue = ComboboxValue> {
	label: string | undefined;
	items: ComboboxRenderItem<T>[];
}

export type ComboboxFilter<T extends ComboboxValue = ComboboxValue> = (
	option: ComboboxOption<T>,
	query: string
) => boolean;

/** All user-facing strings, structured so a consumer can fully localize — never hardcode English here. */
export interface ComboboxLabels {
	placeholder?: string;
	searchPlaceholder?: string;
	empty?: string;
	typeToSearch?: string;
	retry?: string;
	clearSelection?: string;
	removeChip?: (label: string) => string;
	create?: (query: string) => string;
	creating?: (query: string) => string;
}

export interface ComboboxIndicatorPayload {
	open: boolean;
}

export interface ComboboxEmptyPayload {
	query: string;
}

export interface ComboboxCreateItemPayload {
	query: string;
	active: boolean;
	creating: boolean;
}

export interface ComboboxProps<
	T extends ComboboxValue = ComboboxValue
> extends ComboboxVariantProps,
		Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'prefix'> {
	/** Option list. Supply it from anywhere — static array, TanStack Query, plain fetch. */
	options?: ComboboxOption<T>[];
	value?: T | T[];
	/** Debounced query. Bind it and use it as your data-layer key — fetching/caching/racing is entirely up to you. */
	search?: string;
	multiple?: boolean;
	name?: string;
	id?: string;
	class?: string;
	/** Bindable reference to the root wrapper element. */
	ref?: HTMLDivElement | null;
	/** Bindable reference to the interactive trigger element. */
	triggerRef?: HTMLDivElement | null;
	/** Bindable reference to the search input element inside the dropdown. */
	inputRef?: HTMLInputElement | null;
	/** Bindable reference to the floating content panel element. */
	contentRef?: HTMLDivElement | null;
	classes?: {
		trigger?: string;
		content?: string;
		input?: string;
		option?: string;
		createOption?: string;
		chip?: string;
		chipRemove?: string;
		chipCounter?: string;
		prefix?: string;
		clearButton?: string;
		indicator?: string;
		listbox?: string;
		groupHeader?: string;
		empty?: string;
	};
	labels?: ComboboxLabels;
	/** Skip local filtering because the data source already filtered server-side. */
	manualFilter?: boolean;
	loading?: boolean;
	error?: string;
	disabled?: boolean;
	invalid?: boolean;
	clearable?: boolean;
	/**
	 * Allows users to create a new option when typing a term not present in the options list.
	 * When chosen, `onCreate` is invoked with the typed query.
	 */
	creatable?: boolean;
	/** Whether an asynchronous create operation is currently in flight. Automatically tracked if `onCreate` returns a Promise. */
	creating?: boolean;
	/** Chips rendered before collapsing the rest into a "+N" counter. */
	maxChips?: number;
	/** Leading adornment in the trigger: plain text or a snippet (icon, badge, …). */
	prefix?: Snippet | string;
	searchDebounce?: number;
	filter?: ComboboxFilter<T>;
	portalTarget?: HTMLElement | string;
	onSearchChange?: (query: string) => void;
	onValueChange?: (value: T | T[] | undefined) => void;
	/** Callback invoked when the user selects the create action. Can return a Promise to automatically enter pending state. */
	onCreate?: (query: string) => void | Promise<void>;
	onRetry?: () => void;
	/**
	 * Fired once when the listbox is scrolled near its bottom edge — wire this
	 * up to fetch and append the next page. The component only signals; it
	 * does not fetch, merge, or track pages itself (same "consumer owns the
	 * data layer" philosophy as `onSearchChange`). Re-arms automatically once
	 * `options` or `loading` changes, so a page landing (or a load failing and
	 * resetting `loading`) is what allows the next threshold-cross to fire again.
	 */
	onEndReached?: () => void;
	item?: Snippet<[{ option: ComboboxOption<T>; active: boolean; selected: boolean }]>;
	createItem?: Snippet<[ComboboxCreateItemPayload]>;
	indicator?: Snippet<[ComboboxIndicatorPayload]>;
	empty?: Snippet<[ComboboxEmptyPayload]>;
}

