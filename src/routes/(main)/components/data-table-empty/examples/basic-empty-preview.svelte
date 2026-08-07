<script lang="ts">
	import DataTableEmpty from "$table/data-table-empty";
	import * as Table from "$lib/components/ui/table";
</script>

<div class="w-full overflow-hidden rounded-lg border">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Name</Table.Head>
				<Table.Head>Email</Table.Head>
				<Table.Head>Role</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			<DataTableEmpty colspan={3} />
		</Table.Body>
	</Table.Root>
</div>
