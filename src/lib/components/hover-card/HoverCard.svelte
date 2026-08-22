<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { floating } from '../../utils/floating.js';
	import { portal } from '../../utils/portal.js';
	import { createPresence } from '../../utils/presence.svelte.js';
	import type { HoverCardProps } from './HoverCard.types.js';

	let {
		classes,
		open = $bindable(false),
		placement = 'bottom',
		offset = 8,
		openDelay = 700,
		closeDelay = 300,
		portalTarget,
		content,
		children,
		...restProps
	}: HoverCardProps = $props();

	const contentId = $props.id();

	// Content is portalled to the end of <body>, so a real page with more
	// focusable content after the trigger will not put the card next in Tab
	// order — the same tradeoff Popover/Dropdown/Tooltip accept for the same
	// reason. Unlike those, this component deliberately never steals focus
	// into the card programmatically (hovering shouldn't move keyboard
	// focus), so reaching it by keyboard means tabbing from the trigger.
	let triggerEl = $state<HTMLSpanElement | null>(null);
	let contentEl = $state<HTMLDivElement | null>(null);
	const presence = createPresence(
		() => open,
		() => contentEl
	);

	let openTimer: ReturnType<typeof setTimeout> | undefined;
	let closeTimer: ReturnType<typeof setTimeout> | undefined;

	function clearTimers() {
		clearTimeout(openTimer);
		clearTimeout(closeTimer);
	}

	function scheduleOpen() {
		clearTimers();
		if (open) return;
		openTimer = setTimeout(() => (open = true), openDelay);
	}

	function openNow() {
		clearTimers();
		open = true;
	}

	function scheduleClose() {
		clearTimers();
		closeTimer = setTimeout(() => (open = false), closeDelay);
	}

	function close() {
		clearTimers();
		open = false;
	}

	// Keeps the card open while focus moves between the trigger and the card
	// (Tab forward into it, Shift+Tab back) — unlike Tooltip, this content is
	// meant to be interactive, so losing focus to it must not count as
	// leaving.
	function handleFocusOut(event: FocusEvent) {
		const next = event.relatedTarget as Node | null;
		if (next && (triggerEl?.contains(next) || contentEl?.contains(next))) return;
		scheduleClose();
	}

	function handlePointerDown(event: PointerEvent) {
		const target = event.target as Node;
		if (triggerEl?.contains(target) || contentEl?.contains(target)) return;
		close();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape') return;
		event.preventDefault();
		close();
		triggerEl?.focus();
	}

	$effect(() => {
		if (!open) return;

		document.addEventListener('pointerdown', handlePointerDown);
		document.addEventListener('keydown', handleKeydown);

		return () => {
			document.removeEventListener('pointerdown', handlePointerDown);
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	const triggerProps = $derived({
		...restProps,
		'data-state': open ? 'open' : 'closed',
		class: cn('inline-flex', classes?.trigger),
		onmouseenter: scheduleOpen,
		onmouseleave: scheduleClose,
		onfocusin: openNow,
		onfocusout: handleFocusOut
	});
</script>

<span bind:this={triggerEl} {...triggerProps}>
	{@render children()}
</span>

{#if presence.current}
	<!--
	  mouseenter/mouseleave here only extend the hover grace period; this is a
	  positioning container, not an interactive control, so it takes no role.
	  Its actual interactive content (links, buttons) carries its own semantics.
	-->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={contentEl}
		id={contentId}
		data-state={open ? 'open' : 'closed'}
		onmouseenter={() => clearTimeout(closeTimer)}
		onmouseleave={scheduleClose}
		onfocusout={handleFocusOut}
		use:portal={{ target: portalTarget }}
		use:floating={{ reference: triggerEl, placement, offset }}
		class={cn(
			'z-50 rounded-lg border border-border bg-surface p-4 text-sm text-foreground-muted shadow-md',
			classes?.content
		)}
	>
		{@render content()}
	</div>
{/if}
