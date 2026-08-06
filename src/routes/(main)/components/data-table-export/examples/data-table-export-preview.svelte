<script lang="ts">
	import {
		FlexRender,
		createTable,
		tableFeatures,
		type ColumnDef
	} from "@tanstack/svelte-table";

	import DataTableExport, {
		type CsvExportColumn
	} from "$table/data-table-export";
	import * as Table from "$lib/components/ui/table";

	type Project = {
		id: string;
		name: string;
		owner: string;
		status: "Active" | "Paused" | "Complete";
		budget: number;
	};

	const projects: Project[] = [
		{
			id: "website",
			name: "Website redesign",
			owner: "Maya Chen",
			status: "Active",
			budget: 24000
		},
		{
			id: "mobile",
			name: "Mobile application",
			owner: "Noah Williams",
			status: "Paused",
			budget: 42000
		},
		{
			id: "analytics",
			name: "Analytics dashboard",
			owner: "Aarav Patel",
			status: "Complete",
			budget: 18500
		},
		{
			id: "portal",
			name: "Customer portal",
			owner: "Sofia Garcia",
			status: "Active",
			budget: 31000
		}
	];

	const features = tableFeatures({});

	const columns: ColumnDef<typeof features, Project, any>[] = [
		{
			accessorKey: "name",
			header: "Project",
			cell: ({ getValue }) => getValue()
		},
		{
			accessorKey: "owner",
			header: "Owner",
			cell: ({ getValue }) => getValue()
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ getValue }) => getValue()
		},
		{
			accessorKey: "budget",
			header: "Budget",
			cell: ({ getValue }) =>
				new Intl.NumberFormat("en-US", {
					style: "currency",
					currency: "USD",
					maximumFractionDigits: 0
				}).format(Number(getValue()))
		}
	];

	const exportColumns: CsvExportColumn<Project>[] = [
		{ id: "name", header: "Project", accessor: "name" },
		{ id: "owner", header: "Owner", accessor: "owner" },
		{ id: "status", header: "Status", accessor: "status" },
		{ id: "budget", header: "Budget (USD)", accessor: "budget" }
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
	const exportRows = $derived(rows.map((row) => row.original));

	let feedback = $state("Export the rows currently shown in the table.");
</script>

<div class="flex w-full flex-col gap-3">
	<div
		class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
	>
		<p aria-live="polite" class="text-sm text-muted-foreground">
			{feedback}
		</p>
		<DataTableExport
			rows={exportRows}
			columns={exportColumns}
			filename="projects"
			onExport={({ rowCount, filename }) => {
				feedback = `Exported ${rowCount} rows to ${filename}.`;
			}}
		/>
	</div>

	<div class="overflow-hidden rounded-lg border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					{#each headers as header (header.id)}
						<Table.Head><FlexRender {header} /></Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each rows as row (row.id)}
					<Table.Row>
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
