<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { spinnerVariants } from './Spinner.variants.js';
	import type { SpinnerProps } from './Spinner.types.js';

	let { size, label, classes, class: className, ...restProps }: SpinnerProps = $props();
</script>

<span
	role="status"
	aria-label={label ?? 'Loading'}
	class={cn('inline-flex', className)}
	{...restProps}
>
	<svg
		viewBox="0 0 24 24"
		fill="none"
		aria-hidden="true"
		class={cn(spinnerVariants({ size }), classes?.icon)}
	>
		<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" stroke-opacity="0.25" />
		<path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
	</svg>
</span>
