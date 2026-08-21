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
		muted: 'p'
	};

	let {
		variant = 'body',
		as,
		class: className,
		children,
		...restProps
	}: TypographyProps = $props();

	const tag = $derived(as ?? elementForVariant[variant ?? 'body']);
</script>

<svelte:element this={tag} class={cn(typographyVariants({ variant }), className)} {...restProps}>
	{@render children()}
</svelte:element>
