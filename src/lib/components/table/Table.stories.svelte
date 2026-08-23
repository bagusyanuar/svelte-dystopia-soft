<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Table from './Table.svelte';
	import TableCaption from './TableCaption.svelte';
	import TableHeader from './TableHeader.svelte';
	import TableBody from './TableBody.svelte';
	import TableFooter from './TableFooter.svelte';
	import TableRow from './TableRow.svelte';
	import TableHead from './TableHead.svelte';
	import TableCell from './TableCell.svelte';

	const { Story } = defineMeta({
		title: 'Components/Table',
		component: Table,
		tags: ['autodocs']
	});

	const invoices = [
		{ invoice: 'INV001', status: 'Paid', amount: '$250.00' },
		{ invoice: 'INV002', status: 'Pending', amount: '$150.00' },
		{ invoice: 'INV003', status: 'Unpaid', amount: '$350.00' }
	];
</script>

<Story name="Default" asChild>
	<div class="w-160">
		<Table>
			<TableCaption>A list of recent invoices.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Invoice</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Amount</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each invoices as row (row.invoice)}
					<TableRow>
						<TableCell>{row.invoice}</TableCell>
						<TableCell>{row.status}</TableCell>
						<TableCell>{row.amount}</TableCell>
					</TableRow>
				{/each}
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell colspan={2}>Total</TableCell>
					<TableCell>$750.00</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	</div>
</Story>

<Story name="Selected row" asChild>
	<div class="w-160">
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Invoice</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Amount</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each invoices as row (row.invoice)}
					<TableRow selected={row.invoice === 'INV002'}>
						<TableCell>{row.invoice}</TableCell>
						<TableCell>{row.status}</TableCell>
						<TableCell>{row.amount}</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</Story>

<Story name="Header and body only" asChild>
	<div class="w-160">
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Invoice</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Amount</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each invoices as row (row.invoice)}
					<TableRow>
						<TableCell>{row.invoice}</TableCell>
						<TableCell>{row.status}</TableCell>
						<TableCell>{row.amount}</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</Story>

<Story name="Narrow container (horizontal scroll)" asChild>
	<div class="w-72 rounded-lg border border-border">
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Invoice</TableHead>
					<TableHead>Customer</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Amount</TableHead>
					<TableHead>Due date</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					<TableCell>INV001</TableCell>
					<TableCell>Ada Lovelace</TableCell>
					<TableCell>Paid</TableCell>
					<TableCell>$250.00</TableCell>
					<TableCell>2026-09-01</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	</div>
</Story>
