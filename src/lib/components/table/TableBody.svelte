<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { TableBodyProps } from './TableBody.types.js';

	let { class: className, children, ...restProps }: TableBodyProps = $props();
</script>

<tbody class={cn('[&>tr:last-child]:border-b-0', className)} {...restProps}>
	{@render children()}
</tbody>
