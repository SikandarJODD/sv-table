<script lang="ts">
	import BadgeCheckIcon from "@lucide/svelte/icons/badge-check";
	import BanknoteIcon from "@lucide/svelte/icons/banknote";
	import Building2Icon from "@lucide/svelte/icons/building-2";
	import CalendarDaysIcon from "@lucide/svelte/icons/calendar-days";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import ChevronUpIcon from "@lucide/svelte/icons/chevron-up";
	import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
	import GlobeIcon from "@lucide/svelte/icons/globe";
	import UserRoundIcon from "@lucide/svelte/icons/user-round";

	import {
		type ColumnDef,
		createCoreRowModel,
		createSortedRowModel,
		createTable,
		createTableState,
		rowSortingFeature,
		sortFn_alphanumeric,
		sortFn_basic,
		tableFeatures,
		type SortingState
	} from "@tanstack/svelte-table";

	import { DataTableFilter } from "$lib/components/data-table/components";
	import { createColumnConfigHelper } from "$lib/components/data-table/core/filters";
	import type {
		Column,
		FilterModel
	} from "$lib/components/data-table/core/types";
	import {
		dateFilterFn,
		numberFilterFn,
		optionFilterFn,
		textFilterFn
	} from "$lib/components/data-table/utils/filter-fns";
	import { createFilters } from "$lib/hooks";
	import { makePeople, type Person } from "$lib/seed/seed";
	import { Badge } from "$lib/components/ui/spell/badge";
	import { Button } from "$lib/components/ui/button";
	import * as Table from "$lib/components/ui/table";

	const people = makePeople(16, 9);

	const statusOptions = [
		{ label: "Active", value: "active" },
		{ label: "Pending", value: "pending" },
		{ label: "Inactive", value: "inactive" }
	] as const;

	const departmentOptions = createOptions(
		people.map((person) => person.department)
	);
	const countryOptions = createOptions(
		people.map((person) => person.country)
	);

	const dtf = createColumnConfigHelper<Person>();

	const filterColumnsConfig = [
		dtf
			.text()
			.id("fullName")
			.accessor((row) => `${row.firstName} ${row.lastName}`)
			.displayName("Name")
			.icon(UserRoundIcon)
			.build(),
		dtf
			.option()
			.id("status")
			.accessor((row) => row.status)
			.displayName("Status")
			.icon(BadgeCheckIcon)
			.options([...statusOptions])
			.build(),
		dtf
			.option()
			.id("department")
			.accessor((row) => row.department)
			.displayName("Department")
			.icon(Building2Icon)
			.options(departmentOptions)
			.build(),
		dtf
			.option()
			.id("country")
			.accessor((row) => row.country)
			.displayName("Country")
			.icon(GlobeIcon)
			.options(countryOptions)
			.build(),
		dtf
			.number()
			.id("salary")
			.accessor((row) => row.salary)
			.displayName("Salary")
			.icon(BanknoteIcon)
			.min(35_000)
			.max(200_000)
			.build(),
		dtf
			.date()
			.id("joinedAt")
			.accessor((row) => new Date(row.joinedAt))
			.displayName("Joined")
			.icon(CalendarDaysIcon)
			.build()
	] as const;

	const filterController = createFilters({
		strategy: "client",
		data: people,
		columnsConfig: filterColumnsConfig
	});

	const columnsById = new Map(
		filterController.columns.map((column) => [column.id, column] as const)
	);

	const filteredPeople = $derived.by(() =>
		people.filter((person) =>
			filterController.filters.every((filter) =>
				matchesFilter(person, filter)
			)
		)
	);

	const currencyFormatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0
	});

	const percentFormatter = new Intl.NumberFormat("en-US", {
		style: "percent",
		maximumFractionDigits: 0
	});

	const [sorting, setSorting] = createTableState<SortingState>([
		{ id: "salary", desc: true }
	]);

	const features = tableFeatures({
		rowSortingFeature,
		sortedRowModel: createSortedRowModel(),
		sortFns: {
			alphanumeric: sortFn_alphanumeric,
			basic: sortFn_basic
		}
	});

	const headerLabels: Record<string, string> = {
		name: "Name",
		email: "Email",
		department: "Department",
		status: "Status",
		joinedAt: "Joined",
		salary: "Salary",
		performance: "Performance"
	};

	const columns: ColumnDef<typeof features, Person, any>[] = [
		{
			id: "name",
			header: headerLabels.name,
			accessorFn: (row) => `${row.firstName} ${row.lastName}`,
			sortFn: "alphanumeric"
		},
		{
			id: "email",
			header: headerLabels.email,
			accessorKey: "email",
			sortFn: "alphanumeric"
		},
		{
			id: "department",
			header: headerLabels.department,
			accessorKey: "department",
			sortFn: "alphanumeric"
		},
		{
			id: "status",
			header: headerLabels.status,
			accessorKey: "status",
			sortFn: "alphanumeric"
		},
		{
			id: "joinedAt",
			header: headerLabels.joinedAt,
			accessorKey: "joinedAt",
			sortFn: "alphanumeric"
		},
		{
			id: "salary",
			header: headerLabels.salary,
			accessorKey: "salary",
			sortFn: "basic"
		},
		{
			id: "performance",
			header: headerLabels.performance,
			accessorKey: "performance",
			sortFn: "basic"
		}
	];

	const table = createTable({
		features,
		columns,
		get data() {
			return filteredPeople;
		},
		state: {
			get sorting() {
				return sorting();
			}
		},
		onSortingChange: setSorting
	});

	const activeSorting = $derived(table.atoms.sorting.get());
	const sortedRows = $derived(table.getRowModel().rows);

	function matchesFilter(person: Person, filter: FilterModel) {
		const column = columnsById.get(filter.columnId) as
			| Column<Person>
			| undefined;

		if (!column) return true;

		const value = column.accessor(person) as unknown;

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
			case "date":
				return dateFilterFn(
					value as Date,
					filter as FilterModel<"date">
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

	function createOptions(values: string[]) {
		return [...new Set(values)]
			.sort((left, right) => left.localeCompare(right))
			.map((value) => ({ label: value, value }));
	}

	function formatDate(value: string) {
		return new Date(value).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric"
		});
	}

	function formatStatus(value: Person["status"]) {
		return value.charAt(0).toUpperCase() + value.slice(1);
	}

	function getHeaderLabel(columnId: string) {
		return headerLabels[columnId] ?? columnId;
	}

	function getCellText(person: Person, columnId: string) {
		switch (columnId) {
			case "name":
				return `${person.firstName} ${person.lastName}`;
			case "email":
				return person.email;
			case "department":
				return person.department;
			case "status":
				return formatStatus(person.status);
			case "joinedAt":
				return formatDate(person.joinedAt);
			case "salary":
				return currencyFormatter.format(person.salary);
			case "performance":
				return percentFormatter.format(person.performance / 100);
			default:
				return "";
		}
	}

	function getStatusVariant(status: Person["status"]) {
		switch (status) {
			case "active":
				return "emerald";
			case "pending":
				return "amber";
			default:
				return "secondary";
		}
	}
</script>

<div class="flex w-full flex-col gap-4">
	<DataTableFilter
		columns={filterController.columns}
		filters={filterController.filters}
		actions={filterController.actions}
		strategy={filterController.strategy}
	/>

	<div
		class="flex flex-col gap-2 rounded-lg border border-border/70 bg-muted/20 p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
	>
		<p class="text-muted-foreground">
			Showing <span class="font-medium text-foreground"
				>{sortedRows.length}</span
			>
			of {people.length} seeded people
		</p>

		{#if activeSorting[0]}
			<p class="text-muted-foreground">
				Sorted by
				<span class="font-medium text-foreground">
					{getHeaderLabel(activeSorting[0].id)}
				</span>
				<span class="font-medium text-foreground">
					({activeSorting[0].desc ? "descending" : "ascending"})
				</span>
			</p>
		{:else}
			<p class="text-muted-foreground">No active sorting</p>
		{/if}
	</div>

	<div class="overflow-hidden rounded-lg border">
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							{@const sortDirection = header.column.getIsSorted()}

							<Table.Head
								aria-sort={sortDirection === "asc"
									? "ascending"
									: sortDirection === "desc"
										? "descending"
										: "none"}
							>
								{#if header.isPlaceholder}
									&nbsp;
								{:else if header.column.getCanSort()}
									<Button
										variant="ghost"
										size="sm"
										class="h-auto px-0 font-medium hover:bg-transparent"
										onclick={header.column.getToggleSortingHandler()}
									>
										{getHeaderLabel(header.column.id)}

										{#if sortDirection === "asc"}
											<ChevronUpIcon
												class="size-4 text-muted-foreground"
											/>
										{:else if sortDirection === "desc"}
											<ChevronDownIcon
												class="size-4 text-muted-foreground"
											/>
										{:else}
											<ChevronsUpDownIcon
												class="size-4 text-muted-foreground"
											/>
										{/if}
									</Button>
								{:else}
									{getHeaderLabel(header.column.id)}
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>

			<Table.Body>
				{#if sortedRows.length === 0}
					<Table.Row>
						<Table.Cell
							colspan={columns.length}
							class="py-10 text-center text-sm text-muted-foreground"
						>
							No matching people. Change the filters or clear them
							to restore the seeded rows.
						</Table.Cell>
					</Table.Row>
				{:else}
					{#each sortedRows as row (row.id)}
						<Table.Row>
							{#each row.getAllCells() as cell (cell.id)}
								<Table.Cell
									class={[
										cell.column.id === "salary" ||
										cell.column.id === "performance"
											? "tabular-nums"
											: "",
										cell.column.id === "email"
											? "text-muted-foreground"
											: ""
									]}
								>
									{#if cell.column.id === "status"}
										<Badge
											variant={getStatusVariant(
												row.original.status
											)}
										>
											{formatStatus(row.original.status)}
										</Badge>
									{:else}
										{getCellText(
											row.original,
											cell.column.id
										)}
									{/if}
								</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
</div>
