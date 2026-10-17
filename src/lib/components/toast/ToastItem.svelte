<script lang="ts">
	import { onDestroy, untrack, type Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import { createPresence } from '../../utils/presence.svelte.js';
	import { toastVariants } from './Toaster.variants.js';
	import type { ToastRecord, ToastVariant } from './toast-store.svelte.js';

	let {
		toast: item,
		onDismiss,
		classes,
		labels
	}: {
		toast: ToastRecord;
		onDismiss: (id: string) => void;
		classes?: {
			item?: string;
			icon?: string;
			content?: string;
			title?: string;
			description?: string;
			action?: string;
			close?: string;
		};
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
		if (!presence.current) {
			item.onDismiss?.(item.id);
			onDismiss(item.id);
		}
	});

	const tones: Record<ToastVariant, string> = {
		default: 'text-foreground-soft',
		info: 'text-info',
		success: 'text-success',
		warning: 'text-warning',
		danger: 'text-danger'
	};
	const tone = $derived(tones[item.variant]);
</script>

{#snippet defaultIcon(variant: ToastVariant)}
	{#if variant === 'success'}
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
			<circle cx="12" cy="12" r="10" />
			<path d="m9 12 2 2 4-4" />
		</svg>
	{:else if variant === 'danger'}
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
			<circle cx="12" cy="12" r="10" />
			<line x1="12" y1="8" x2="12" y2="12" />
			<line x1="12" y1="16" x2="12.01" y2="16" />
		</svg>
	{:else if variant === 'warning'}
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
			<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
			<line x1="12" y1="9" x2="12" y2="13" />
			<line x1="12" y1="17" x2="12.01" y2="17" />
		</svg>
	{:else if variant === 'info'}
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
			<circle cx="12" cy="12" r="10" />
			<line x1="12" y1="16" x2="12" y2="12" />
			<line x1="12" y1="8" x2="12.01" y2="8" />
		</svg>
	{/if}
{/snippet}

{#if presence.current}
	<div
		bind:this={rootEl}
		role={item.variant === 'danger' ? 'alert' : 'status'}
		aria-atomic="true"
		data-slot="toast"
		data-variant={item.variant}
		data-state={closing ? 'closed' : 'open'}
		onpointerenter={pause}
		onpointerleave={schedule}
		class={cn(toastVariants({ variant: item.variant }), classes?.item)}
	>
		{#if item.icon !== false && (item.icon !== undefined || item.variant !== 'default')}
			<span
				aria-hidden="true"
				data-slot="toast-icon"
				class={cn('mt-0.5 shrink-0', tone, classes?.icon)}
			>
				{#if item.icon}
					{@render (item.icon as Snippet)()}
				{:else}
					{@render defaultIcon(item.variant)}
				{/if}
			</span>
		{/if}
		<div class={cn('min-w-0 flex-1 space-y-0.5', classes?.content)} data-slot="toast-content">
			<p class={cn('leading-snug font-medium text-foreground', classes?.title)} data-slot="toast-title">
				{item.title}
			</p>
			{#if item.description}
				<p class={cn('leading-snug text-foreground-subtle', classes?.description)} data-slot="toast-description">
					{item.description}
				</p>
			{/if}
			{#if item.action}
				<div class="pt-1">
					{#if typeof item.action === 'object' && 'label' in item.action && 'onClick' in item.action}
						<button
							type="button"
							data-slot="toast-action"
							onclick={(e) => {
								(item.action as { label: string; onClick: (event: MouseEvent) => void }).onClick(e);
								close();
							}}
							class={cn(
								'inline-flex shrink-0 items-center justify-center rounded px-2 py-0.5 text-xs font-medium text-foreground bg-surface-subtle hover:bg-surface-hover transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
								classes?.action
							)}
						>
							{(item.action as { label: string; onClick: (event: MouseEvent) => void }).label}
						</button>
					{:else}
						<span data-slot="toast-action" class={classes?.action}>
							{@render (item.action as Snippet)()}
						</span>
					{/if}
				</div>
			{/if}
		</div>
		<button
			type="button"
			onclick={close}
			aria-label={labels?.close ?? 'Close'}
			data-slot="toast-close"
			class={cn(
				'inline-flex size-6 shrink-0 -mr-1 -mt-0.5 cursor-pointer items-center justify-center rounded-md text-foreground-faint transition-colors duration-150 hover:bg-surface-subtle hover:text-foreground-soft focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
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

