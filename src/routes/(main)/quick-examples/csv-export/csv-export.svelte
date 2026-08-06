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
	import { Input } from "$lib/components/ui/input";
	import * as Table from "$lib/components/ui/table";

	type Customer = {
		id: number;
		name: string;
		email: string;
		plan: "Free" | "Pro" | "Enterprise";
		monthlySpend: number;
	};

	const customers: Customer[] = [
		{
			id: 1,
			name: "Maya Chen",
			email: "maya@example.com",
			plan: "Pro",
			monthlySpend: 49
		},
		{
			id: 2,
			name: "Noah Williams",
			email: "noah@example.com",
			plan: "Free",
			monthlySpend: 0
		},
		{
			id: 3,
			name: "Aarav Patel",
			email: "aarav@example.com",
			plan: "Enterprise",
			monthlySpend: 299
		},
		{
			id: 4,
			name: "Sofia Garcia",
			email: "sofia@example.com",
			plan: "Pro",
			monthlySpend: 49
		},
		{
			id: 5,
			name: "Emma Wilson",
			email: "emma@example.com",
			plan: "Free",
			monthlySpend: 0
		},
		{
			id: 6,
			name: "Liam Martin",
			email: "liam@example.com",
			plan: "Enterprise",
			monthlySpend: 299
		}
	];

	let query = $state("");
	let message = $state("Filter the table, then export the matching rows.");

	const filteredCustomers = $derived.by(() => {
		const normalizedQuery = query.trim().toLowerCase();

		if (!normalizedQuery) return customers;

		return customers.filter((customer) =>
			[customer.name, customer.email, customer.plan].some((value) =>
				value.toLowerCase().includes(normalizedQuery)
			)
		);
	});

	const currency = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0
	});

	const features = tableFeatures({});
	const columns: ColumnDef<typeof features, Customer, any>[] = [
		{ accessorKey: "name", header: "Customer" },
		{ accessorKey: "email", header: "Email" },
		{ accessorKey: "plan", header: "Plan" },
		{
			accessorKey: "monthlySpend",
			header: "Monthly spend",
			cell: ({ getValue }) => currency.format(Number(getValue()))
		}
	];

	const exportColumns: CsvExportColumn<Customer>[] = [
		{ id: "name", header: "Customer", accessor: "name" },
		{ id: "email", header: "Email", accessor: "email" },
		{ id: "plan", header: "Plan", accessor: "plan" },
		{
			id: "monthlySpend",
			header: "Monthly spend",
			accessor: "monthlySpend",
			format: (value) => currency.format(Number(value))
		}
	];

	const table = createTable({
		features,
		columns,
		get data() {
			return filteredCustomers;
		},
		getRowId: (row) => String(row.id)
	});

	const headers = $derived(table.getLeafHeaders());
	const rows = $derived(table.getRowModel().rows);
	const exportRows = $derived(rows.map((row) => row.original));
</script>

<div class="flex w-full flex-col gap-4">
	<div
		class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
	>
		<Input
			bind:value={query}
			placeholder="Filter customers..."
			class="sm:max-w-xs"
		/>
		<DataTableExport
			rows={exportRows}
			columns={exportColumns}
			filename="customers"
			onExport={({ rowCount }) => {
				message = `Downloaded ${rowCount} matching ${rowCount === 1 ? "customer" : "customers"}.`;
			}}
		/>
	</div>

	<p aria-live="polite" class="text-sm text-muted-foreground">{message}</p>

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
				{:else}
					<Table.Row>
						<Table.Cell
							colspan={columns.length}
							class="h-24 text-center text-muted-foreground"
						>
							No matching customers.
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>
