<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { floating } from '../../utils/floating.js';
	import { portal } from '../../utils/portal.js';
	import { createPresence } from '../../utils/presence.svelte.js';
	import type { PopoverProps } from './Popover.types.js';

	let {
		classes,
		open = $bindable(false),
		placement = 'bottom-start',
		offset = 8,
		portalTarget,
		trigger,
		children,
		...restProps
	}: PopoverProps = $props();

	const contentId = $props.id();

	let triggerEl = $state<HTMLButtonElement | null>(null);
	let contentEl = $state<HTMLDivElement | null>(null);
	const presence = createPresence(
		() => open,
		() => contentEl
	);

	function close() {
		open = false;
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

		contentEl?.focus({ preventScroll: true });
		document.addEventListener('pointerdown', handlePointerDown);
		document.addEventListener('keydown', handleKeydown);

		return () => {
			document.removeEventListener('pointerdown', handlePointerDown);
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	const triggerProps = $derived({
		...restProps,
		type: 'button' as const,
		'aria-haspopup': 'dialog' as const,
		'aria-expanded': open,
		'aria-controls': contentId,
		'data-state': open ? 'open' : 'closed',
		class: cn(
			'inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-foreground-soft transition-colors duration-150 hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
			classes?.trigger
		),
		onclick: () => (open = !open)
	});
</script>

<button bind:this={triggerEl} {...triggerProps}>
	{@render trigger()}
</button>

{#if presence.current}
	<div
		bind:this={contentEl}
		id={contentId}
		role="dialog"
		tabindex="-1"
		data-state={open ? 'open' : 'closed'}
		inert={!open}
		use:portal={{ target: portalTarget }}
		use:floating={{ reference: triggerEl, placement, offset }}
		class={cn(
			'z-50 rounded-lg border border-border bg-surface p-4 text-sm text-foreground-muted shadow-md focus-visible:outline-none',
			classes?.content
		)}
	>
		{@render children()}
	</div>
{/if}
