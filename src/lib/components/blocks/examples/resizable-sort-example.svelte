<script lang="ts">
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import ChevronUpIcon from "@lucide/svelte/icons/chevron-up";
	import {
		columnResizingFeature,
		columnSizingFeature,
		createSortedRowModel,
		createTable,
		createTableState,
		FlexRender,
		renderSnippet,
		rowSortingFeature,
		tableFeatures,
		type ColumnDef,
		type SortingState
	} from "@tanstack/svelte-table";
	import { onMount } from "svelte";

	import * as Table from "$lib/components/ui/table";
	import { cn } from "$lib/utils";

	type Item = {
		id: number;
		name: string;
		email: string;
		location: string;
		flag: string;
		status: "Active" | "Inactive" | "Pending";
		balance: number;
		department: string;
		role: string;
		joinDate: string;
		lastActive: string;
		performance: "Excellent" | "Good" | "Average" | "Poor";
	};

	let data = $state<Item[]>([]);
	const [sorting, setSorting] = createTableState<SortingState>([
		{ id: "name", desc: false }
	]);

	const features = tableFeatures({
		columnSizingFeature,
		columnResizingFeature,
		rowSortingFeature,
		sortedRowModel: createSortedRowModel()
	});

	const columns: ColumnDef<typeof features, Item, any>[] = [
		{
			accessorKey: "name",
			header: "Name",
			cell: ({ row }) =>
				renderSnippet(nameCell, { name: row.original.name }),
			sortDescFirst: false,
			sortUndefined: "last"
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
			header: "Status"
		},
		{
			accessorKey: "balance",
			header: "Balance",
			cell: (info) =>
				new Intl.NumberFormat("en-US", {
					currency: "USD",
					style: "currency"
				}).format(Number(info.getValue()))
		},
		{
			accessorKey: "department",
			header: "Department"
		},
		{
			accessorKey: "role",
			header: "Role"
		},
		{
			accessorKey: "joinDate",
			header: "Join Date"
		},
		{
			accessorKey: "lastActive",
			header: "Last Active"
		},
		{
			accessorKey: "performance",
			header: "Performance"
		}
	];

	const table = createTable({
		features,
		columns,
		columnResizeMode: "onChange",
		enableSortingRemoval: false,
		get data() {
			return data;
		},
		state: {
			get sorting() {
				return sorting();
			}
		},
		onSortingChange: setSorting
	});

	onMount(async () => {
		const response = await fetch("/dummy-data/data.json");
		const items = (await response.json()) as Item[];
		data = items.slice(0, 5);
	});
</script>

{#snippet nameCell({ name }: { name: string })}
	<div class="truncate font-medium">{name}</div>
{/snippet}

{#snippet locationCell({ flag, location }: { flag: string; location: string })}
	<div class="truncate">
		<span class="text-lg leading-none">{flag}</span>
		{location}
	</div>
{/snippet}

<div>
	<div class="w-full overflow-x-auto rounded-lg border">
		<Table.Root
			class="table-fixed"
			style={`width: ${table.getCenterTotalSize()}px;`}
		>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row class="bg-muted/50 hover:bg-muted/50">
						{#each headerGroup.headers as header (header.id)}
							<Table.Head
								aria-sort={header.column.getIsSorted() === "asc"
									? "ascending"
									: header.column.getIsSorted() === "desc"
										? "descending"
										: "none"}
								class="relative h-10 select-none last:[&>.cursor-col-resize]:opacity-0"
								colspan={header.colSpan}
								style={`width: ${header.getSize()}px;`}
							>
								{#if !header.isPlaceholder}
									<button
										type="button"
										class={cn(
											"flex h-full w-full items-center justify-between gap-2 text-left select-none",
											header.column.getCanSort()
												? "cursor-pointer"
												: "cursor-default"
										)}
										disabled={!header.column.getCanSort()}
										onclick={header.column.getToggleSortingHandler()}
									>
										<span class="truncate">
											<FlexRender {header} />
										</span>
										{#if header.column.getIsSorted() === "asc"}
											<ChevronUpIcon
												aria-hidden="true"
												class="size-4 shrink-0 opacity-60"
											/>
										{:else if header.column.getIsSorted() === "desc"}
											<ChevronDownIcon
												aria-hidden="true"
												class="size-4 shrink-0 opacity-60"
											/>
										{/if}
									</button>
								{/if}

								{#if header.column.getCanResize()}
									<button
										type="button"
										aria-label={`Resize ${header.column.id} column`}
										class="user-select-none absolute top-0 -right-2 z-10 flex h-full w-4 cursor-col-resize touch-none justify-center border-0 bg-transparent p-0 before:absolute before:inset-y-0 before:w-px before:translate-x-px before:bg-border"
										ondblclick={() =>
											header.column.resetSize()}
										onmousedown={header.getResizeHandler()}
										ontouchstart={header.getResizeHandler()}
									></button>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>

			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row>
						{#each row.getAllCells() as cell (cell.id)}
							<Table.Cell
								class="truncate"
								style={`width: ${cell.column.getSize()}px;`}
							>
								<FlexRender {cell} />
							</Table.Cell>
						{/each}
					</Table.Row>
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
		Resizable and sortable columns made with
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
