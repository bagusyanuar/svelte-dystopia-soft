<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { textareaVariants } from './Textarea.variants.js';
	import type { TextareaProps } from './Textarea.types.js';

	let {
		variant,
		size,
		class: className,
		classes,
		ref = $bindable(null),
		value = $bindable(''),
		disabled = false,
		invalid = false,
		maxlength,
		autoResize = false,
		...restProps
	}: TextareaProps = $props();

	const length = $derived(value.length);
	const atLimit = $derived(typeof maxlength === 'number' && length >= maxlength);
</script>

<div class={cn('flex flex-col gap-1', className)}>
	<textarea
		bind:this={ref}
		bind:value
		{disabled}
		{maxlength}
		aria-invalid={invalid || undefined}
		data-invalid={invalid ? '' : undefined}
		class={cn(
			textareaVariants({ variant, size }),
			// field-sizing: content grows the box with input, no scrollbar; drag-resize
			// would fight that, so it's off. Chromium-only today — unsupported browsers
			// silently keep the fixed min-height + scroll behavior instead.
			autoResize && 'field-sizing-content resize-none',
			classes?.textarea
		)}
		{...restProps}></textarea>

	{#if typeof maxlength === 'number'}
		<span
			class={cn(
				'self-end text-xs tabular-nums',
				atLimit ? 'text-danger' : 'text-foreground-subtle',
				classes?.counter
			)}
		>
			{length}/{maxlength}
		</span>
	{/if}
</div>
