<script lang="ts">
	import SlidersHorizontalIcon from "@lucide/svelte/icons/sliders-horizontal";

	import { Button } from "$lib/components/ui/button";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { cn } from "$lib/utils.js";

	type DataTableViewColumn = {
		id: string;
		columnDef?: { header?: unknown };
		getCanHide?: () => boolean;
		getIsVisible?: () => boolean;
		toggleVisibility?: (visible?: boolean) => void;
	};

	type DataTableViewTable = {
		getAllLeafColumns: () => DataTableViewColumn[];
	};

	let {
		table,
		label = "View",
		class: className
	}: {
		table: DataTableViewTable;
		label?: string;
		class?: string;
	} = $props();

	let hideableColumns = $derived(
		table
			.getAllLeafColumns()
			.filter(
				(column) =>
					(column.getCanHide?.() ?? false) &&
					column.getIsVisible !== undefined &&
					column.toggleVisibility !== undefined
			)
	);

	function getColumnLabel(column: DataTableViewColumn) {
		const header = column.columnDef?.header;

		if (typeof header === "string") return header;

		return column.id
			.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
			.replace(/[-_]+/g, " ")
			.replace(/^\w/, (character) => character.toUpperCase());
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				size="sm"
				class={cn("ml-auto", className)}
				disabled={hideableColumns.length === 0}
				aria-label={`${label}: choose visible columns`}
			>
				<SlidersHorizontalIcon />
				{label}
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>

	<DropdownMenu.Content align="end" class="w-44">
		<DropdownMenu.Label>Toggle columns</DropdownMenu.Label>
		<DropdownMenu.Separator />

		{#each hideableColumns as column (column.id)}
			<DropdownMenu.CheckboxItem
				checked={column.getIsVisible?.() ?? true}
				onCheckedChange={(checked) =>
					column.toggleVisibility?.(checked)}
				closeOnSelect={false}
				class="capitalize"
			>
				{getColumnLabel(column)}
			</DropdownMenu.CheckboxItem>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
