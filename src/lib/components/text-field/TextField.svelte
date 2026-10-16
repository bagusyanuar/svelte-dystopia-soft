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
		inputRef = $bindable(null),
		containerRef = $bindable(null),
		value = $bindable(''),
		disabled = false,
		invalid = false,
		prefix,
		suffix,
		onValueChange,
		oninput,
		...restProps
	}: TextFieldProps = $props();

	$effect(() => {
		inputRef = ref ?? inputRef;
	});

	function handleInput(event: Event & { currentTarget: HTMLInputElement }): void {
		oninput?.(event);
		onValueChange?.(event.currentTarget.value);
	}
</script>

<div
	bind:this={containerRef}
	class={cn(textFieldVariants({ variant, size }), className, classes?.container)}
	data-slot="text-field"
	data-disabled={disabled ? '' : undefined}
	data-invalid={invalid ? '' : undefined}
	data-has-value={value ? '' : undefined}
>
	{#if prefix}
		<span
			class={cn('flex shrink-0 items-center text-foreground-faint [&_svg]:size-4', classes?.prefix)}
		>
			{@render prefix({ value })}
		</span>
	{/if}

	<input
		bind:this={ref}
		bind:value
		{disabled}
		aria-invalid={invalid || undefined}
		data-slot="text-field-input"
		class={cn(
			'h-full min-w-0 flex-1 bg-transparent text-inherit outline-none placeholder:text-foreground-faint disabled:cursor-not-allowed',
			classes?.input
		)}
		oninput={handleInput}
		{...restProps}
	/>

	{#if suffix}
		<span
			class={cn('flex shrink-0 items-center text-foreground-faint [&_svg]:size-4', classes?.suffix)}
		>
			{@render suffix({ value })}
		</span>
	{/if}
</div>
