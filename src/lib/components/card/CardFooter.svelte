<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { CardFooterProps } from './CardFooter.types.js';

	let { class: className, children, ...restProps }: CardFooterProps = $props();
</script>

<div class={cn('flex items-center gap-cozy p-surface pt-0', className)} {...restProps}>
	{@render children()}
</div>
