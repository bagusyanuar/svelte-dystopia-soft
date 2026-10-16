<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { HelperTextProps } from './HelperText.types.js';

	let {
		invalid = false,
		class: className,
		classes,
		ref = $bindable(null),
		icon,
		children,
		...restProps
	}: HelperTextProps = $props();
</script>

<p
	bind:this={ref}
	role={invalid ? 'alert' : undefined}
	data-slot="helper-text"
	data-invalid={invalid ? '' : undefined}
	class={cn(
		'text-sm leading-snug',
		icon && 'flex items-center gap-tight',
		invalid ? 'text-danger' : 'text-foreground-subtle',
		className
	)}
	{...restProps}
>
	{#if icon}
		<span
			data-slot="helper-text-icon"
			aria-hidden="true"
			class={cn('inline-flex shrink-0 items-center text-inherit [&_svg]:size-3.5', classes?.icon)}
		>
			{@render icon({ invalid })}
		</span>
	{/if}
	{@render children?.({ invalid })}
</p>
