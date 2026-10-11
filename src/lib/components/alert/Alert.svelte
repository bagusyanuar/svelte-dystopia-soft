<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { alertVariants } from './Alert.variants.js';
	import type { AlertProps, AlertVariant } from './Alert.types.js';

	let {
		ref = $bindable(null),
		variant = 'default',
		class: className,
		classes,
		icon,
		title,
		description,
		children,
		...restProps
	}: AlertProps = $props();

	const tones = {
		default: 'text-foreground-soft',
		danger: 'text-danger',
		warning: 'text-warning',
		success: 'text-success'
	} as const;
	const activeVariant = $derived((variant ?? 'default') as AlertVariant);
	const tone = $derived(tones[activeVariant]);
	const snippetPayload = $derived({ variant: activeVariant });
</script>

<div
	bind:this={ref}
	role="alert"
	data-variant={activeVariant}
	class={cn(alertVariants({ variant }), className)}
	{...restProps}
>
	{#if icon}
		<span aria-hidden="true" class={cn('shrink-0', tone, classes?.icon)}>
			{@render icon(snippetPayload)}
		</span>
	{/if}
	<div class={cn('min-w-0 flex-1 space-y-1', classes?.content)}>
		{#if title}
			<p class={cn('leading-snug font-medium', tone, classes?.title)}>
				{@render title(snippetPayload)}
			</p>
		{/if}
		{#if description}
			<p class={cn('leading-snug text-foreground-subtle', classes?.description)}>
				{@render description(snippetPayload)}
			</p>
		{/if}
		{@render children?.(snippetPayload)}
	</div>
</div>
