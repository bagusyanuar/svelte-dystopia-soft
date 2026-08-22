<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { buttonVariants } from './Button.variants.js';
	import type { ButtonProps } from './Button.types.js';

	let {
		variant,
		size,
		class: className,
		ref = $bindable(null),
		children,
		child,
		isLoading = false,
		loading,
		disabled = false,
		...restProps
	}: ButtonProps = $props();

	const mergedProps = $derived({
		...restProps,
		class: cn(buttonVariants({ variant, size }), className),
		disabled: disabled || isLoading,
		'aria-busy': isLoading || undefined
	});
</script>

{#snippet defaultLoading()}
	<svg viewBox="0 0 24 24" fill="none" class="size-4 animate-spin" aria-hidden="true">
		<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" stroke-opacity="0.25" />
		<path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
	</svg>
{/snippet}

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button bind:this={ref} {...mergedProps}>
		{#if isLoading}
			{#if loading}
				{@render loading()}
			{:else}
				{@render defaultLoading()}
			{/if}
		{/if}
		{@render children()}
	</button>
{/if}
