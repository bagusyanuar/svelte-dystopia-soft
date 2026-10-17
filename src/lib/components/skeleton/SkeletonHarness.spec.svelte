<script lang="ts">
	import Skeleton from './Skeleton.svelte';

	let skelRef = $state<HTMLDivElement | null>(null);
</script>

<Skeleton bind:ref={skelRef} class="h-4 w-20" data-testid="harness-skeleton" />

<span data-testid="has-ref">{skelRef ? 'yes' : 'no'}</span>
