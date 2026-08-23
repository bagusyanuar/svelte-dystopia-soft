<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { TableFooterProps } from './TableFooter.types.js';

	let { class: className, children, ...restProps }: TableFooterProps = $props();
</script>

<tfoot
	class={cn('border-t border-border bg-surface-subtle font-medium text-foreground-soft', className)}
	{...restProps}
>
	{@render children()}
</tfoot>
