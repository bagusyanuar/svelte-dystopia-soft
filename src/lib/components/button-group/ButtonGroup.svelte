<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { buttonGroupVariants } from './ButtonGroup.variants.js';
	import type { ButtonGroupProps } from './ButtonGroup.types.js';

	let { orientation, class: className, children, ...restProps }: ButtonGroupProps = $props();
</script>

<div role="group" class={cn(buttonGroupVariants({ orientation }), className)} {...restProps}>
	{@render children()}
</div>
