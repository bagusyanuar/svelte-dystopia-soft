<script lang="ts">
	import Typography from './Typography.svelte';

	let {
		testRef = false,
		testTextProp = false,
		testChild = false
	}: {
		testRef?: boolean;
		testTextProp?: boolean;
		testChild?: boolean;
	} = $props();

	let typographyRef = $state<HTMLElement | null>(null);
</script>

{#if testRef}
	<Typography bind:ref={typographyRef} variant="h1">
		Ref Target Text
	</Typography>
	<output data-testid="ref-status">{typographyRef ? 'bound' : 'null'}</output>
{:else if testTextProp}
	<Typography variant="h3" text="Direct String Content" />
{:else if testChild}
	<Typography variant="lead">
		{#snippet child({ props, variant })}
			<a {...props} href="#custom" data-testid="custom-child" data-variant-name={variant}>
				Custom Lead Link
			</a>
		{/snippet}
	</Typography>
{/if}
