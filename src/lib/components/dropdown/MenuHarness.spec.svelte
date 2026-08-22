<!-- MenuHarness.spec.svelte -->
<script lang="ts">
	import Dropdown from './Dropdown.svelte';
	import DropdownItem from './DropdownItem.svelte';
	import { createRawSnippet } from 'svelte';

	let {
		onEditSelect,
		onArchiveSelect,
		onRemoveSelect
	}: {
		onEditSelect?: () => void;
		onArchiveSelect?: () => void;
		onRemoveSelect?: () => void;
	} = $props();

	const trigger = createRawSnippet(() => ({
		render: () => `<span>Actions</span>`
	}));
</script>

<Dropdown {trigger}>
	<DropdownItem onSelect={onEditSelect}>Edit</DropdownItem>
	<DropdownItem disabled onSelect={onArchiveSelect}>Archive</DropdownItem>
	<DropdownItem onSelect={onRemoveSelect}>Remove</DropdownItem>
</Dropdown>
