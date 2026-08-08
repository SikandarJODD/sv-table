<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import * as Table from "$lib/components/ui/table";
	import {
		createTable,
		FlexRender,
		tableFeatures
	} from "@tanstack/svelte-table";
	import type { ColumnDef } from "@tanstack/svelte-table";

	type Item = {
		id: string;
		name: string;
		email: string;
		location: string;
		flag: string;
		status: "Active" | "Inactive" | "Pending";
		balance: number;
	};

	let data: Item[] = $state([]);
	let features = tableFeatures({});
	let columns: Array<ColumnDef<typeof features, Item>> = [
		{
			accessorKey: "id",
			header: "Id",
			cell: (info) => info.getValue()
		},
		{
			accessorKey: "name",
			header: "Name",
			cell: (info) => info.getValue()
		},
		{
			accessorKey: "email",
			header: "Email",
			cell: (info) => info.getValue()
		},
		{
			accessorKey: "location",
			header: "Location",
			cell: (info) => info.getValue()
		},
		{
			accessorKey: "flag",
			header: "Flag",
			cell: (info) => info.getValue()
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: (info) => info.getValue()
		},
		{
			accessorKey: "balance",
			header: "Balance",
			cell: (info) => `$${info.getValue()}`
		}
	];

	let table = createTable({
		data,
		columns,
		features
	});
</script>

<div>
	<Table.Root>
		<Table.Header>
			{#each table.getHeaderGroups() as headerGroup}
				<Table.Row class="hover:bg-transparent">
					{#each headerGroup.headers as header}
						<Table.Head>
							{#if !header.isPlaceholder}
								<FlexRender
									// renderer={header.column.columnDef.header}
									context={header.getContext()}
								/>
							{/if}
						</Table.Head>
					{/each}
				</Table.Row>
			{/each}
		</Table.Header>
		<Table.Body>
			{#each table.getRowModel().rows as row}
				<Table.Row>
					{#each row.getAllCells() as cell}
						<Table.Cell>
							<FlexRender
								// renderer={cell.column.columnDef.cell}
								context={cell.getContext()}
							/>
						</Table.Cell>
					{/each}
				</Table.Row>
			{/each}
			{#if !table.getRowModel().rows?.length}
				<Table.Row>
					<Table.Cell
						class="h-24 text-center"
						colspan={columns.length}
					>
						No results.
					</Table.Cell>
				</Table.Row>
			{/if}
		</Table.Body>
		<Table.Footer class="bg-transparent">
			<Table.Row class="hover:bg-transparent">
				<Table.Cell colspan={5}>Total</Table.Cell>
				<Table.Cell class="text-right">
					{new Intl.NumberFormat("en-US", {
						currency: "USD",
						style: "currency"
					}).format(
						data.reduce((total, item) => total + item.balance, 0)
					)}
				</Table.Cell>
			</Table.Row>
		</Table.Footer>
	</Table.Root>
	<p class="mt-4 text-center text-sm text-muted-foreground">
		Basic data table made with{" "}
		<a
			class="underline hover:text-foreground"
			href="https://tanstack.com/table"
			rel="noopener noreferrer"
			target="_blank"
		>
			TanStack Table
		</a>
	</p>
</div>
