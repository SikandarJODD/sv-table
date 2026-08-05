<script lang="ts">
	import {
		columnVisibilityFeature,
		createTable,
		tableFeatures,
		type ColumnDef
	} from "@tanstack/svelte-table";

	import DataTableView from "$table/data-table-view";
	import * as Table from "$lib/components/ui/table";

	type Project = {
		name: string;
		status: string;
		owner: string;
		updatedAt: string;
	};

	const projects: Project[] = [
		{
			name: "Website redesign",
			status: "In progress",
			owner: "Maya Chen",
			updatedAt: "Aug 4, 2026"
		},
		{
			name: "Mobile application",
			status: "Planning",
			owner: "Noah Williams",
			updatedAt: "Jul 29, 2026"
		},
		{
			name: "Analytics dashboard",
			status: "In progress",
			owner: "Aarav Patel",
			updatedAt: "Aug 2, 2026"
		},
		{
			name: "Customer portal",
			status: "Complete",
			owner: "Sofia Garcia",
			updatedAt: "Jul 18, 2026"
		}
	];

	const features = tableFeatures({ columnVisibilityFeature });

	const columns: ColumnDef<typeof features, Project>[] = [
		{ accessorKey: "name", header: "Project" },
		{ accessorKey: "status", header: "Status" },
		{ accessorKey: "owner", header: "Owner" },
		{ accessorKey: "updatedAt", header: "Updated" }
	];

	const table = createTable({
		features,
		columns,
		get data() {
			return projects;
		}
	});

	const headers = $derived(table.getLeafHeaders());
	const rows = $derived(table.getRowModel().rows);
</script>

<div class="flex w-full flex-col gap-3">
	<div class="flex justify-end">
		<DataTableView {table} />
	</div>

	<div class="overflow-hidden rounded-lg border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					{#each headers as header (header.id)}
						<Table.Head>
							{header.column.columnDef.header as string}
						</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each rows as row (row.id)}
					<Table.Row>
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell
								class={cell.column.id === "name"
									? "font-medium"
									: "text-muted-foreground"}
							>
								{row.original[cell.column.id as keyof Project]}
							</Table.Cell>
						{/each}
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>
