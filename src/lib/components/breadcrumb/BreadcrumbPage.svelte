<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { BreadcrumbPageProps } from './BreadcrumbPage.types.js';

	let { class: className, children, ...restProps }: BreadcrumbPageProps = $props();
</script>

<span
	aria-current="page"
	aria-disabled="true"
	class={cn('font-medium text-foreground', className)}
	{...restProps}
>
	{@render children()}
</span>
