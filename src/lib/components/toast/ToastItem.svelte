<script lang="ts">
	import { onDestroy, untrack } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import { createPresence } from '../../utils/presence.svelte.js';
	import { toastVariants } from './Toaster.variants.js';
	import type { ToastRecord } from './toast-store.svelte.js';

	let {
		toast: item,
		onDismiss,
		classes,
		labels
	}: {
		toast: ToastRecord;
		onDismiss: (id: string) => void;
		classes?: { item?: string; title?: string; description?: string; close?: string };
		labels?: { close?: string };
	} = $props();

	let closing = $state(false);
	let rootEl = $state<HTMLDivElement | null>(null);
	const presence = createPresence(
		() => !closing,
		() => rootEl
	);

	function close() {
		closing = true;
	}

	// Tracks the timer as elapsed/remaining rather than a single deadline so a
	// pointer-hover pause can suspend it and resume with the time actually left,
	// instead of restarting the full duration or firing early.
	let remainingMs = untrack(() => item.duration);
	let startedAt = 0;
	let timeoutId: ReturnType<typeof setTimeout> | undefined;

	function schedule() {
		if (!Number.isFinite(remainingMs) || remainingMs <= 0) return;
		startedAt = Date.now();
		timeoutId = setTimeout(close, remainingMs);
	}

	function pause() {
		if (timeoutId === undefined) return;
		clearTimeout(timeoutId);
		timeoutId = undefined;
		remainingMs -= Date.now() - startedAt;
	}

	// Scheduling the initial timer here, rather than in a mount `$effect`,
	// matches HoverCard's timer handling: it runs synchronously as part of
	// component init instead of being deferred to the next effect flush, so
	// there's no window where the component could be torn down before the
	// timer is ever set.
	schedule();
	onDestroy(() => {
		if (timeoutId !== undefined) clearTimeout(timeoutId);
	});

	$effect(() => {
		if (!presence.current) onDismiss(item.id);
	});
</script>

{#if presence.current}
	<div
		bind:this={rootEl}
		role={item.variant === 'danger' ? 'alert' : 'status'}
		aria-atomic="true"
		data-slot="toast"
		data-state={closing ? 'closed' : 'open'}
		onpointerenter={pause}
		onpointerleave={schedule}
		class={cn(toastVariants({ variant: item.variant }), classes?.item)}
	>
		<div class="min-w-0 flex-1 space-y-1">
			<p class={cn('font-medium text-foreground', classes?.title)}>{item.title}</p>
			{#if item.description}
				<p class={cn('text-foreground-subtle', classes?.description)}>{item.description}</p>
			{/if}
		</div>
		<button
			type="button"
			onclick={close}
			aria-label={labels?.close ?? 'Close'}
			class={cn(
				'inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-lg text-foreground-faint transition-colors duration-150 hover:bg-surface-subtle hover:text-foreground-soft focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
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
