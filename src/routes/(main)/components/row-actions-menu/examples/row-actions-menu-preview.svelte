<script lang="ts">
	import CopyIcon from "@lucide/svelte/icons/copy";
	import EyeIcon from "@lucide/svelte/icons/eye";
	import PencilIcon from "@lucide/svelte/icons/pencil";
	import Trash2Icon from "@lucide/svelte/icons/trash-2";
	import {
		FlexRender,
		createTable,
		renderComponent,
		tableFeatures,
		type ColumnDef
	} from "@tanstack/svelte-table";

	import RowActionsMenu, { type RowAction } from "$table/row-actions-menu";
	import * as Table from "$lib/components/ui/table";

	type Project = {
		id: string;
		name: string;
		owner: string;
		status: "Active" | "Archived";
	};

	const projects: Project[] = [
		{
			id: "website",
			name: "Website redesign",
			owner: "Maya Chen",
			status: "Active"
		},
		{
			id: "mobile",
			name: "Mobile application",
			owner: "Noah Williams",
			status: "Active"
		},
		{
			id: "analytics",
			name: "Analytics dashboard",
			owner: "Aarav Patel",
			status: "Archived"
		},
		{
			id: "portal",
			name: "Customer portal",
			owner: "Sofia Garcia",
			status: "Active"
		}
	];

	let feedback = $state("Choose an action from any row.");

	function completeAction(action: string, project: Project) {
		feedback = `${action}: ${project.name}`;
	}

	const actions: RowAction<Project>[] = [
		{
			id: "view",
			label: "View details",
			icon: EyeIcon,
			onSelect: (project) => completeAction("Viewed", project)
		},
		{
			id: "edit",
			label: "Edit project",
			icon: PencilIcon,
			shortcut: "E",
			onSelect: (project) => completeAction("Editing", project)
		},
		{
			id: "duplicate",
			label: "Duplicate",
			icon: CopyIcon,
			onSelect: (project) => completeAction("Duplicated", project)
		},
		{
			id: "delete",
			label: "Delete project",
			icon: Trash2Icon,
			variant: "destructive",
			separatorBefore: true,
			disabled: (project) => project.status === "Archived",
			onSelect: (project) => completeAction("Deleted", project)
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
			id: "actions",
			header: "",
			cell: ({ row }) =>
				renderComponent(RowActionsMenu, {
					row: row.original,
					actions,
					label: `Open actions for ${row.original.name}`
				})
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
</script>

<div class="flex w-full flex-col gap-3">
	<p aria-live="polite" class="text-sm text-muted-foreground">
		{feedback}
	</p>

	<div class="overflow-hidden rounded-lg border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					{#each headers as header (header.id)}
						<Table.Head
							class={header.id === "actions"
								? "w-12 text-right"
								: undefined}
						>
							<FlexRender {header} />
						</Table.Head>
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
									: cell.column.id === "actions"
										? "text-right"
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
