<script lang="ts">
	import BadgeCheckIcon from "@lucide/svelte/icons/badge-check";
	import CircleDollarSignIcon from "@lucide/svelte/icons/circle-dollar-sign";
	import HashIcon from "@lucide/svelte/icons/hash";
	import Heading1Icon from "@lucide/svelte/icons/heading-1";
	import MailIcon from "@lucide/svelte/icons/mail";
	import {
		createTable,
		FlexRender,
		tableFeatures,
		type ColumnDef
	} from "@tanstack/svelte-table";
	import { onMount } from "svelte";

	import { DataTableFilter } from "$lib/components/data-table/components";
	import { createColumnConfigHelper } from "$lib/components/data-table/core/filters";
	import type {
		Column,
		FilterModel
	} from "$lib/components/data-table/core/types";
	import {
		numberFilterFn,
		optionFilterFn,
		textFilterFn
	} from "$lib/components/data-table/utils/filter-fns";
	import { createFilters } from "$lib/hooks";
	import * as Table from "$lib/components/ui/table";

	type ItemStatus = "Active" | "Inactive" | "Pending";

	type Item = {
		id: number;
		name: string;
		email: string;
		age: number;
		location: string;
		flag: string;
		status: ItemStatus;
		balance: number;
	};

	const statusOptions = [
		{ label: "Active", value: "Active" },
		{ label: "Inactive", value: "Inactive" },
		{ label: "Pending", value: "Pending" }
	];

	const dtf = createColumnConfigHelper<Item>();
	const filterColumns = [
		dtf
			.text()
			.id("name")
			.accessor((item) => item.name)
			.displayName("Name")
			.icon(Heading1Icon)
			.build(),
		dtf
			.text()
			.id("email")
			.accessor((item) => item.email)
			.displayName("Email")
			.icon(MailIcon)
			.build(),
		dtf
			.number()
			.id("age")
			.accessor((item) => item.age)
			.displayName("Age")
			.icon(HashIcon)
			.min(18)
			.max(80)
			.build(),
		dtf
			.option()
			.id("status")
			.accessor((item) => item.status)
			.displayName("Status")
			.icon(BadgeCheckIcon)
			.options(statusOptions)
			.build(),
		dtf
			.number()
			.id("balance")
			.accessor((item) => item.balance)
			.displayName("Balance")
			.icon(CircleDollarSignIcon)
			.min(0)
			.max(25000)
			.build()
	] as const;

	let data = $state<Item[]>([]);
	const filterController = $derived(
		createFilters({
			strategy: "client",
			data,
			columnsConfig: filterColumns
		})
	);
	const filterColumnsById = $derived(
		new Map(
			filterController.columns.map(
				(column) => [column.id, column] as const
			)
		)
	);

	function matchesFilter(item: Item, filter: FilterModel) {
		const column = filterColumnsById.get(filter.columnId) as
			Column<Item> | undefined;

		if (!column) return true;

		const value = column.accessor(item) as unknown;

		switch (filter.type) {
			case "text":
				return textFilterFn(
					String(value ?? ""),
					filter as FilterModel<"text">
				);
			case "number":
				return numberFilterFn(
					Number(value ?? 0),
					filter as FilterModel<"number">
				);
			case "option":
				return optionFilterFn(
					String(value ?? ""),
					filter as FilterModel<"option">
				);
			default:
				return true;
		}
	}

	let filteredData = $derived.by(() =>
		data.filter((item) =>
			filterController.filters.every((filter) =>
				matchesFilter(item, filter)
			)
		)
	);

	const features = tableFeatures({});
	const columns: ColumnDef<typeof features, Item>[] = [
		{
			accessorKey: "name",
			header: "Name"
		},
		{
			accessorKey: "email",
			header: "Email"
		},
		{
			accessorKey: "age",
			header: "Age"
		},
		{
			accessorKey: "location",
			header: "Location",
			cell: ({ row }) => `${row.original.flag} ${row.original.location}`
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
					style: "currency",
					currency: "USD"
				}).format(Number(info.getValue()))
		}
	];

	const table = createTable({
		columns,
		features,
		get data() {
			return filteredData;
		}
	});

	let rows = $derived(table.getRowModel().rows);

	onMount(async () => {
		const response = await fetch("/dummy-data/data.json");
		const items = (await response.json()) as Item[];
		data = items.slice(0, 200);
	});
</script>

<div class="flex w-full flex-col gap-4">
	<DataTableFilter
		columns={filterController.columns}
		filters={filterController.filters}
		actions={filterController.actions}
		strategy={filterController.strategy}
	/>

	<div class="w-full overflow-auto rounded-lg border [&>div]:max-h-128">
		<Table.Root
			class="border-separate border-spacing-0 [&_td]:border-border [&_th]:border-b [&_th]:border-border [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b"
		>
			<Table.Header
				class="sticky top-0 z-10 bg-background/90 backdrop-blur-xs"
			>
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
				{#each rows as row (row.id)}
					<Table.Row>
						{#each row.getAllCells() as cell (cell.id)}
							<Table.Cell>
								<FlexRender {cell} />
							</Table.Cell>
						{/each}
					</Table.Row>
				{/each}

				{#if rows.length === 0}
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
</div>
