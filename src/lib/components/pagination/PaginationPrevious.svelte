<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { PaginationPreviousProps } from './PaginationPrevious.types.js';

	let { class: className, label, ...restProps }: PaginationPreviousProps = $props();
</script>

<button
	type="button"
	class={cn(
		'inline-flex h-9 cursor-pointer items-center gap-tight rounded-md px-3 text-sm leading-snug text-foreground-soft transition-colors duration-150 hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	{...restProps}
>
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		class="size-4"
	>
		<path d="m15 18-6-6 6-6" />
	</svg>
	{label ?? 'Previous'}
</button>
