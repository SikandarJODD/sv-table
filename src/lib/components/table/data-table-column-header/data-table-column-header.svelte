<script lang="ts">
	import CheckIcon from "@lucide/svelte/icons/check";
	import ArrowLeftIcon from "@lucide/svelte/icons/arrow-left";
	import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import ChevronUpIcon from "@lucide/svelte/icons/chevron-up";
	import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
	import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
	import EyeOffIcon from "@lucide/svelte/icons/eye-off";
	import PanelLeftIcon from "@lucide/svelte/icons/panel-left";
	import PanelRightIcon from "@lucide/svelte/icons/panel-right";
	import PinOffIcon from "@lucide/svelte/icons/pin-off";
	import XIcon from "@lucide/svelte/icons/x";

	import { Button } from "$lib/components/ui/button";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { cn } from "$lib/utils.js";

	type SortDirection = "asc" | "desc";
	type PinPosition = false | "start" | "end";
	type ColumnPinningState = { start: string[]; end: string[] };
	type Updater<T> = T | ((current: T) => T);
	type DataTableLeafColumn = { id: string };

	type DataTableInstance = {
		getAllLeafColumns: () => DataTableLeafColumn[];
		getVisibleLeafColumns?: () => DataTableLeafColumn[];
		getCenterLeafColumns?: () => DataTableLeafColumn[];
		getCenterVisibleLeafColumns?: () => DataTableLeafColumn[];
		getStartLeafColumns?: () => DataTableLeafColumn[];
		getStartVisibleLeafColumns?: () => DataTableLeafColumn[];
		getEndLeafColumns?: () => DataTableLeafColumn[];
		getEndVisibleLeafColumns?: () => DataTableLeafColumn[];
		setColumnOrder?: (updater: Updater<string[]>) => void;
		setColumnPinning?: (updater: Updater<ColumnPinningState>) => void;
	};

	type DataTableColumn = {
		id: string;
		table?: DataTableInstance;
		getCanSort?: () => boolean;
		getCanMultiSort?: () => boolean;
		getIsSorted?: () => false | SortDirection;
		toggleSorting?: (desc?: boolean, isMulti?: boolean) => void;
		clearSorting?: () => void;
		getCanHide?: () => boolean;
		toggleVisibility?: (visible?: boolean) => void;
		getCanPin?: () => boolean;
		getIsPinned?: () => PinPosition;
		pin?: (position: PinPosition) => void;
	};

	let {
		column,
		title,
		class: className
	}: {
		column: DataTableColumn;
		title: string;
		class?: string;
	} = $props();

	let canSort = $derived(
		(column.getCanSort?.() ?? false) &&
			column.toggleSorting !== undefined &&
			column.clearSorting !== undefined
	);
	let sortDirection = $derived(column.getIsSorted?.() ?? false);
	let canHide = $derived(column.getCanHide?.() ?? false);
	let canPin = $derived(
		(column.getCanPin?.() ?? false) && column.pin !== undefined
	);
	let pinPosition = $derived(column.getIsPinned?.() ?? false);
	let canReorder = $derived(column.table?.setColumnOrder !== undefined);
	let movableColumns = $derived.by(() => {
		const table = column.table;

		if (!table) return [];
		if (pinPosition === "start") {
			return (
				table.getStartVisibleLeafColumns?.() ??
				table.getStartLeafColumns?.() ??
				[]
			);
		}
		if (pinPosition === "end") {
			return (
				table.getEndVisibleLeafColumns?.() ??
				table.getEndLeafColumns?.() ??
				[]
			);
		}

		return (
			table.getCenterVisibleLeafColumns?.() ??
			table.getCenterLeafColumns?.() ??
			table.getVisibleLeafColumns?.() ??
			table.getAllLeafColumns()
		);
	});
	let movableIndex = $derived(
		movableColumns.findIndex((item) => item.id === column.id)
	);
	let canMoveLeft = $derived(canReorder && movableIndex > 0);
	let canMoveRight = $derived(
		canReorder &&
			movableIndex >= 0 &&
			movableIndex < movableColumns.length - 1
	);
	let hasMenuActions = $derived(canSort || canHide || canPin || canReorder);

	let sortLabel = $derived(
		sortDirection === "asc"
			? "ascending"
			: sortDirection === "desc"
				? "descending"
				: "not sorted"
	);

	function toggleSorting(event: MouseEvent) {
		const isMultiSort =
			event.shiftKey && (column.getCanMultiSort?.() ?? false);

		if (sortDirection === "asc") {
			column.toggleSorting?.(true, isMultiSort);
		} else if (sortDirection === "desc") {
			column.clearSorting?.();
		} else {
			column.toggleSorting?.(false, isMultiSort);
		}
	}

	function sortAscending() {
		column.toggleSorting?.(false);
	}

	function sortDescending() {
		column.toggleSorting?.(true);
	}

	function resetSorting() {
		column.clearSorting?.();
	}

	function hideColumn() {
		column.toggleVisibility?.(false);
	}

	function pinColumn(position: Exclude<PinPosition, false>) {
		if (pinPosition === position) return;
		column.pin?.(position);
	}

	function unpinColumn() {
		column.pin?.(false);
	}

	function swapItems<T>(items: T[], firstIndex: number, secondIndex: number) {
		const next = [...items];
		[next[firstIndex], next[secondIndex]] = [
			next[secondIndex],
			next[firstIndex]
		];
		return next;
	}

	function moveColumn(offset: -1 | 1) {
		const table = column.table;
		const sibling = movableColumns[movableIndex + offset];

		if (!table?.setColumnOrder || !sibling) return;

		if (pinPosition && table.setColumnPinning) {
			table.setColumnPinning((current) => {
				const pinnedIds = current[pinPosition];
				const currentIndex = pinnedIds.indexOf(column.id);
				const siblingIndex = pinnedIds.indexOf(sibling.id);

				if (currentIndex < 0 || siblingIndex < 0) return current;

				return {
					...current,
					[pinPosition]: swapItems(
						pinnedIds,
						currentIndex,
						siblingIndex
					)
				};
			});
			return;
		}

		const allColumnIds = table.getAllLeafColumns().map((item) => item.id);
		const currentIndex = allColumnIds.indexOf(column.id);
		const siblingIndex = allColumnIds.indexOf(sibling.id);

		if (currentIndex < 0 || siblingIndex < 0) return;

		table.setColumnOrder(
			swapItems(allColumnIds, currentIndex, siblingIndex)
		);
	}
</script>

<div
	data-slot="data-table-column-header"
	class={cn("flex items-center", className)}
>
	<div
		class={cn(
			"flex items-center gap-0 rounded-md transition-colors",
			hasMenuActions && "focus-within:bg-muted hover:bg-muted"
		)}
	>
		{#if canSort}
			<Button
				variant="ghost"
				size="sm"
				class="h-8 rounded-r-none px-2 font-medium hover:bg-transparent"
				onclick={toggleSorting}
				aria-label={`Sort ${title}. Currently ${sortLabel}.`}
			>
				<span>{title}</span>
				{#if sortDirection === "asc"}
					<ChevronUpIcon class="size-4 text-muted-foreground" />
				{:else if sortDirection === "desc"}
					<ChevronDownIcon class="size-4 text-muted-foreground" />
				{:else}
					<ChevronsUpDownIcon
						class="size-4 text-muted-foreground/70"
					/>
				{/if}
			</Button>
		{:else}
			<span class="px-2 font-medium">{title}</span>
		{/if}

		{#if hasMenuActions}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button
							{...props}
							variant="ghost"
							size="icon-sm"
							class="size-7 rounded-l-none hover:bg-transparent aria-expanded:bg-transparent"
							aria-label={`Open ${title} column menu`}
						>
							<EllipsisIcon class="size-4" />
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>

				<DropdownMenu.Content align="start" class="w-44">
					{#if canSort}
						<DropdownMenu.Item
							class="relative cursor-pointer pr-8"
							onSelect={sortAscending}
						>
							<ChevronUpIcon />
							<span>Asc</span>
							{#if sortDirection === "asc"}
								<CheckIcon class="absolute right-2" />
							{/if}
						</DropdownMenu.Item>

						<DropdownMenu.Item
							class="relative cursor-pointer pr-8"
							onSelect={sortDescending}
						>
							<ChevronDownIcon />
							<span>Desc</span>
							{#if sortDirection === "desc"}
								<CheckIcon class="absolute right-2" />
							{/if}
						</DropdownMenu.Item>

						<DropdownMenu.Item
							class="cursor-pointer"
							disabled={!sortDirection}
							onSelect={resetSorting}
						>
							<XIcon />
							<span>Reset sort</span>
						</DropdownMenu.Item>
					{/if}

					{#if canSort && (canPin || canReorder)}
						<DropdownMenu.Separator />
					{/if}

					{#if canPin}
						<DropdownMenu.Item
							class="relative cursor-pointer pr-8"
							onSelect={() => pinColumn("start")}
						>
							<PanelLeftIcon />
							<span>Pin left</span>
							{#if pinPosition === "start"}
								<CheckIcon class="absolute right-2" />
							{/if}
						</DropdownMenu.Item>

						<DropdownMenu.Item
							class="relative cursor-pointer pr-8"
							onSelect={() => pinColumn("end")}
						>
							<PanelRightIcon />
							<span>Pin right</span>
							{#if pinPosition === "end"}
								<CheckIcon class="absolute right-2" />
							{/if}
						</DropdownMenu.Item>

						<DropdownMenu.Item
							class="cursor-pointer"
							disabled={!pinPosition}
							onSelect={unpinColumn}
						>
							<PinOffIcon />
							<span>Unpin</span>
						</DropdownMenu.Item>
					{/if}

					{#if canPin && canReorder}
						<DropdownMenu.Separator />
					{/if}

					{#if canReorder}
						<DropdownMenu.Item
							class="cursor-pointer"
							disabled={!canMoveLeft}
							onSelect={() => moveColumn(-1)}
						>
							<ArrowLeftIcon />
							<span>Move left</span>
						</DropdownMenu.Item>

						<DropdownMenu.Item
							class="cursor-pointer"
							disabled={!canMoveRight}
							onSelect={() => moveColumn(1)}
						>
							<ArrowRightIcon />
							<span>Move right</span>
						</DropdownMenu.Item>
					{/if}

					{#if canHide && (canSort || canPin || canReorder)}
						<DropdownMenu.Separator />
					{/if}

					{#if canHide}
						<DropdownMenu.Item
							class="cursor-pointer"
							onSelect={hideColumn}
						>
							<EyeOffIcon />
							<span>Hide</span>
						</DropdownMenu.Item>
					{/if}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{/if}
	</div>
</div>
