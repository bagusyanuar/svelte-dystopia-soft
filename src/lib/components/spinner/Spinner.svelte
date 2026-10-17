<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { spinnerVariants } from './Spinner.variants.js';
	import type { SpinnerProps } from './Spinner.types.js';

	let {
		size = 'md',
		label,
		classes,
		class: className,
		ref = $bindable(null),
		icon,
		children,
		...restProps
	}: SpinnerProps = $props();

	const isSilent = $derived(label === '');
</script>

<span
	bind:this={ref}
	role={isSilent ? undefined : 'status'}
	aria-label={isSilent ? undefined : (label ?? 'Loading')}
	aria-hidden={isSilent ? 'true' : undefined}
	data-slot="spinner"
	data-size={size}
	class={cn('inline-flex', className, classes?.root)}
	{...restProps}
>
	{#if icon}
		{@render icon({ size })}
	{:else if children}
		{@render children({ size })}
	{:else}
		<svg
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
			data-slot="spinner-icon"
			class={cn(spinnerVariants({ size }), classes?.icon)}
		>
			<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" stroke-opacity="0.25" />
			<path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
		</svg>
	{/if}
</span>
