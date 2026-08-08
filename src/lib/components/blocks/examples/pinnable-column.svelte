<script lang="ts">
	import ArrowLeftToLineIcon from "@lucide/svelte/icons/arrow-left-to-line";
	import ArrowRightToLineIcon from "@lucide/svelte/icons/arrow-right-to-line";
	import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
	import PinOffIcon from "@lucide/svelte/icons/pin-off";
	import {
		columnOrderingFeature,
		columnPinningFeature,
		columnResizingFeature,
		columnSizingFeature,
		createSortedRowModel,
		createTable,
		createTableState,
		FlexRender,
		renderSnippet,
		rowSortingFeature,
		tableFeatures,
		type Column,
		type ColumnDef,
		type SortingState
	} from "@tanstack/svelte-table";
	import { onMount } from "svelte";

	import { Button } from "$lib/components/ui/button";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import * as Table from "$lib/components/ui/table";

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
	const [sorting, setSorting] = createTableState<SortingState>([]);

	const features = tableFeatures({
		columnSizingFeature,
		columnResizingFeature,
		columnOrderingFeature,
		columnPinningFeature,
		rowSortingFeature,
		sortedRowModel: createSortedRowModel()
	});

	type ItemColumn = Column<typeof features, Item, any>;

	const columns: ColumnDef<typeof features, Item, any>[] = [
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

	const headers = $derived([
		...table.getStartLeafHeaders(),
		...table.getCenterLeafHeaders(),
		...table.getEndLeafHeaders()
	]);

	function getPinningStyles(column: ItemColumn) {
		const isPinned = column.getIsPinned();
		const inset =
			isPinned === "start"
				? `inset-inline-start: ${column.getStart("start")}px;`
				: isPinned === "end"
					? `inset-inline-end: ${column.getAfter("end")}px;`
					: "";

		return `${inset} position: ${isPinned ? "sticky" : "relative"}; width: ${column.getSize()}px; z-index: ${isPinned ? 1 : 0};`;
	}

	function getPinnedBoundary(column: ItemColumn) {
		const isPinned = column.getIsPinned();

		if (isPinned === "start" && column.getIsLastColumn("start")) {
			return "start";
		}

		if (isPinned === "end" && column.getIsFirstColumn("end")) {
			return "end";
		}
	}

	function getColumnTitle(column: ItemColumn) {
		return String(column.columnDef.header ?? column.id);
	}

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
	<div class="w-full overflow-hidden rounded-lg border">
		<Table.Root
			class="table-fixed border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b"
			style={`width: ${table.getTotalSize()}px;`}
		>
			<Table.Header>
				<Table.Row class="bg-muted/50 hover:bg-muted/50">
					{#each headers as header (header.id)}
						{@const column = header.column}
						{@const isPinned = column.getIsPinned()}
						{@const title = getColumnTitle(column)}
						<Table.Head
							class="relative h-10 truncate data-pinned:bg-muted/90 data-pinned:backdrop-blur-xs data-[last-col]:border-border data-[last-col=end]:border-l data-[last-col=start]:border-r"
							colspan={header.colSpan}
							data-last-col={getPinnedBoundary(column)}
							data-pinned={isPinned || undefined}
							style={getPinningStyles(column)}
						>
							<div
								class="flex items-center justify-between gap-2"
							>
								<span class="truncate">
									{#if !header.isPlaceholder}
										<FlexRender {header} />
									{/if}
								</span>

								{#if !header.isPlaceholder && column.getCanPin()}
									{#if isPinned}
										<Button
											aria-label={`Unpin ${title} column`}
											class="-mr-1 size-7 shadow-none"
											onclick={() => column.pin(false)}
											size="icon"
											title={`Unpin ${title} column`}
											variant="ghost"
										>
											<PinOffIcon
												aria-hidden="true"
												class="size-4 opacity-60"
											/>
										</Button>
									{:else}
										<DropdownMenu.Root>
											<DropdownMenu.Trigger>
												{#snippet child({ props })}
													<Button
														{...props}
														aria-label={`Pin options for ${title} column`}
														class="-mr-1 size-7 shadow-none"
														size="icon"
														title={`Pin options for ${title} column`}
														variant="ghost"
													>
														<EllipsisIcon
															aria-hidden="true"
															class="size-4 opacity-60"
														/>
													</Button>
												{/snippet}
											</DropdownMenu.Trigger>
											<DropdownMenu.Content
												align="end"
												class="w-36"
											>
												<DropdownMenu.Item
													class="cursor-pointer"
													onSelect={() =>
														column.pin("start")}
												>
													<ArrowLeftToLineIcon
														aria-hidden="true"
														class="opacity-60"
													/>
													Stick to left
												</DropdownMenu.Item>
												<DropdownMenu.Item
													class="cursor-pointer"
													onSelect={() =>
														column.pin("end")}
												>
													<ArrowRightToLineIcon
														aria-hidden="true"
														class="opacity-60"
													/>
													Stick to right
												</DropdownMenu.Item>
											</DropdownMenu.Content>
										</DropdownMenu.Root>
									{/if}
								{/if}

								{#if column.getCanResize()}
									<button
										type="button"
										aria-label={`Resize ${title} column`}
										class="user-select-none absolute top-0 -right-2 z-10 flex h-full w-4 cursor-col-resize touch-none justify-center border-0 bg-transparent p-0 before:absolute before:inset-y-0 before:w-px before:-translate-x-px before:bg-border"
										ondblclick={() => column.resetSize()}
										onmousedown={header.getResizeHandler()}
										ontouchstart={header.getResizeHandler()}
									></button>
								{/if}
							</div>
						</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>

			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row>
						{#each [...row.getStartVisibleCells(), ...row.getCenterVisibleCells(), ...row.getEndVisibleCells()] as cell (cell.id)}
							{@const column = cell.column}
							{@const isPinned = column.getIsPinned()}
							<Table.Cell
								class="truncate data-pinned:bg-background/90 data-pinned:backdrop-blur-xs data-[last-col]:border-border data-[last-col=end]:border-l data-[last-col=start]:border-r"
								data-last-col={getPinnedBoundary(column)}
								data-pinned={isPinned || undefined}
								style={getPinningStyles(column)}
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
		Pinnable columns made with
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
