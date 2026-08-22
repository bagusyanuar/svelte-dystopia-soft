<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { alertVariants } from './Alert.variants.js';
	import type { AlertProps } from './Alert.types.js';

	let {
		variant,
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
	const tone = $derived(tones[variant ?? 'default']);
</script>

<div role="alert" class={cn(alertVariants({ variant }), className)} {...restProps}>
	{#if icon}
		<span aria-hidden="true" class={cn('shrink-0', tone, classes?.icon)}>
			{@render icon()}
		</span>
	{/if}
	<div class="min-w-0 flex-1 space-y-1">
		{#if title}
			<p class={cn('font-medium', tone, classes?.title)}>
				{@render title()}
			</p>
		{/if}
		{#if description}
			<p class={cn('text-foreground-subtle', classes?.description)}>
				{@render description()}
			</p>
		{/if}
		{@render children?.()}
	</div>
</div>
