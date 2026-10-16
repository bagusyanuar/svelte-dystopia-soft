<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { portal } from '../../utils/portal.js';
	import { createPresence } from '../../utils/presence.svelte.js';
	import { createDismissableLayer } from '../../utils/dismissable-layer.js';
	import { focusTrap } from '../../utils/focus-trap.js';
	import { lockScroll } from '../../utils/scroll-lock.js';
	import { createIds } from '../../utils/id.js';
	import type { DialogProps } from './Dialog.types.js';

	let {
		class: className,
		classes,
		ref = $bindable(null),
		triggerRef = $bindable(null),
		contentRef = $bindable(null),
		open = $bindable(false),
		portalTarget,
		labels,
		trigger,
		title,
		description,
		close: closeSnippet,
		children,
		...restProps
	}: DialogProps = $props();

	const baseId = $props.id();
	const ids = createIds(baseId, 'title', 'description', 'content');

	const presence = createPresence(
		() => open,
		() => contentRef
	);

	$effect(() => {
		triggerRef = ref;
	});

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
		const destroyLayer = createDismissableLayer(() => [ref ?? triggerRef, contentRef], {
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
		'data-slot': 'dialog-trigger',
		'data-state': open ? 'open' : 'closed',
		'data-disabled': restProps.disabled ? '' : undefined,
		class: cn(
			'inline-flex h-10 cursor-pointer items-center justify-center gap-tight rounded-md border border-border px-control-x text-sm leading-snug font-medium text-foreground-soft transition-colors duration-150 hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
			classes?.trigger,
			className
		),
		onclick: () => (open = !open)
	});
</script>

<button bind:this={ref} {...triggerProps}>
	{@render trigger({ open })}
</button>

{#if presence.current}
	<!--
	  `data-slot` is what index.css hangs the default enter/exit animation on —
	  a `components`-layer rule, so any `animate-*` utility a consumer passes
	  through `classes` overrides it. See the block in index.css for why the
	  default isn't a utility class here.
	-->
	<div
		aria-hidden="true"
		data-slot="dialog-overlay"
		data-state={open ? 'open' : 'closed'}
		use:portal={{ target: portalTarget }}
		class={cn('fixed inset-0 z-50 bg-overlay backdrop-blur-xs', classes?.overlay)}
	></div>
	<!--
	  Centering lives on this wrapper, not on the content itself, so the
	  content's `transform` (and `translate`) stay free for a consumer's enter/
	  exit animation — the same principle Popover follows by positioning via
	  `left`/`top`. Centering the content with `-translate-x-1/2` instead would
	  silently break every consumer animation: Tailwind v4 compiles that to the
	  standalone `translate` property, which composes *on top of* any
	  `transform`, so a keyframe re-stating `translate(-50%, -50%)` doubles the
	  offset and the dialog flies in from off-centre.
	-->
	<!--
	  `focusTrap` sits here rather than on the content, and *after* `portal`:
	  actions on a child run before the parent is attached, so focusing the
	  content from its own action would fire while this subtree is still
	  detached from the document — where `focus()` silently does nothing. The
	  trap's scope is unchanged either way; the content is this wrapper's only
	  child.
	-->
	<div
		use:portal={{ target: portalTarget }}
		use:focusTrap={{ enabled: open }}
		class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4"
	>
		<div
			bind:this={contentRef}
			id={ids.content}
			role="dialog"
			data-slot="dialog-content"
			aria-modal="true"
			aria-labelledby={ids.title}
			aria-describedby={description ? ids.description : undefined}
			data-state={open ? 'open' : 'closed'}
			tabindex="-1"
			inert={!open}
			class={cn(
				'pointer-events-auto relative w-full max-w-md rounded-lg border border-border bg-surface p-surface shadow-sm focus-visible:outline-none dark:border-primary/30 dark:shadow-[0_0_35px_0_oklch(51.1%_0.12_186.391/0.3),0_20px_25px_-5px_rgba(0,0,0,0.85)]',
				classes?.content
			)}
		>
			<h2
				id={ids.title}
				data-slot="dialog-title"
				class={cn('pr-8 text-lg leading-tight font-medium text-foreground', classes?.title)}
			>
				{@render title({ open })}
			</h2>
			{#if description}
				<p
					id={ids.description}
					data-slot="dialog-description"
					class={cn('mt-1 text-sm leading-snug text-foreground-subtle', classes?.description)}
				>
					{@render description({ open })}
				</p>
			{/if}
			{#if children}
				<div data-slot="dialog-body" class={cn('mt-4', classes?.body)}>
					{@render children({ open, close })}
				</div>
			{/if}
			{#if closeSnippet}
				{@render closeSnippet({ close })}
			{:else}
				<button
					type="button"
					onclick={close}
					aria-label={labels?.close ?? 'Close'}
					data-slot="dialog-close"
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
						class={cn('size-4', classes?.closeIcon)}
					>
						<path d="M18 6 6 18" />
						<path d="m6 6 12 12" />
					</svg>
				</button>
			{/if}
		</div>
	</div>
{/if}
