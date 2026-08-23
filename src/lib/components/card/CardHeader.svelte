<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { CardHeaderProps } from './CardHeader.types.js';

	let { class: className, children, ...restProps }: CardHeaderProps = $props();
</script>

<div class={cn('flex flex-col gap-1.5 p-surface', className)} {...restProps}>
	{@render children()}
</div>
