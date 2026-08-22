<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { CardDescriptionProps } from './CardDescription.types.js';

	let { class: className, children, ...restProps }: CardDescriptionProps = $props();
</script>

<div class={cn('text-sm text-foreground-subtle', className)} {...restProps}>
	{@render children()}
</div>
