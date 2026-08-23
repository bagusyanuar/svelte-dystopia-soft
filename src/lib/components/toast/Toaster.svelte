<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { portal } from '../../utils/portal.js';
	import { toastStore } from './toast-store.svelte.js';
	import ToastItem from './ToastItem.svelte';
	import type { ToasterProps, ToastPosition } from './Toaster.types.js';

	let {
		position = 'bottom-right',
		max = 3,
		portalTarget,
		class: className,
		classes,
		labels
	}: ToasterProps = $props();

	const positionClasses: Record<ToastPosition, string> = {
		'top-left': 'top-0 left-0 items-start',
		'top-center': 'top-0 left-1/2 -translate-x-1/2 items-center',
		'top-right': 'top-0 right-0 items-end',
		'bottom-left': 'bottom-0 left-0 items-start',
		'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 items-center',
		'bottom-right': 'bottom-0 right-0 items-end'
	};

	// DOM order controls stacking direction: the last child sits nearest the
	// viewport's anchored edge. Newest-last (array order) already reads
	// correctly for the bottom corners; the top corners need it reversed so
	// the newest toast still lands next to the edge it's anchored to.
	const visible = $derived(
		position.startsWith('top')
			? toastStore.toasts.slice(-max).reverse()
			: toastStore.toasts.slice(-max)
	);
</script>

<div
	use:portal={{ target: portalTarget }}
	role="region"
	aria-label={labels?.region ?? 'Notifications'}
	class={cn(
		'pointer-events-none fixed z-50 flex w-full max-w-sm flex-col gap-cozy p-4',
		positionClasses[position],
		className,
		classes?.viewport
	)}
>
	{#each visible as item (item.id)}
		<ToastItem toast={item} onDismiss={toastStore.dismiss} {classes} {labels} />
	{/each}
</div>
