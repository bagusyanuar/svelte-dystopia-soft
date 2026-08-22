<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { CardProps } from './Card.types.js';

	let { class: className, children, ...restProps }: CardProps = $props();
</script>

<div class={cn('rounded-lg border border-border bg-surface', className)} {...restProps}>
	{@render children()}
</div>
