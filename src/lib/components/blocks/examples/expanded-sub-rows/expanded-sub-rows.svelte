<script lang="ts">
	import InfoIcon from "@lucide/svelte/icons/info";
	import {
		createExpandedRowModel,
		createTable,
		FlexRender,
		renderComponent,
		renderSnippet,
		rowExpandingFeature,
		rowSelectionFeature,
		tableFeatures,
		type ColumnDef
	} from "@tanstack/svelte-table";
	import { onMount } from "svelte";

	import HeaderCheckbox from "$table/header-checkbox";
	import RowCheckbox from "$table/row-checkbox";
	import { Badge } from "$lib/components/ui/badge";
	import * as Table from "$lib/components/ui/table";
	import { cn } from "$lib/utils";

	import RowExpander from "./row-expander.svelte";

	type Item = {
		id: string;
		name: string;
		email: string;
		location: string;
		flag: string;
		status: "Active" | "Inactive" | "Pending";
		balance: number;
		note?: string;
	};

	let data = $state<Item[]>([]);

	const features = tableFeatures({
		rowExpandingFeature,
		expandedRowModel: createExpandedRowModel(),
		rowSelectionFeature
	});

	const columns: ColumnDef<typeof features, Item, any>[] = [
		{
			id: "expander",
			header: "",
			cell: ({ row }) =>
				row.getCanExpand()
					? renderComponent(RowExpander, {
							expanded: row.getIsExpanded(),
							name: row.original.name,
							onclick: row.getToggleExpandedHandler()
						})
					: undefined
		},
		{
			id: "select",
			header: ({ table }) => {
				const allSelected = table.getIsAllPageRowsSelected();

				return renderComponent(HeaderCheckbox, {
					checked: allSelected,
					indeterminate:
						table.getIsSomePageRowsSelected() && !allSelected,
					onCheckedChange: (checked) =>
						table.toggleAllPageRowsSelected(checked)
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
			header: "Name",
			cell: ({ row }) =>
				renderSnippet(nameCell, { name: row.original.name })
		},
		{
			accessorKey: "email",
			header: "Email"
		},
		{
			accessorKey: "location",
			header: "Location",
			cell: ({ row }) =>
				renderSnippet(locationCell, {
					flag: row.original.flag,
					location: row.original.location
				})
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) =>
				renderSnippet(statusCell, { status: row.original.status })
		},
		{
			accessorKey: "balance",
			header: "Balance",
			cell: (info) =>
				new Intl.NumberFormat("en-US", {
					currency: "USD",
					style: "currency"
				}).format(Number(info.getValue()))
		}
	];

	const table = createTable({
		features,
		columns,
		get data() {
			return data;
		},
		getRowCanExpand: (row) => Boolean(row.original.note)
	});

	onMount(async () => {
		const response = await fetch(
			"https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/users-01_fertyx.json"
		);
		const items = (await response.json()) as Item[];
		data = items.slice(0, 5);
	});
</script>

{#snippet nameCell({ name }: { name: string })}
	<div class="font-medium">{name}</div>
{/snippet}

{#snippet locationCell({ flag, location }: { flag: string; location: string })}
	<div>
		<span class="text-lg leading-none">{flag}</span>
		{location}
	</div>
{/snippet}

{#snippet statusCell({ status }: { status: Item["status"] })}
	<Badge
		class={cn(
			status === "Inactive" &&
				"bg-muted-foreground/60 text-primary-foreground"
		)}
	>
		{status}
	</Badge>
{/snippet}

<div>
	<div class="w-full overflow-x-auto rounded-lg border">
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row class="hover:bg-transparent">
						{#each headerGroup.headers as header (header.id)}
							<Table.Head
								class={cn(
									header.column.id === "balance" &&
										"text-right"
								)}
							>
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
						data-state={row.getIsSelected()
							? "selected"
							: undefined}
					>
						{#each row.getAllCells() as cell (cell.id)}
							<Table.Cell
								class={cn(
									"whitespace-nowrap",
									cell.column.id === "expander" &&
										"w-px py-0 pr-0",
									cell.column.id === "balance" && "text-right"
								)}
							>
								<FlexRender {cell} />
							</Table.Cell>
						{/each}
					</Table.Row>

					{#if row.getIsExpanded()}
						<Table.Row>
							<Table.Cell
								class="whitespace-normal"
								colspan={row.getAllCells().length}
							>
								<div
									class="flex items-start py-2 text-primary/80"
								>
									<span
										aria-hidden="true"
										class="me-3 mt-0.5 flex w-7 shrink-0 justify-center"
									>
										<InfoIcon class="size-4 opacity-60" />
									</span>
									<p class="min-w-0 text-sm break-words">
										{row.original.note}
									</p>
								</div>
							</Table.Cell>
						</Table.Row>
					{/if}
				{/each}

				{#if table.getRowModel().rows.length === 0}
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
		</Table.Root>
	</div>

	<p class="mt-4 text-center text-sm text-muted-foreground">
		Expanding sub-row made with
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
