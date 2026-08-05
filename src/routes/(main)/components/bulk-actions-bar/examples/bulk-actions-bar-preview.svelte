<script lang="ts">
	import ArchiveIcon from "@lucide/svelte/icons/archive";
	import Trash2Icon from "@lucide/svelte/icons/trash-2";
	import {
		FlexRender,
		createTable,
		renderComponent,
		rowSelectionFeature,
		tableFeatures,
		type ColumnDef
	} from "@tanstack/svelte-table";

	import BulkActionsBar from "$table/bulk-actions-bar";
	import HeaderCheckbox from "$table/header-checkbox";
	import RowCheckbox from "$table/row-checkbox";
	import { Button } from "$lib/components/ui/button";
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
				renderComponent(RowCheckbox, {
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
	const selectedIds = $derived.by(() =>
		Object.entries(table.atoms.rowSelection.get())
			.filter(([, selected]) => selected)
			.map(([id]) => id)
	);

	let feedback = $state("Select projects to reveal the bulk actions bar.");

	function completeAction(action: string) {
		feedback = `${action} ${selectedIds.length} ${selectedIds.length === 1 ? "project" : "projects"}.`;
		table.resetRowSelection(true);
	}
</script>

<div class="flex w-full flex-col gap-3">
	<p class="text-sm text-muted-foreground">{feedback}</p>

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

<BulkActionsBar
	selectedCount={selectedIds.length}
	onClear={() => table.resetRowSelection(true)}
>
	<Button
		variant="ghost"
		size="sm"
		onclick={() => completeAction("Archived")}
	>
		<ArchiveIcon />
		Archive
	</Button>
	<Button
		variant="destructive"
		size="sm"
		onclick={() => completeAction("Deleted")}
	>
		<Trash2Icon />
		Delete
	</Button>
</BulkActionsBar>
