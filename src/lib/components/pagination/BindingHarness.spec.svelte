<!-- BindingHarness.spec.svelte -->
<script lang="ts">
	import Pagination from './Pagination.svelte';

	let currentPage = $state(1);
</script>

<Pagination totalPages={10} bind:currentPage />
<output data-testid="outer-current-page">{currentPage}</output>
