<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { TableCellProps } from './TableCell.types.js';

	let { class: className, children, ...restProps }: TableCellProps = $props();
</script>

<td
	class={cn('px-compact py-2 align-middle text-sm text-foreground-soft', className)}
	{...restProps}
>
	{@render children()}
</td>
