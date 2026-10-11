<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { BreadcrumbSeparatorProps } from './BreadcrumbSeparator.types.js';

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	}: BreadcrumbSeparatorProps = $props();
</script>

<li
	bind:this={ref}
	role="presentation"
	aria-hidden="true"
	class={cn('text-foreground-faint [&_svg]:size-3.5', className)}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else}
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="m9 18 6-6-6-6" />
		</svg>
	{/if}
</li>
