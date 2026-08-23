<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { CardContentProps } from './CardContent.types.js';

	let { class: className, children, ...restProps }: CardContentProps = $props();
</script>

<div class={cn('p-surface pt-0', className)} {...restProps}>
	{@render children()}
</div>
