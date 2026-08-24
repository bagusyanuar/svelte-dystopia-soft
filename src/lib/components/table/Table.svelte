<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { TableProps } from './Table.types.js';

	let { class: className, classes, children, ...restProps }: TableProps = $props();
</script>

<div
	class={cn('relative w-full overflow-x-auto rounded-lg border border-border bg-surface', className)}
>
	<table class={cn('w-full caption-bottom text-sm text-foreground', classes?.table)} {...restProps}>
		{@render children()}
	</table>
</div>
