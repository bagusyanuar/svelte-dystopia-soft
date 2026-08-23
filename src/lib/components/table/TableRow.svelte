<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { TableRowProps } from './TableRow.types.js';

	let { class: className, selected = false, children, ...restProps }: TableRowProps = $props();
</script>

<tr
	data-selected={selected ? '' : undefined}
	class={cn(
		'border-b border-border transition-colors duration-150 hover:bg-surface-subtle data-selected:bg-surface-hover',
		className
	)}
	{...restProps}
>
	{@render children()}
</tr>
