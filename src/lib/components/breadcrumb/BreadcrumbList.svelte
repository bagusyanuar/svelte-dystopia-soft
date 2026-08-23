<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { BreadcrumbListProps } from './BreadcrumbList.types.js';

	let { class: className, children, ...restProps }: BreadcrumbListProps = $props();
</script>

<ol
	class={cn('flex flex-wrap items-center gap-tight text-sm text-foreground-subtle', className)}
	{...restProps}
>
	{@render children()}
</ol>
