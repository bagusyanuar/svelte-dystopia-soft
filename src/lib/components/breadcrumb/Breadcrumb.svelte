<script lang="ts">
	import type { BreadcrumbProps } from './Breadcrumb.types.js';

	let { class: className, children, ...restProps }: BreadcrumbProps = $props();
</script>

<nav aria-label="breadcrumb" class={className} {...restProps}>
	{@render children()}
</nav>
