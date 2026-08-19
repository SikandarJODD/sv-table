<script lang="ts">
	import * as Table from "$lib/components/ui/table";
	import HeaderCheckbox from "$table/header-checkbox";
	import RowCheckbox from "$table/row-checkbox";
	import {
		createTable,
		FlexRender,
		renderComponent,
		tableFeatures,
		rowSelectionFeature
	} from "@tanstack/svelte-table";
	import type { ColumnDef } from "@tanstack/svelte-table";
	import { onMount } from "svelte";

	type Item = {
		id: number;
		name: string;
		email: string;
		age: number;
		location: string;
		flag: string;
		status: "Active" | "Inactive" | "Pending";
		balance: number;
	};

	let data: Item[] = $state([]);
	let features = tableFeatures({ rowSelectionFeature });
	let columns: Array<ColumnDef<typeof features, Item>> = [
		{
			id: "select",
			header: ({ table }) => {
				const allSelected = table.getIsAllRowsSelected();
				return renderComponent(HeaderCheckbox, {
					checked: allSelected,
					indeterminate:
						table.getIsSomeRowsSelected() && !allSelected,
					onCheckedChange: (checked) =>
						table.toggleAllRowsSelected(checked)
				});
			},
			cell: ({ row }) =>
				renderComponent(RowCheckbox, {
					checked: row.getIsSelected(),
					onCheckedChange: (checked) => row.toggleSelected(checked),
					"aria-label": `Select ${row.original.name}`
				})
		},
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
			accessorKey: "age",
			header: "Age",
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
		columns,
		features,
		get data() {
			return data; // a getter keeps the table in sync with the $state rune
		}
	});

	let getData = async () => {
		const res = (await fetch("/dummy-data/data.json")) as Response;
		const json = (await res.json()) as Item[];
		console.log(json, "Data fetched");
		data = json.slice(0, 10);
	};
	onMount(async () => {
		await getData();
	});
</script>

<div class="w-full rounded-lg border">
	<Table.Root>
		<Table.Header>
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<Table.Row class="hover:bg-transparent">
					{#each headerGroup.headers as header (header.id)}
						<Table.Head>
							{#if !header.isPlaceholder}
								<FlexRender {header} />
							{/if}
						</Table.Head>
					{/each}
				</Table.Row>
			{/each}
		</Table.Header>
		<Table.Body>
			{#each table.getRowModel().rows as row (row.id)}
				<Table.Row
					data-state={row.getIsSelected() ? "selected" : undefined}
				>
					{#each row.getAllCells() as cell}
						<Table.Cell>
							<FlexRender {cell} />
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
				<Table.Cell colspan={8}>Total</Table.Cell>
				<Table.Cell class="text-start">
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
</div>
