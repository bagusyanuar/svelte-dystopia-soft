<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { TableHeaderProps } from './TableHeader.types.js';

	let { class: className, children, ...restProps }: TableHeaderProps = $props();
</script>

<thead class={cn('border-b border-border', className)} {...restProps}>
	{@render children()}
</thead>
