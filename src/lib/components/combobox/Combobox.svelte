<script lang="ts" generics="T extends ComboboxValue">
	import { cn } from '../../utils/cn.js';
	import { floating } from '../../utils/floating.js';
	import { portal } from '../../utils/portal.js';
	import { createPresence } from '../../utils/presence.svelte.js';
	import { createDismissableLayer } from '../../utils/dismissable-layer.js';
	import { createIds } from '../../utils/id.js';
	import { Spinner } from '../spinner/index.js';
	import { ComboboxState, splitMatch } from './combobox-state.svelte.js';
	import {
		comboboxVariants,
		comboboxOptionVariants,
		comboboxChipVariants
	} from './Combobox.variants.js';
	import type { ComboboxOption, ComboboxProps, ComboboxValue } from './Combobox.types.js';

	let {
		options = [],
		value = $bindable(),
		search = $bindable(''),
		multiple = false,
		name,
		id,
		class: className,
		classes,
		labels,
		size,
		manualFilter = false,
		loading = false,
		error,
		disabled = false,
		invalid = false,
		clearable = false,
		maxChips = 3,
		prefix,
		searchDebounce = 250,
		filter,
		portalTarget,
		onSearchChange,
		onValueChange,
		onRetry,
		onEndReached,
		item,
		empty
	}: ComboboxProps<T> = $props();

	const uid = $props.id();
	const ids = createIds(uid, 'listbox');

	let triggerEl = $state<HTMLDivElement | null>(null);
	let contentEl = $state<HTMLDivElement | null>(null);
	let inputEl = $state<HTMLInputElement | null>(null);
	let listEl = $state<HTMLElement | null>(null);

	const combobox = new ComboboxState<T>({
		get options() {
			return options;
		},
		get value() {
			return value;
		},
		get multiple() {
			return multiple;
		},
		get manualFilter() {
			return manualFilter;
		},
		get searchDebounce() {
			return searchDebounce;
		},
		get filter() {
			return filter;
		},
		setValue(next) {
			value = next;
			onValueChange?.(next);
		},
		setSearch(query) {
			if (query === search) return;
			search = query;
			onSearchChange?.(query);
		}
	});

	const presence = createPresence(
		() => combobox.open,
		() => contentEl
	);

	const visibleChips = $derived(combobox.selectedItems.slice(0, maxChips));
	const hiddenChipCount = $derived(Math.max(0, combobox.selectedItems.length - maxChips));
	const showClear = $derived(clearable && !disabled && combobox.values.length > 0);
	const activeId = $derived(
		combobox.filtered.length > 0 ? `${ids.listbox}-opt-${combobox.activeIndex}` : undefined
	);
	const showTypeToSearch = $derived(
		manualFilter && !loading && !error && combobox.inputValue.trim() === '' && options.length === 0
	);
	const showSkeleton = $derived(loading && combobox.filtered.length === 0);

	// Keeps labels of currently selected options available after `options` changes
	// (relevant in remote-search mode, where `options` is replaced every query).
	$effect(() => {
		combobox.cacheSelected();
	});

	$effect(() => {
		void combobox.filtered;
		combobox.clampActive();
	});

	$effect(() => () => combobox.destroy());

	$effect(() => {
		if (!combobox.open) return;

		// `contentEl` is itself tracked $state, so reading it makes this effect
		// re-run once the portalled panel actually mounts — see Dropdown.svelte
		// for the same pattern.
		if (!contentEl) return;

		inputEl?.focus();

		return createDismissableLayer(() => [triggerEl, contentEl], {
			onPointerDownOutside: () => combobox.closeMenu(),
			onEscapeKeydown: (event) => {
				event.preventDefault();
				closeAndFocusTrigger();
			}
		});
	});

	$effect(() => {
		if (!combobox.open) return;
		const index = combobox.activeIndex;
		listEl
			?.querySelector<HTMLElement>(`[data-index="${index}"]`)
			?.scrollIntoView({ block: 'nearest' });
	});

	// Guards against `onEndReached` firing repeatedly for every scroll tick
	// while the same page is still in flight. Re-armed below whenever `options`
	// or `loading` changes — a page landing (or a load failing and resetting
	// `loading`) is what allows the next threshold-cross to fire again.
	let endReachedFired = false;

	$effect(() => {
		void options;
		void loading;
		endReachedFired = false;
	});

	function handleListScroll(event: Event): void {
		if (!onEndReached || loading || endReachedFired) return;

		const el = event.currentTarget as HTMLElement;
		const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
		if (distanceToBottom > 48) return;

		endReachedFired = true;
		onEndReached();
	}

	function closeAndFocusTrigger(): void {
		combobox.closeMenu();
		triggerEl?.focus();
	}

	function handleTriggerKeydown(event: KeyboardEvent): void {
		if (disabled) return;

		if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			combobox.openMenu();
			return;
		}
		if (event.key === 'Escape') combobox.closeMenu();
	}

	function handleInputKeydown(event: KeyboardEvent): void {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				combobox.move(1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				combobox.move(-1);
				break;
			case 'Home':
				event.preventDefault();
				combobox.moveTo('first');
				break;
			case 'End':
				event.preventDefault();
				combobox.moveTo('last');
				break;
			case 'Enter':
				event.preventDefault();
				combobox.selectActive();
				break;
			case 'Escape':
				// Handled here so the popup closes and focus returns to the trigger
				// in one step, rather than leaving focus stranded on an unmounting input.
				event.preventDefault();
				closeAndFocusTrigger();
				break;
			case 'Tab':
				combobox.closeMenu();
				break;
			case 'Backspace':
				if (multiple && combobox.inputValue === '') {
					event.preventDefault();
					combobox.popLast();
				}
				break;
		}
	}

	const triggerProps = $derived({
		id,
		role: 'combobox' as const,
		tabindex: disabled ? -1 : 0,
		'aria-expanded': combobox.open,
		'aria-controls': ids.listbox,
		'aria-haspopup': 'listbox' as const,
		'aria-invalid': invalid || undefined,
		'data-invalid': invalid ? '' : undefined,
		'data-disabled': disabled ? '' : undefined,
		onclick: () => !disabled && combobox.toggleMenu(),
		onkeydown: handleTriggerKeydown
	});
</script>

{#snippet optionRow(option: ComboboxOption<T>, index: number)}
	{@const selected = combobox.isSelected(option.value)}
	{@const active = index === combobox.activeIndex}
	<!--
		Keyboard interaction lives on the search input via aria-activedescendant —
		options are never focused themselves.
	-->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		role="option"
		tabindex="-1"
		id={`${ids.listbox}-opt-${index}`}
		data-index={index}
		aria-selected={selected}
		aria-disabled={option.disabled || undefined}
		class={cn(
			comboboxOptionVariants({ active, selected, disabled: !!option.disabled }),
			classes?.option
		)}
		onclick={() => combobox.select(option)}
		onmousedown={(event) => event.preventDefault()}
		onmouseenter={() => combobox.setActive(index)}
	>
		{#if item}
			{@render item({ option, active, selected })}
		{:else}
			<span class="min-w-0 flex-1 truncate">
				{#each splitMatch(option.label, combobox.inputValue) as part, partIndex (partIndex)}
					{#if part.match}
						<mark class="bg-transparent font-semibold text-primary">{part.text}</mark>
					{:else}{part.text}{/if}
				{/each}
			</span>
			{#if selected}
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					class="size-4 shrink-0 text-primary"
				>
					<path d="M20 6 9 17l-5-5" />
				</svg>
			{/if}
		{/if}
	</div>
{/snippet}

<div class={cn('relative w-full', className)}>
	<div
		bind:this={triggerEl}
		{...triggerProps}
		class={cn(comboboxVariants({ size }), showClear ? 'pr-14' : 'pr-9', classes?.trigger)}
	>
		{#if prefix}
			<span class="flex shrink-0 items-center justify-center text-foreground-faint">
				{#if typeof prefix === 'string'}
					<span class="font-medium">{prefix}</span>
				{:else}
					{@render prefix()}
				{/if}
			</span>
		{/if}
		<div class="flex min-w-0 flex-1 flex-wrap items-center gap-tight">
			{#if combobox.selectedItems.length === 0}
				<span class="truncate leading-snug text-foreground-faint">
					{labels?.placeholder ?? 'Select…'}
				</span>
			{:else if multiple}
				{#each visibleChips as chip (chip.value)}
					<span class={cn(comboboxChipVariants(), classes?.chip)}>
						<span class="truncate">{chip.label}</span>
						<button
							type="button"
							tabindex="-1"
							aria-label={labels?.removeChip?.(chip.label) ?? `Remove ${chip.label}`}
							class="rounded-sm p-0.5 transition-colors duration-150 hover:bg-surface-hover"
							onclick={(event) => {
								event.stopPropagation();
								combobox.deselect(chip.value);
							}}
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
								class="size-3"
							>
								<path d="M18 6 6 18" />
								<path d="m6 6 12 12" />
							</svg>
						</button>
					</span>
				{/each}
				{#if hiddenChipCount > 0}
					<span class="text-xs font-medium text-foreground-subtle">+{hiddenChipCount}</span>
				{/if}
			{:else}
				<span class="truncate leading-snug">{combobox.selectedItems[0].label}</span>
			{/if}
		</div>
	</div>

	{#if showClear}
		<button
			type="button"
			tabindex="-1"
			aria-label={labels?.clearSelection ?? 'Clear selection'}
			class="absolute top-1/2 right-8 -translate-y-1/2 rounded-md p-1 text-foreground-faint transition-colors duration-150 hover:bg-surface-subtle hover:text-foreground-muted"
			onclick={() => combobox.clear()}
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
				class="size-4"
			>
				<path d="M18 6 6 18" />
				<path d="m6 6 12 12" />
			</svg>
		</button>
	{/if}

	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		class={cn(
			'pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-foreground-faint transition-transform duration-200',
			combobox.open && 'rotate-180'
		)}
	>
		<path d="m7 15 5 5 5-5" />
		<path d="m7 9 5-5 5 5" />
	</svg>

	{#if name}
		{#if combobox.values.length === 0}
			<input type="hidden" {name} value="" />
		{:else}
			{#each combobox.values as selectedValue (selectedValue)}
				<input type="hidden" {name} value={selectedValue} />
			{/each}
		{/if}
	{/if}
</div>

{#if presence.current}
	<div
		bind:this={contentEl}
		data-slot="combobox-content"
		data-state={combobox.open ? 'open' : 'closed'}
		inert={!combobox.open}
		use:portal={{ target: portalTarget }}
		use:floating={{
			reference: triggerEl,
			placement: 'bottom-start',
			offset: 6,
			matchReferenceWidth: true,
			maxHeight: 320
		}}
		class={cn(
			'z-50 flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-sm',
			classes?.content
		)}
	>
		<div class="flex shrink-0 items-center gap-tight border-b border-border px-compact">
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
				class="size-4 shrink-0 text-foreground-faint"
			>
				<circle cx="11" cy="11" r="8" />
				<path d="m21 21-4.3-4.3" />
			</svg>
			<input
				bind:this={inputEl}
				type="text"
				autocomplete="off"
				spellcheck="false"
				aria-label={labels?.searchPlaceholder ?? 'Search…'}
				aria-autocomplete="list"
				aria-controls={ids.listbox}
				aria-activedescendant={activeId}
				placeholder={labels?.searchPlaceholder ?? 'Search…'}
				value={combobox.inputValue}
				class={cn(
					'h-10 w-full flex-1 bg-transparent text-sm leading-snug text-foreground placeholder:text-foreground-faint focus:outline-none',
					classes?.input
				)}
				oninput={(event) => combobox.setInputValue(event.currentTarget.value)}
				onkeydown={handleInputKeydown}
			/>
			{#if loading}
				<Spinner size="sm" label="" class="shrink-0 text-primary" />
			{/if}
		</div>

		<div
			bind:this={listEl}
			role="listbox"
			id={ids.listbox}
			aria-multiselectable={multiple || undefined}
			class="min-h-0 flex-1 overflow-y-auto p-1"
			onscroll={handleListScroll}
		>
			{#if error}
				<div class="flex flex-col items-center gap-cozy px-compact py-6 text-center">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
						class="size-5 text-danger"
					>
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="8" x2="12" y2="12" />
						<line x1="12" y1="16" x2="12.01" y2="16" />
					</svg>
					<p class="text-sm leading-snug text-foreground-subtle">{error}</p>
					{#if onRetry}
						<button
							type="button"
							class="rounded-md px-2 py-1 text-xs font-medium text-primary transition-colors duration-150 hover:bg-surface-subtle"
							onclick={() => onRetry?.()}
						>
							{labels?.retry ?? 'Retry'}
						</button>
					{/if}
				</div>
			{:else if showSkeleton}
				<div class="flex flex-col gap-tight p-1">
					{#each [0, 1, 2] as skeletonRow (skeletonRow)}
						<div class="h-8 animate-pulse rounded-md bg-surface-subtle"></div>
					{/each}
				</div>
			{:else if showTypeToSearch}
				<p class="px-compact py-6 text-center text-sm leading-snug text-foreground-faint">
					{labels?.typeToSearch ?? 'Type to search…'}
				</p>
			{:else if combobox.filtered.length === 0}
				{#if empty}
					{@render empty()}
				{:else}
					<p class="px-compact py-6 text-center text-sm leading-snug text-foreground-faint">
						{labels?.empty ?? 'No results found.'}
					</p>
				{/if}
			{:else}
				{#each combobox.groups as group (group.label ?? '__ungrouped')}
					{#if group.label}
						<div role="group" aria-label={group.label}>
							<span
								class="block px-compact pt-3 pb-1 text-[11px] font-semibold tracking-wide text-foreground-faint uppercase"
							>
								{group.label}
							</span>
							{#each group.items as entry (entry.option.value)}
								{@render optionRow(entry.option, entry.index)}
							{/each}
						</div>
					{:else}
						{#each group.items as entry (entry.option.value)}
							{@render optionRow(entry.option, entry.index)}
						{/each}
					{/if}
				{/each}
			{/if}
		</div>
	</div>
{/if}
