<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { CardTitleProps } from './CardTitle.types.js';

	let { class: className, children, ...restProps }: CardTitleProps = $props();
</script>

<div class={cn('text-lg font-semibold text-foreground', className)} {...restProps}>
	{@render children()}
</div>
