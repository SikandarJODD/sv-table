<script lang="ts">
	import { onMount } from "svelte";

	import {
		DataGrid,
		type DataGridColumnDef,
		type FileCellData
	} from "$lib/components/data-grid";
	import { Toaster } from "$lib/components/ui/sonner";
	import { useDataGrid } from "$lib/hooks/use-data-grid.svelte";

	type ApiItem = {
		id: number;
		name: string;
		email: string;
		age: number;
		location: string;
		status: "Active" | "Inactive" | "Pending";
		department: string;
		joinDate: string;
	};

	type GridItem = ApiItem & {
		active: boolean;
		website: string;
		tags: string[];
		attachments: FileCellData[];
	};

	const statusOptions = [
		{ label: "Active", value: "Active" },
		{ label: "Inactive", value: "Inactive" },
		{ label: "Pending", value: "Pending" }
	];

	const departmentOptions = [
		"Engineering",
		"Finance",
		"Human Resources",
		"Legal",
		"Marketing",
		"Operations",
		"Sales"
	].map((value) => ({ label: value, value }));

	const columns: DataGridColumnDef<GridItem>[] = [
		{
			accessorKey: "name",
			header: "Name",
			size: 210,
			meta: { label: "Name", cell: { variant: "short-text" } }
		},
		{
			accessorKey: "email",
			header: "Email",
			size: 260,
			meta: { label: "Email", cell: { variant: "short-text" } }
		},
		{
			accessorKey: "age",
			header: "Age",
			size: 90,
			meta: {
				label: "Age",
				cell: { variant: "number", min: 18, max: 100, step: 1 }
			}
		},
		{
			accessorKey: "status",
			header: "Status",
			size: 140,
			meta: {
				label: "Status",
				cell: { variant: "select", options: statusOptions }
			}
		},
		{
			accessorKey: "tags",
			header: "Departments",
			size: 230,
			meta: {
				label: "Departments",
				cell: { variant: "multi-select", options: departmentOptions }
			}
		},
		{
			accessorKey: "joinDate",
			header: "Joined",
			size: 150,
			meta: { label: "Joined", cell: { variant: "date" } }
		},
		{
			accessorKey: "active",
			header: "Enabled",
			size: 100,
			meta: { label: "Enabled", cell: { variant: "checkbox" } }
		},
		{
			accessorKey: "website",
			header: "Website",
			size: 240,
			meta: { label: "Website", cell: { variant: "url" } }
		},
		{
			accessorKey: "location",
			header: "Location / notes",
			size: 260,
			meta: { label: "Location", cell: { variant: "long-text" } }
		},
		{
			accessorKey: "attachments",
			header: "Attachments",
			size: 220,
			meta: {
				label: "Attachments",
				cell: {
					variant: "file",
					multiple: true,
					maxFiles: 3,
					maxFileSize: 5 * 1024 * 1024
				}
			}
		}
	];

	let data = $state<GridItem[]>([]);
	let loading = $state(true);
	let loadError = $state("");

	function emptyRow(id: number): GridItem {
		return {
			id,
			name: "New person",
			email: "",
			age: 18,
			location: "",
			status: "Pending",
			department: "Operations",
			joinDate: new Date().toISOString().slice(0, 10),
			active: false,
			website: "",
			tags: ["Operations"],
			attachments: []
		};
	}

	function appendRows(count: number) {
		const maxId = data.reduce(
			(highest, row) => Math.max(highest, row.id),
			0
		);
		data = [
			...data,
			...Array.from({ length: count }, (_, index) =>
				emptyRow(maxId + index + 1)
			)
		];
	}

	const grid = useDataGrid<GridItem>({
		get data() {
			return data;
		},
		columns,
		getRowId: (row) => String(row.id),
		enableSearch: true,
		enablePaste: true,
		enableColumnSelection: true,
		rowHeight: "medium",
		initialState: {
			columnPinning: { start: ["name"], end: [] }
		},
		onDataChange: (nextData) => (data = nextData),
		onRowAdd: () => {
			appendRows(1);
			return { rowIndex: data.length - 1, columnId: "name" };
		},
		onRowsAdd: appendRows,
		onRowsDelete: (_rows, rowIndices) => {
			const deleted = new Set(rowIndices);
			data = data.filter((_, index) => !deleted.has(index));
		}
	});

	onMount(async () => {
		try {
			const response = await fetch("/dummy-data/data.json");
			if (!response.ok)
				throw new Error(`Request failed (${response.status})`);
			const items = (await response.json()) as ApiItem[];
			data = items.slice(0, 250).map((item) => ({
				...item,
				active: item.status === "Active",
				website: `https://example.com/people/${item.id}`,
				tags: [item.department],
				attachments: []
			}));
		} catch (error) {
			loadError =
				error instanceof Error ? error.message : "Unable to load data";
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Data grid demo</title>
</svelte:head>

<main class="mx-auto w-full max-w-[1600px] space-y-5 px-4 py-8 sm:px-6">
	<div class="space-y-1">
		<h1 class="text-2xl font-semibold tracking-tight">Data grid demo</h1>
		<p class="text-sm text-muted-foreground">
			{loading
				? "Loading rows…"
				: `${data.length} rows · double-click a cell to edit · press Ctrl/Cmd + F to search`}
		</p>
		{#if loadError}
			<p role="alert" class="text-sm text-destructive">{loadError}</p>
		{/if}
	</div>

	<DataGrid {grid} height={680} />
</main>

<Toaster richColors />
