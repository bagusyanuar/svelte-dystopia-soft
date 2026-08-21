<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { textFieldVariants } from './TextField.variants.js';
	import type { TextFieldProps } from './TextField.types.js';

	let {
		variant,
		size,
		class: className,
		classes,
		ref = $bindable(null),
		value = $bindable(''),
		disabled = false,
		invalid = false,
		prefix,
		suffix,
		...restProps
	}: TextFieldProps = $props();
</script>

<div
	class={cn(textFieldVariants({ variant, size }), className)}
	data-disabled={disabled ? '' : undefined}
	data-invalid={invalid ? '' : undefined}
>
	{#if prefix}
		<span
			class={cn('flex shrink-0 items-center text-foreground-faint [&_svg]:size-4', classes?.prefix)}
		>
			{@render prefix()}
		</span>
	{/if}

	<input
		bind:this={ref}
		bind:value
		{disabled}
		aria-invalid={invalid || undefined}
		class={cn(
			'h-full min-w-0 flex-1 bg-transparent text-inherit outline-none placeholder:text-foreground-faint disabled:cursor-not-allowed',
			classes?.input
		)}
		{...restProps}
	/>

	{#if suffix}
		<span
			class={cn('flex shrink-0 items-center text-foreground-faint [&_svg]:size-4', classes?.suffix)}
		>
			{@render suffix()}
		</span>
	{/if}
</div>
