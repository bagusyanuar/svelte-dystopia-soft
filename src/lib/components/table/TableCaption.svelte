<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { TableCaptionProps } from './TableCaption.types.js';

	let { class: className, children, ...restProps }: TableCaptionProps = $props();
</script>

<caption class={cn('mt-4 text-sm leading-snug text-foreground-subtle', className)} {...restProps}>
	{@render children()}
</caption>
