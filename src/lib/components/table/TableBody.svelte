<script lang="ts">
	import type { TableBodyProps } from './TableBody.types.js';

	let { class: className, children, ...restProps }: TableBodyProps = $props();
</script>

<tbody class={className} {...restProps}>
	{@render children()}
</tbody>
