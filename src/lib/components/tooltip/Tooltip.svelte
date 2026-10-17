<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { floating } from '../../utils/floating.js';
	import { portal } from '../../utils/portal.js';
	import { createPresence } from '../../utils/presence.svelte.js';
	import type { TooltipProps } from './Tooltip.types.js';

	let {
		as = 'span',
		class: className,
		classes,
		ref = $bindable(null),
		triggerRef = $bindable(null),
		contentRef = $bindable(null),
		arrowRef = $bindable(null),
		defaultOpen = false,
		open = $bindable(defaultOpen),
		placement = 'top',
		offset = 8,
		delayDuration = 700,
		showArrow = false,
		disabled = false,
		portalTarget,
		content,
		contentProps,
		children,
		onOpenChange,
		onmouseenter,
		onmouseleave,
		onfocusin,
		onfocusout,
		onkeydown,
		...restProps
	}: TooltipProps = $props();

	const contentId = $props.id();

	let triggerEl = $state<HTMLElement | null>(null);
	let contentEl = $state<HTMLDivElement | null>(null);
	let arrowEl = $state<HTMLDivElement | null>(null);

	$effect(() => {
		ref = triggerEl ?? ref;
		triggerRef = triggerEl ?? triggerRef;
	});

	$effect(() => {
		contentRef = contentEl ?? contentRef;
	});

	$effect(() => {
		arrowRef = arrowEl ?? arrowRef;
	});

	const presence = createPresence(
		() => open,
		() => contentEl
	);

	let showTimer: ReturnType<typeof setTimeout> | undefined;

	function setOpen(next: boolean): void {
		if (open === next) return;
		open = next;
		onOpenChange?.(next);
	}

	function showNow(): void {
		if (disabled) return;
		clearTimeout(showTimer);
		setOpen(true);
	}

	function scheduleShow(): void {
		if (open || disabled) return;
		clearTimeout(showTimer);
		showTimer = setTimeout(() => {
			if (!disabled) setOpen(true);
		}, delayDuration);
	}

	function hide(): void {
		clearTimeout(showTimer);
		setOpen(false);
	}

	$effect(() => {
		if (disabled && open) {
			hide();
		}
	});

	function handleMouseEnter(event: MouseEvent & { currentTarget: HTMLElement }) {
		onmouseenter?.(event);
		if (!event.defaultPrevented && !disabled) {
			scheduleShow();
		}
	}

	function handleMouseLeave(event: MouseEvent & { currentTarget: HTMLElement }) {
		onmouseleave?.(event);
		hide();
	}

	function handleFocusIn(event: FocusEvent & { currentTarget: HTMLElement }) {
		onfocusin?.(event);
		if (!event.defaultPrevented && !disabled) {
			showNow();
		}
	}

	function handleFocusOut(event: FocusEvent & { currentTarget: HTMLElement }) {
		onfocusout?.(event);
		hide();
	}

	function handleKeyDown(event: KeyboardEvent & { currentTarget: HTMLElement }) {
		onkeydown?.(event);
		if (!event.defaultPrevented && event.key === 'Escape') {
			hide();
		}
	}

	// `children` is often an existing interactive element (a button, a link) —
	// that's what actually receives focus, not this wrapping span. Screen
	// readers only announce `aria-describedby` on the focused element, so it
	// has to land on the real focusable descendant when there is one, not on
	// the span. Plain-text content has no such descendant and falls back to
	// the span itself.
	$effect(() => {
		if (!triggerEl) return;

		const describedTarget =
			triggerEl.querySelector<HTMLElement>(
				'button, a[href], input, select, textarea, [tabindex]'
			) ?? triggerEl;
		describedTarget.setAttribute('aria-describedby', contentId);

		return () => {
			describedTarget.removeAttribute('aria-describedby');
		};
	});

	const triggerProps = $derived({
		...restProps,
		'data-slot': 'tooltip-trigger',
		'data-state': open ? 'open' : 'closed',
		'data-disabled': disabled ? '' : undefined,
		'data-placement': placement,
		class: cn(
			as === 'div' ? 'flex' : 'inline-flex',
			classes?.trigger,
			className
		),
		onmouseenter: handleMouseEnter,
		onmouseleave: handleMouseLeave,
		onfocusin: handleFocusIn,
		onfocusout: handleFocusOut,
		onkeydown: handleKeyDown
	});
</script>

{#if as === 'div'}
	<div bind:this={triggerEl} {...triggerProps}>
		{@render children?.({ open, close: hide })}
	</div>
{:else}
	<span bind:this={triggerEl} {...triggerProps}>
		{@render children?.({ open, close: hide })}
	</span>
{/if}

{#if presence.current}
	<div
		bind:this={contentEl}
		id={contentId}
		role="tooltip"
		data-slot="tooltip-content"
		data-state={open ? 'open' : 'closed'}
		data-placement={placement}
		use:portal={{ target: portalTarget }}
		use:floating={{ reference: triggerEl, placement, offset, arrowEl: showArrow ? arrowEl : null }}
		class={cn(
			'group pointer-events-none z-50 rounded-md bg-foreground px-2 py-1 text-xs text-surface shadow-xs',
			classes?.content,
			contentProps?.class
		)}
		{...contentProps}
	>
		{#if typeof content === 'string'}
			{content}
		{:else}
			{@render content?.({ open, close: hide })}
		{/if}
		{#if showArrow}
			<div
				bind:this={arrowEl}
				data-slot="tooltip-arrow"
				class={cn(
					'absolute size-2 rotate-45 bg-foreground group-data-[placement=bottom]:-top-1 group-data-[placement=left]:-right-1 group-data-[placement=right]:-left-1 group-data-[placement=top]:-bottom-1',
					classes?.arrow
				)}
			></div>
		{/if}
	</div>
{/if}

