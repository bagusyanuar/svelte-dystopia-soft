<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { BreadcrumbLinkProps } from './BreadcrumbLink.types.js';

	let { class: className, child, children, ...restProps }: BreadcrumbLinkProps = $props();

	const mergedProps = $derived({
		...restProps,
		class: cn(
			'transition-colors duration-150 hover:text-foreground-soft focus-visible:underline focus-visible:outline-none',
			className
		)
	});
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<a {...mergedProps}>
		{@render children()}
	</a>
{/if}
