<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { LabelProps } from './Label.types.js';

	let {
		required = false,
		disabled = false,
		class: className,
		children,
		...restProps
	}: LabelProps = $props();
</script>

<label
	class={cn(
		'inline-flex items-center gap-tight text-sm leading-snug font-medium text-foreground-soft select-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
		className
	)}
	data-disabled={disabled ? '' : undefined}
	{...restProps}
>
	{@render children()}
	{#if required}
		<span aria-hidden="true" class="text-danger">*</span>
	{/if}
</label>
