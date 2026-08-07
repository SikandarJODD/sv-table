<script lang="ts">
	import ListFilterIcon from "@lucide/svelte/icons/list-filter";

	import DataTableEmpty from "$table/data-table-empty";
	import * as Table from "$lib/components/ui/table";
</script>

<div class="w-full overflow-hidden rounded-lg border">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Invoice</Table.Head>
				<Table.Head>Customer</Table.Head>
				<Table.Head class="text-right">Total</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			<DataTableEmpty
				colspan={3}
				title="No rows in this view"
				description="This table view does not contain any matching rows."
			>
				{#snippet icon()}
					<ListFilterIcon />
				{/snippet}
			</DataTableEmpty>
		</Table.Body>
	</Table.Root>
</div>
