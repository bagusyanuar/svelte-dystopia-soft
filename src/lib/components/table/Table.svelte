<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { TableProps } from './Table.types.js';

	let { class: className, classes, children, ...restProps }: TableProps = $props();
</script>

<!--
	WCAG 2.1.1 requires a scrollable region to be keyboard-operable; `tabindex="0"` is
	axe's own remediation for `scrollable-region-focusable`, not an accidental tab stop.
-->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	tabindex="0"
	class={cn(
		'relative w-full overflow-x-auto rounded-lg border border-border bg-surface focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
		className
	)}
>
	<table class={cn('w-full caption-bottom text-sm text-foreground', classes?.table)} {...restProps}>
		{@render children()}
	</table>
</div>
