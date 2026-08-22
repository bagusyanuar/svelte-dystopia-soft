<!-- BindingHarness.spec.svelte -->
<script lang="ts">
	import Dropdown from './Dropdown.svelte';
	import DropdownItem from './DropdownItem.svelte';
	import { createRawSnippet } from 'svelte';

	let open = $state(false);

	const trigger = createRawSnippet(() => ({
		render: () => `<span>Actions</span>`
	}));
</script>

<Dropdown bind:open {trigger}>
	<DropdownItem>Edit</DropdownItem>
	<DropdownItem>Remove</DropdownItem>
</Dropdown>
<output data-testid="outer-open">{open}</output>
