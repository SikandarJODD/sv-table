<script lang="ts">
	import {
		FlexRender,
		createTable,
		renderComponent,
		rowSelectionFeature,
		tableFeatures,
		type ColumnDef
	} from "@tanstack/svelte-table";

	import HeaderCheckbox from "$table/header-checkbox";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import * as Table from "$lib/components/ui/table";

	type Project = {
		id: string;
		name: string;
		status: string;
	};

	const projects: Project[] = [
		{ id: "website", name: "Website redesign", status: "In progress" },
		{ id: "mobile", name: "Mobile application", status: "Planning" },
		{ id: "analytics", name: "Analytics dashboard", status: "In progress" },
		{ id: "portal", name: "Customer portal", status: "Complete" }
	];

	const features = tableFeatures({ rowSelectionFeature });

	const columns: ColumnDef<typeof features, Project, any>[] = [
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
				renderComponent(Checkbox, {
					checked: row.getIsSelected(),
					onCheckedChange: (checked) => row.toggleSelected(checked),
					"aria-label": `Select ${row.original.name}`
				})
		},
		{
			accessorKey: "name",
			header: "Project",
			cell: ({ getValue }) => getValue()
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ getValue }) => getValue()
		}
	];

	const table = createTable({
		features,
		columns,
		get data() {
			return projects;
		},
		getRowId: (row) => row.id
	});

	const headers = $derived(table.getLeafHeaders());
	const rows = $derived(table.getRowModel().rows);
	const rowSelection = $derived(table.atoms.rowSelection.get());
	const selectedCount = $derived(Object.keys(rowSelection).length);
</script>

<div class="flex w-full flex-col gap-3">
	<p class="text-sm text-muted-foreground">
		{selectedCount} of {rows.length} rows selected
	</p>

	<div class="overflow-hidden rounded-lg border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					{#each headers as header (header.id)}
						<Table.Head
							class={header.id === "select" ? "w-12" : undefined}
						>
							<FlexRender {header} />
						</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>

			<Table.Body>
				{#each rows as row (row.id)}
					<Table.Row
						data-state={row.getIsSelected()
							? "selected"
							: undefined}
					>
						{#each row.getAllCells() as cell (cell.id)}
							<Table.Cell
								class={cell.column.id === "name"
									? "font-medium"
									: undefined}
							>
								<FlexRender {cell} />
							</Table.Cell>
						{/each}
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>
