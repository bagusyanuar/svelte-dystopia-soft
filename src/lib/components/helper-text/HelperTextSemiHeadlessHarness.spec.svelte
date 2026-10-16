<script lang="ts">
	import HelperText from './HelperText.svelte';
	import type { HelperTextClasses } from './HelperText.types.js';

	interface Props {
		invalid?: boolean;
		classes?: HelperTextClasses;
	}

	let { invalid = false, classes }: Props = $props();

	let rootRef = $state<HTMLParagraphElement | null>(null);
</script>

<div data-testid="ref-status" data-has-root={rootRef !== null}>
	<HelperText bind:ref={rootRef} {invalid} {classes}>
		{#snippet icon({ invalid })}
			<svg data-testid="test-icon" data-invalid-payload={invalid} class="size-4"></svg>
		{/snippet}
		{#snippet children({ invalid })}
			<span data-testid="test-text" data-invalid-payload={invalid}>
				{invalid ? 'Pesan kesalahan.' : 'Pesan bantuan.'}
			</span>
		{/snippet}
	</HelperText>
</div>
