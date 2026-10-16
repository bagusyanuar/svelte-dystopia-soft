<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { floating } from '../../utils/floating.js';
	import { portal } from '../../utils/portal.js';
	import { createPresence } from '../../utils/presence.svelte.js';
	import { createDismissableLayer } from '../../utils/dismissable-layer.js';
	import type { PopoverProps } from './Popover.types.js';

	let {
		class: className,
		classes,
		ref = $bindable(null),
		triggerRef = $bindable(null),
		contentRef = $bindable(null),
		open = $bindable(false),
		placement = 'bottom-start',
		offset = 8,
		portalTarget,
		trigger,
		children,
		onOpenChange,
		...restProps
	}: PopoverProps = $props();

	const contentId = $props.id();

	let triggerEl = $state<HTMLButtonElement | null>(null);
	let contentEl = $state<HTMLDivElement | null>(null);

	$effect(() => {
		ref = triggerEl ?? ref;
		triggerRef = triggerEl ?? triggerRef;
	});

	$effect(() => {
		contentRef = contentEl ?? contentRef;
	});

	const presence = createPresence(
		() => open,
		() => contentEl
	);

	function setOpen(next: boolean): void {
		if (open === next) return;
		open = next;
		onOpenChange?.(next);
	}

	function close(): void {
		setOpen(false);
	}

	function toggle(): void {
		setOpen(!open);
	}

	$effect(() => {
		if (!open) return;

		contentEl?.focus({ preventScroll: true });

		return createDismissableLayer(() => [triggerEl, contentEl], {
			onPointerDownOutside: close,
			onEscapeKeydown: (event) => {
				event.preventDefault();
				close();
				triggerEl?.focus();
			}
		});
	});

	const triggerProps = $derived({
		...restProps,
		type: 'button' as const,
		'aria-haspopup': 'dialog' as const,
		'aria-expanded': open,
		'aria-controls': contentId,
		'data-state': open ? 'open' : 'closed',
		'data-slot': 'popover-trigger',
		class: cn(
			'inline-flex h-10 cursor-pointer items-center justify-center gap-tight rounded-md border border-border px-control-x text-sm leading-snug font-medium text-foreground-soft transition-colors duration-150 hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
			className,
			classes?.trigger
		),
		onclick: toggle
	});
</script>

<button bind:this={triggerEl} {...triggerProps}>
	{@render trigger({ open, close })}
</button>

{#if presence.current}
	<div
		bind:this={contentEl}
		id={contentId}
		role="dialog"
		tabindex="-1"
		data-slot="popover-content"
		data-state={open ? 'open' : 'closed'}
		data-placement={placement}
		inert={!open}
		use:portal={{ target: portalTarget }}
		use:floating={{ reference: triggerEl, placement, offset }}
		class={cn(
			'z-50 rounded-lg border border-border bg-surface p-4 text-sm text-foreground-muted shadow-sm focus-visible:outline-none',
			classes?.content
		)}
	>
		{@render children({ open, close })}
	</div>
{/if}
