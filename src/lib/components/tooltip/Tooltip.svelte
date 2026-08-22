<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { floating } from '../../utils/floating.js';
	import { portal } from '../../utils/portal.js';
	import { createPresence } from '../../utils/presence.svelte.js';
	import type { TooltipProps } from './Tooltip.types.js';

	let {
		classes,
		open = $bindable(false),
		placement = 'top',
		offset = 8,
		delayDuration = 700,
		showArrow = false,
		portalTarget,
		content,
		children,
		...restProps
	}: TooltipProps = $props();

	const contentId = $props.id();

	let triggerEl = $state<HTMLSpanElement | null>(null);
	let contentEl = $state<HTMLDivElement | null>(null);
	let arrowEl = $state<HTMLDivElement | null>(null);
	const presence = createPresence(
		() => open,
		() => contentEl
	);

	let showTimer: ReturnType<typeof setTimeout> | undefined;

	function scheduleShow() {
		if (open) return;
		clearTimeout(showTimer);
		showTimer = setTimeout(() => (open = true), delayDuration);
	}

	function showNow() {
		clearTimeout(showTimer);
		open = true;
	}

	function hide() {
		clearTimeout(showTimer);
		open = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') hide();
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
		'data-state': open ? 'open' : 'closed',
		class: cn('inline-flex', classes?.trigger),
		onmouseenter: scheduleShow,
		onmouseleave: hide,
		onfocusin: showNow,
		onfocusout: hide,
		onkeydown: handleKeydown
	});
</script>

<span bind:this={triggerEl} {...triggerProps}>
	{@render children()}
</span>

{#if presence.current}
	<div
		bind:this={contentEl}
		id={contentId}
		role="tooltip"
		data-state={open ? 'open' : 'closed'}
		use:portal={{ target: portalTarget }}
		use:floating={{ reference: triggerEl, placement, offset, arrowEl: showArrow ? arrowEl : null }}
		class={cn(
			'group pointer-events-none z-50 rounded-md bg-foreground px-2 py-1 text-xs text-surface shadow-md',
			classes?.content
		)}
	>
		{@render content()}
		{#if showArrow}
			<div
				bind:this={arrowEl}
				class={cn(
					'absolute size-2 rotate-45 bg-foreground group-data-[placement=bottom]:-top-1 group-data-[placement=left]:-right-1 group-data-[placement=right]:-left-1 group-data-[placement=top]:-bottom-1',
					classes?.arrow
				)}
			></div>
		{/if}
	</div>
{/if}
