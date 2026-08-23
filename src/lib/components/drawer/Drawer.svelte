<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { portal } from '../../utils/portal.js';
	import { createPresence } from '../../utils/presence.svelte.js';
	import { createDismissableLayer } from '../../utils/dismissable-layer.js';
	import { focusTrap } from '../../utils/focus-trap.js';
	import { lockScroll } from '../../utils/scroll-lock.js';
	import { createIds } from '../../utils/id.js';
	import { drawerVariants } from './Drawer.variants.js';
	import type { DrawerProps } from './Drawer.types.js';

	let {
		classes,
		open = $bindable(false),
		side = 'right',
		portalTarget,
		labels,
		trigger,
		title,
		description,
		children,
		...restProps
	}: DrawerProps = $props();

	const baseId = $props.id();
	const ids = createIds(baseId, 'title', 'description', 'content');

	let triggerEl = $state<HTMLButtonElement | null>(null);
	let contentEl = $state<HTMLDivElement | null>(null);
	const presence = createPresence(
		() => open,
		() => contentEl
	);

	// Captured with `$effect.pre` — which runs before the DOM patch that mounts
	// the content — so this reads whatever had focus right before opening,
	// rather than the content's own first focusable element that `focusTrap`
	// moves focus to a moment later in the same update.
	let restoreFocusEl: HTMLElement | null = null;
	$effect.pre(() => {
		if (open) restoreFocusEl = document.activeElement as HTMLElement | null;
	});

	function close() {
		open = false;
	}

	$effect(() => {
		if (!open) return;

		const unlockScroll = lockScroll();
		const destroyLayer = createDismissableLayer(() => [triggerEl, contentEl], {
			onPointerDownOutside: close,
			onEscapeKeydown: (event) => {
				event.preventDefault();
				close();
			}
		});

		return () => {
			unlockScroll();
			destroyLayer();
			restoreFocusEl?.focus({ preventScroll: true });
		};
	});

	const triggerProps = $derived({
		...restProps,
		type: 'button' as const,
		'aria-haspopup': 'dialog' as const,
		'aria-expanded': open,
		'aria-controls': ids.content,
		'data-state': open ? 'open' : 'closed',
		class: cn(
			'inline-flex h-10 cursor-pointer items-center justify-center gap-tight rounded-md border border-border px-control-x text-sm leading-snug font-medium text-foreground-soft transition-colors duration-150 hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
			classes?.trigger
		),
		onclick: () => (open = !open)
	});
</script>

<button bind:this={triggerEl} {...triggerProps}>
	{@render trigger()}
</button>

{#if presence.current}
	<!-- Reuses Dialog's overlay animation — same visual role (dimming scrim), no need for a second copy. -->
	<div
		aria-hidden="true"
		data-slot="dialog-overlay"
		data-state={open ? 'open' : 'closed'}
		use:portal={{ target: portalTarget }}
		class={cn('fixed inset-0 z-50 bg-foreground/40', classes?.overlay)}
	></div>
	<!--
	  No centring wrapper needed here unlike Dialog — the content is positioned
	  by `inset-*` (edge-anchored), not a transform, so `portal` and `focusTrap`
	  can sit directly on this element without the wrapper trick Dialog needs.
	-->
	<div
		bind:this={contentEl}
		id={ids.content}
		role="dialog"
		data-slot="drawer-content"
		data-side={side}
		aria-modal="true"
		aria-labelledby={ids.title}
		aria-describedby={description ? ids.description : undefined}
		data-state={open ? 'open' : 'closed'}
		tabindex="-1"
		inert={!open}
		use:portal={{ target: portalTarget }}
		use:focusTrap={{ enabled: open }}
		class={cn(drawerVariants({ side }), classes?.content)}
	>
		<h2
			id={ids.title}
			class={cn('pr-8 text-lg leading-tight font-medium text-foreground', classes?.title)}
		>
			{@render title()}
		</h2>
		{#if description}
			<p
				id={ids.description}
				class={cn('mt-1 text-sm leading-snug text-foreground-subtle', classes?.description)}
			>
				{@render description()}
			</p>
		{/if}
		<div class="mt-4 min-h-0 flex-1">
			{@render children()}
		</div>
		<button
			type="button"
			onclick={close}
			aria-label={labels?.close ?? 'Close'}
			class={cn(
				'absolute top-4 right-4 inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-foreground-faint transition-colors duration-150 hover:bg-surface-subtle hover:text-foreground-soft focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
				classes?.close
			)}
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
	</div>
{/if}
