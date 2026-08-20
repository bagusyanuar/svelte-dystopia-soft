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
		...restProps
	}: ButtonProps = $props();

	const mergedProps = $derived({
		class: cn(buttonVariants({ variant, size }), className),
		...restProps
	});
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button bind:this={ref} {...mergedProps}>
		{@render children()}
	</button>
{/if}
