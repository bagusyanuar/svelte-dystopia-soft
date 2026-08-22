<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { HelperTextProps } from './HelperText.types.js';

	let { invalid = false, class: className, children, ...restProps }: HelperTextProps = $props();
</script>

<p
	role={invalid ? 'alert' : undefined}
	data-invalid={invalid ? '' : undefined}
	class={cn('text-sm', invalid ? 'text-danger' : 'text-foreground-subtle', className)}
	{...restProps}
>
	{@render children()}
</p>
