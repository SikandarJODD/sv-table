<script lang="ts">
	import {
		columnOrderingFeature,
		columnPinningFeature,
		columnVisibilityFeature,
		type ColumnDef,
		createSortedRowModel,
		createTable,
		rowSortingFeature,
		sortFn_alphanumeric,
		sortFn_basic,
		tableFeatures
	} from "@tanstack/svelte-table";

	import DataTableColumnHeader from "$table/data-table-column-header";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/spell/badge";
	import * as Table from "$lib/components/ui/table";

	type Project = {
		title: string;
		status: "active" | "paused" | "completed";
		owner: string;
		updatedAt: string;
		budget: number;
	};

	const projects: Project[] = [
		{
			title: "Website redesign",
			status: "active",
			owner: "Maya Chen",
			updatedAt: "2026-08-04",
			budget: 24000
		},
		{
			title: "Mobile application",
			status: "paused",
			owner: "Noah Williams",
			updatedAt: "2026-07-29",
			budget: 42000
		},
		{
			title: "Analytics dashboard",
			status: "active",
			owner: "Aarav Patel",
			updatedAt: "2026-08-02",
			budget: 18000
		},
		{
			title: "Customer portal",
			status: "completed",
			owner: "Sofia Garcia",
			updatedAt: "2026-07-18",
			budget: 31000
		},
		{
			title: "Design system",
			status: "active",
			owner: "Liam Brown",
			updatedAt: "2026-08-01",
			budget: 15000
		},
		{
			title: "Marketing website",
			status: "completed",
			owner: "Emma Wilson",
			updatedAt: "2026-07-22",
			budget: 12000
		}
	];

	const currencyFormatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0
	});

	const dateFormatter = new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	});

	const features = tableFeatures({
		columnOrderingFeature,
		columnPinningFeature,
		columnVisibilityFeature,
		rowSortingFeature,
		sortedRowModel: createSortedRowModel(),
		sortFns: {
			alphanumeric: sortFn_alphanumeric,
			basic: sortFn_basic
		}
	});

	const columns: ColumnDef<typeof features, Project, any>[] = [
		{
			id: "title",
			header: "Title",
			accessorKey: "title",
			sortFn: "alphanumeric"
		},
		{
			id: "status",
			header: "Status",
			accessorKey: "status",
			sortFn: "alphanumeric"
		},
		{
			id: "owner",
			header: "Owner",
			accessorKey: "owner",
			sortFn: "alphanumeric"
		},
		{
			id: "updatedAt",
			header: "Updated",
			accessorKey: "updatedAt",
			sortFn: "alphanumeric"
		},
		{
			id: "budget",
			header: "Budget",
			accessorKey: "budget",
			sortFn: "basic"
		}
	];

	const table = createTable({
		features,
		columns,
		get data() {
			return projects;
		}
	});

	const rows = $derived(table.getRowModel().rows);
	const headers = $derived([
		...table.getStartLeafHeaders(),
		...table.getCenterLeafHeaders(),
		...table.getEndLeafHeaders()
	]);
	const visibility = $derived(table.atoms.columnVisibility.get());
	const sorting = $derived(table.atoms.sorting.get());
	const pinning = $derived(table.atoms.columnPinning.get());
	const columnOrder = $derived(table.atoms.columnOrder.get());
	const hasCustomizedTable = $derived(
		sorting.length > 0 ||
			columnOrder.length > 0 ||
			pinning.start.length > 0 ||
			pinning.end.length > 0 ||
			Object.values(visibility).some((visible) => visible === false)
	);

	function getAriaSort(columnId: string) {
		const direction = table.getColumn(columnId)?.getIsSorted();

		return direction === "asc"
			? ("ascending" as const)
			: direction === "desc"
				? ("descending" as const)
				: ("none" as const);
	}

	function formatStatus(status: Project["status"]) {
		return status.charAt(0).toUpperCase() + status.slice(1);
	}

	function getStatusVariant(status: Project["status"]) {
		switch (status) {
			case "active":
				return "emerald";
			case "paused":
				return "amber";
			default:
				return "secondary";
		}
	}

	function resetPreview() {
		table.resetSorting(true);
		table.resetColumnVisibility(true);
		table.resetColumnPinning(true);
		table.resetColumnOrder(true);
	}
</script>

<div class="flex w-full flex-col gap-3">
	<div class="flex min-h-8 items-center justify-between gap-3">
		<p class="text-sm text-muted-foreground">
			Click a heading to cycle its sort direction.
		</p>

		{#if hasCustomizedTable}
			<Button variant="outline" size="sm" onclick={resetPreview}>
				Reset preview
			</Button>
		{/if}
	</div>

	<div class="overflow-x-auto rounded-lg border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					{#each headers as header (header.id)}
						<Table.Head
							aria-sort={getAriaSort(header.column.id)}
							class={header.column.id === "budget"
								? "text-right"
								: undefined}
						>
							<DataTableColumnHeader
								column={header.column}
								title={header.column.columnDef.header as string}
								class={header.column.id === "budget"
									? "justify-end"
									: undefined}
							/>
						</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>

			<Table.Body>
				{#each rows as row (row.id)}
					<Table.Row>
						{#each [...row.getStartVisibleCells(), ...row.getCenterVisibleCells(), ...row.getEndVisibleCells()] as cell (cell.id)}
							<Table.Cell
								class={cell.column.id === "budget"
									? "text-right font-medium tabular-nums"
									: undefined}
							>
								{#if cell.column.id === "status"}
									<Badge
										variant={getStatusVariant(
											row.original.status
										)}
									>
										{formatStatus(row.original.status)}
									</Badge>
								{:else if cell.column.id === "updatedAt"}
									<span class="text-muted-foreground">
										{dateFormatter.format(
											new Date(
												`${row.original.updatedAt}T00:00:00`
											)
										)}
									</span>
								{:else if cell.column.id === "budget"}
									{currencyFormatter.format(
										row.original.budget
									)}
								{:else if cell.column.id === "owner"}
									<span class="text-muted-foreground">
										{row.original.owner}
									</span>
								{:else}
									<span class="font-medium"
										>{row.original.title}</span
									>
								{/if}
							</Table.Cell>
						{/each}
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>
