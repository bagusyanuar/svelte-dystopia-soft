<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Dropdown from './Dropdown.svelte';
	import DropdownItem from './DropdownItem.svelte';

	const { Story } = defineMeta({
		title: 'Components/Dropdown',
		component: Dropdown,
		tags: ['autodocs']
	});
</script>

<Story name="Default" asChild>
	<div class="flex w-80 justify-center p-16">
		<Dropdown>
			{#snippet trigger()}
				Options
			{/snippet}
			<DropdownItem onSelect={() => alert('Duplicate')}>Duplicate</DropdownItem>
			<DropdownItem onSelect={() => alert('Rename')}>Rename</DropdownItem>
			<DropdownItem disabled onSelect={() => alert('Archive')}>Archive</DropdownItem>
			<DropdownItem onSelect={() => alert('Delete')}>Delete</DropdownItem>
		</Dropdown>
	</div>
</Story>

<Story name="Inside a scroll container (table)" asChild>
	<div class="w-96 overflow-x-auto rounded-lg border border-border">
		<table class="w-160 text-sm">
			<thead>
				<tr class="border-b border-border text-left text-foreground-soft">
					<th class="p-3">Name</th>
					<th class="p-3">Email</th>
					<th class="p-3">Role</th>
					<th class="p-3">Actions</th>
				</tr>
			</thead>
			<tbody>
				<tr class="border-b border-border">
					<td class="p-3">Ada Lovelace</td>
					<td class="p-3">ada@example.com</td>
					<td class="p-3">Admin</td>
					<td class="p-3">
						<Dropdown placement="bottom-end">
							{#snippet trigger()}
								Actions
							{/snippet}
							<DropdownItem>Edit</DropdownItem>
							<DropdownItem>Remove</DropdownItem>
						</Dropdown>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</Story>

<Story name="Custom enter and exit animation" asChild>
	<div class="flex w-80 justify-center p-16">
		<Dropdown classes={{ content: 'dropdown-animated' }}>
			{#snippet trigger()}
				Options
			{/snippet}
			<DropdownItem>Duplicate</DropdownItem>
			<DropdownItem>Rename</DropdownItem>
			<DropdownItem>Delete</DropdownItem>
		</Dropdown>
	</div>
</Story>

<style>
	/*
	  The menu is portalled to <body>, so it never carries this component's
	  scope class — the selectors have to be global. `-global-` belongs on the
	  @keyframes declaration only: Svelte strips it from the emitted name but
	  does NOT rewrite references inside :global(), so spelling it in both
	  places would point at a name that no longer exists and the animation
	  would silently never run.
	*/
	:global(.dropdown-animated[data-state='open']) {
		animation: dropdown-in 150ms ease-out;
	}

	:global(.dropdown-animated[data-state='closed']) {
		animation: dropdown-out 150ms ease-in;
	}

	@keyframes -global-dropdown-in {
		from {
			opacity: 0;
			transform: scale(0.96) translateY(-4px);
		}
	}

	@keyframes -global-dropdown-out {
		to {
			opacity: 0;
			transform: scale(0.96) translateY(-4px);
		}
	}
</style>
