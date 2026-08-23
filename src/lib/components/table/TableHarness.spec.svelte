<!-- TableHarness.spec.svelte -->
<script lang="ts">
	import Table from './Table.svelte';
	import TableCaption from './TableCaption.svelte';
	import TableHeader from './TableHeader.svelte';
	import TableBody from './TableBody.svelte';
	import TableFooter from './TableFooter.svelte';
	import TableRow from './TableRow.svelte';
	import TableHead from './TableHead.svelte';
	import TableCell from './TableCell.svelte';
</script>

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
		<TableRow>
			<TableCell>INV001</TableCell>
			<TableCell>Paid</TableCell>
			<TableCell>$250.00</TableCell>
		</TableRow>
		<TableRow selected>
			<TableCell>INV002</TableCell>
			<TableCell>Pending</TableCell>
			<TableCell>$150.00</TableCell>
		</TableRow>
	</TableBody>
	<TableFooter>
		<TableRow>
			<TableCell colspan={2}>Total</TableCell>
			<TableCell>$400.00</TableCell>
		</TableRow>
	</TableFooter>
</Table>
