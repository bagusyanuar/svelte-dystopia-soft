<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { TableHeadProps } from './TableHead.types.js';

	let { class: className, children, ...restProps }: TableHeadProps = $props();
</script>

<th
	scope="col"
	class={cn(
		'px-compact py-2 text-left align-middle text-sm leading-snug font-medium text-foreground-soft',
		className
	)}
	{...restProps}
>
	{@render children()}
</th>
