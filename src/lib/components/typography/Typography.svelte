<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { typographyVariants } from './Typography.variants.js';
	import type { TypographyElement, TypographyProps } from './Typography.types.js';
	import type { TypographyVariantProps } from './Typography.variants.js';

	const elementForVariant: Record<
		NonNullable<TypographyVariantProps['variant']>,
		TypographyElement
	> = {
		h1: 'h1',
		h2: 'h2',
		h3: 'h3',
		h4: 'h4',
		body: 'p',
		small: 'small',
		muted: 'p',
		lead: 'p',
		code: 'code',
		blockquote: 'blockquote'
	};

	let {
		variant = 'body',
		as,
		class: className,
		ref = $bindable(null),
		text,
		child,
		children,
		...restProps
	}: TypographyProps = $props();

	const activeVariant = $derived(variant ?? 'body');
	const tag = $derived(as ?? elementForVariant[activeVariant]);

	const mergedProps = $derived({
		'data-slot': 'typography',
		'data-variant': activeVariant,
		class: cn(typographyVariants({ variant: activeVariant }), className),
		...restProps
	});
</script>

{#if child}
	{@render child({
		props: mergedProps,
		variant: activeVariant
	})}
{:else}
	<svelte:element this={tag} bind:this={ref} {...mergedProps}>
		{#if text !== undefined}
			{text}
		{:else}
			{@render children?.()}
		{/if}
	</svelte:element>
{/if}

