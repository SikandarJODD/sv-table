<script lang="ts">
	import DataTableLoading from "$table/data-table-loading";
	import * as Table from "$lib/components/ui/table";
</script>

<div class="w-full overflow-hidden rounded-lg border">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Customer</Table.Head>
				<Table.Head>Status</Table.Head>
				<Table.Head class="text-right">Amount</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body aria-busy="true" aria-label="Loading table data">
			<DataTableLoading columnCount={3} rowCount={5} />
		</Table.Body>
	</Table.Root>
</div>
