import { createTable, type SvelteTable } from "@tanstack/svelte-table";
import {
	createVirtualizer,
	type SvelteVirtualizer,
	type VirtualItem
} from "@tanstack/svelte-virtual";
import { toast } from "svelte-sonner";
import { get, type Readable } from "svelte/store";
import { onMount, tick } from "svelte";
import { watch } from "runed";

import { copyText } from "$lib/hooks/use-clipboard.svelte";
import {
	dataGridFeatures,
	type DataGridFeatures
} from "$lib/components/data-grid/data-grid-features";
import type {
	CellPosition,
	CellUpdate,
	ContextMenuState,
	DataGridCell,
	EditingStopOptions,
	PasteDialogState,
	RowHeightValue,
	SearchState,
	UseDataGridProps
} from "$lib/components/data-grid/types";
import {
	coercePastedValue,
	getEmptyCellValue,
	getIsInPopover,
	getRowHeightValue,
	getScrollDirection,
	parseTsv,
	rangesToTsv
} from "$lib/components/data-grid/utils";

const DEFAULT_ROW_HEIGHT: RowHeightValue = "short";
const MIN_COLUMN_SIZE = 60;
const MAX_COLUMN_SIZE = 800;

export class DataGridController<TData extends Record<string, any>> {
	readonly options: UseDataGridProps<TData>;
	readonly table: SvelteTable<DataGridFeatures, TData>;
	readonly rowVirtualizer: Readable<
		SvelteVirtualizer<HTMLDivElement, HTMLDivElement>
	>;

	data = $state.raw<TData[]>([]);
	dataGridRef = $state<HTMLDivElement | null>(null);
	headerRef = $state<HTMLDivElement | null>(null);
	footerRef = $state<HTMLDivElement | null>(null);
	rowHeight = $state<RowHeightValue>(DEFAULT_ROW_HEIGHT);
	editingCell = $state<CellPosition | null>(null);
	contextMenu = $state<ContextMenuState>({ open: false, x: 0, y: 0 });
	pasteDialog = $state<PasteDialogState>({
		open: false,
		rowsNeeded: 0,
		clipboardText: ""
	});
	searchOpen = $state(false);
	searchQuery = $state("");
	searchMatches = $state.raw<CellPosition[]>([]);
	matchIndex = $state(-1);
	pendingEditKey = $state<string | null>(null);

	readonly rowMap = new Map<number, HTMLDivElement>();
	readonly cellMap = new Map<string, HTMLDivElement>();

	constructor(options: UseDataGridProps<TData>) {
		this.options = options;
		this.data = options.data;
		this.rowHeight = options.rowHeight ?? DEFAULT_ROW_HEIGHT;

		const thisController = this;
		this.table = createTable({
			...options,
			features: dataGridFeatures,
			columns: options.columns,
			initialState: {
				...options.initialState,
				columnPinning: {
					start: options.initialState?.columnPinning?.start ?? [],
					end: options.initialState?.columnPinning?.end ?? []
				}
			},
			get data() {
				return options.data === thisController.data
					? options.data
					: thisController.data;
			},
			defaultColumn: {
				minSize: MIN_COLUMN_SIZE,
				maxSize: MAX_COLUMN_SIZE
			},
			columnResizeMode: "onChange",
			columnResizeDirection: options.dir ?? "ltr",
			enableCellRangeSelection: !options.enableSingleCellSelection,
			enableMultiCellRangeSelection: !options.enableSingleCellSelection
		});

		const isFirefox =
			typeof navigator !== "undefined" &&
			navigator.userAgent.includes("Firefox");
		this.rowVirtualizer = createVirtualizer<HTMLDivElement, HTMLDivElement>(
			{
				count: this.table.getRowModel().rows.length,
				getScrollElement: () => this.dataGridRef,
				estimateSize: () => getRowHeightValue(this.rowHeight),
				overscan: options.overscan ?? 6,
				measureElement: isFirefox
					? undefined
					: (element) => element.getBoundingClientRect().height
			}
		);

		watch(
			() => options.data,
			(value) => {
				if (value !== this.data) this.data = value;
			},
			{ lazy: true }
		);

		watch(
			[
				() => this.table.getRowModel().rows.length,
				() => this.dataGridRef,
				() => this.rowHeight
			],
			([count]) => {
				get(this.rowVirtualizer).setOptions({
					count,
					getScrollElement: () => this.dataGridRef,
					estimateSize: () => getRowHeightValue(this.rowHeight),
					overscan: options.overscan ?? 6
				});
			}
		);

		watch(
			[
				() => this.table.atoms.columnFilters.get(),
				() => this.table.atoms.columnOrder.get(),
				() => this.table.atoms.columnPinning.get(),
				() => this.table.atoms.columnSizing.get(),
				() => this.table.atoms.columnVisibility.get(),
				() => this.table.atoms.sorting.get(),
				() => this.rowHeight
			],
			() => {
				requestAnimationFrame(() => get(this.rowVirtualizer).measure());
			},
			{ lazy: true }
		);

		onMount(() => {
			if (options.autoFocus && this.data.length > 0) {
				const target =
					typeof options.autoFocus === "object"
						? options.autoFocus
						: {};
				requestAnimationFrame(() =>
					this.focusCell(target.rowIndex ?? 0, target.columnId)
				);
			}

			const onPointerDown = (event: MouseEvent) => {
				if (
					this.dataGridRef &&
					!this.dataGridRef.contains(event.target as Node) &&
					!getIsInPopover(event.target)
				) {
					this.stopEditing();
					this.closeContextMenu();
				}
			};
			const onGlobalKeyDown = (event: KeyboardEvent) => {
				this.handleGlobalKeydown(event);
			};
			document.addEventListener("mousedown", onPointerDown);
			window.addEventListener("keydown", onGlobalKeyDown, true);
			return () => {
				document.removeEventListener("mousedown", onPointerDown);
				window.removeEventListener("keydown", onGlobalKeyDown, true);
			};
		});
	}

	get rows() {
		return this.table.getRowModel().rows;
	}

	get columns() {
		return this.options.columns;
	}

	get dir() {
		return this.options.dir ?? "ltr";
	}

	get readOnly() {
		return this.options.readOnly ?? false;
	}

	get searchState(): SearchState | undefined {
		if (!this.options.enableSearch) return undefined;
		return {
			searchMatches: this.searchMatches,
			matchIndex: this.matchIndex,
			searchOpen: this.searchOpen,
			searchQuery: this.searchQuery
		};
	}

	get virtualItems(): VirtualItem[] {
		return get(this.rowVirtualizer).getVirtualItems();
	}

	get virtualTotalSize() {
		return get(this.rowVirtualizer).getTotalSize();
	}

	get columnSizeStyle() {
		return this.table
			.getFlatHeaders()
			.map(
				(header) =>
					`--header-${header.id}-size:${header.getSize()};--col-${header.column.id}-size:${header.column.getSize()};`
			)
			.join("");
	}

	get activeSearchMatch() {
		return this.searchMatches[this.matchIndex] ?? null;
	}

	registerRow = (rowIndex: number, node: HTMLDivElement | null) => {
		if (node) {
			this.rowMap.set(rowIndex, node);
			get(this.rowVirtualizer).measureElement(node);
		} else this.rowMap.delete(rowIndex);
	};

	registerCell = (
		rowIndex: number,
		columnId: string,
		node: HTMLDivElement | null
	) => {
		const key = `${rowIndex}:${columnId}`;
		if (node) this.cellMap.set(key, node);
		else this.cellMap.delete(key);
	};

	isEditing = (rowIndex: number, columnId: string) =>
		this.editingCell?.rowIndex === rowIndex &&
		this.editingCell.columnId === columnId;

	isSearchMatch = (rowIndex: number, columnId: string) =>
		this.searchMatches.some(
			(match) =>
				match.rowIndex === rowIndex && match.columnId === columnId
		);

	isActiveSearchMatch = (rowIndex: number, columnId: string) =>
		this.activeSearchMatch?.rowIndex === rowIndex &&
		this.activeSearchMatch.columnId === columnId;

	consumePendingEditKey = () => {
		const key = this.pendingEditKey;
		this.pendingEditKey = null;
		return key;
	};

	startEditing = (
		rowIndex: number,
		columnId: string,
		initialKey?: string
	) => {
		if (this.readOnly) return;
		this.pendingEditKey = initialKey ?? null;
		this.editingCell = { rowIndex, columnId };
	};

	stopEditing = (options: EditingStopOptions = {}) => {
		this.editingCell = null;
		this.pendingEditKey = null;
		if (options.moveToNextRow) this.table.moveCellSelection("down");
		else if (options.direction)
			this.table.moveCellSelection(options.direction);
		requestAnimationFrame(() => this.focusActiveElement());
	};

	focusActiveElement = () => {
		const cell = this.table.getFocusedCell();
		if (!cell) return;
		const rowIndex = this.rows.findIndex((row) => row.id === cell.row.id);
		this.cellMap.get(`${rowIndex}:${cell.column.id}`)?.focus();
	};

	focusCell = (rowIndex: number, columnId?: string) => {
		const row =
			this.rows[Math.max(0, Math.min(rowIndex, this.rows.length - 1))];
		const targetColumn =
			(columnId &&
				row
					?.getVisibleCells()
					.find((cell) => cell.column.id === columnId)?.column) ||
			row?.getVisibleCells().find((cell) => cell.getCanSelect())?.column;
		if (!row || !targetColumn) return;
		this.table.setFocusedCell(row.id, targetColumn.id);
		get(this.rowVirtualizer).scrollToIndex(rowIndex, { align: "auto" });
		if (!this.searchOpen)
			requestAnimationFrame(() => this.focusActiveElement());
	};

	updateCell = (rowIndex: number, columnId: string, value: unknown) => {
		if (this.readOnly) return;
		const nextData = this.data.map((row, index) =>
			index === rowIndex ? ({ ...row, [columnId]: value } as TData) : row
		);
		this.data = nextData;
		this.options.onDataChange?.(nextData);
	};

	updateCells = async (updates: CellUpdate[]) => {
		if (this.readOnly || updates.length === 0) return;
		if (this.options.onPaste) await this.options.onPaste(updates);
		let nextData = this.data;
		for (const update of updates) {
			nextData = nextData.map((row, index) =>
				index === update.rowIndex
					? ({ ...row, [update.columnId]: update.value } as TData)
					: row
			);
		}
		this.data = nextData;
		this.options.onDataChange?.(nextData);
	};

	getSelectedCells = () => {
		const selected = this.rows.flatMap((row) =>
			row.getVisibleCells().filter((cell) => cell.getIsSelected())
		);
		const focused = this.table.getFocusedCell();
		return selected.length > 0 ? selected : focused ? [focused] : [];
	};

	copy = async () => {
		const ranges = this.table.getSelectedCellRangesData();
		if (ranges.length === 0) return;
		const status = await copyText(rangesToTsv(ranges));
		if (status === "success") toast.success("Copied to clipboard");
		else toast.error("Unable to copy to clipboard");
	};

	cut = async () => {
		if (this.readOnly) return;
		await this.copy();
		const updates = this.getSelectedCells().map((cell) => ({
			rowIndex: this.rows.findIndex((row) => row.id === cell.row.id),
			columnId: cell.column.id,
			value: getEmptyCellValue(cell.column.columnDef.meta?.cell?.variant)
		}));
		await this.updateCells(updates);
	};

	clear = async () => {
		if (this.readOnly) return;
		const updates = this.getSelectedCells().map((cell) => ({
			rowIndex: this.rows.findIndex((row) => row.id === cell.row.id),
			columnId: cell.column.id,
			value: getEmptyCellValue(cell.column.columnDef.meta?.cell?.variant)
		}));
		await this.updateCells(updates);
	};

	paste = async (text?: string) => {
		if (this.readOnly || !this.options.enablePaste) return;
		try {
			const clipboardText =
				text ?? (await navigator.clipboard.readText());
			await this.preparePaste(clipboardText);
		} catch {
			toast.error("Unable to read from clipboard");
		}
	};

	preparePaste = async (clipboardText: string) => {
		const focused = this.table.getFocusedCell();
		if (!focused || !clipboardText) return;
		const matrix = parseTsv(clipboardText);
		const startRow = this.rows.findIndex(
			(row) => row.id === focused.row.id
		);
		const rowsNeeded = Math.max(
			0,
			startRow + matrix.length - this.rows.length
		);
		if (rowsNeeded > 0) {
			this.pasteDialog = { open: true, rowsNeeded, clipboardText };
			return;
		}
		await this.applyPaste(clipboardText);
	};

	continuePaste = async (expand: boolean) => {
		const state = this.pasteDialog;
		this.closePasteDialog();
		if (expand && state.rowsNeeded > 0) {
			if (!this.options.onRowsAdd) return;
			await this.options.onRowsAdd(state.rowsNeeded);
			await tick();
		}
		await this.applyPaste(state.clipboardText, !expand);
	};

	applyPaste = async (clipboardText: string, truncate = false) => {
		const focused = this.table.getFocusedCell();
		if (!focused) return;
		const matrix = parseTsv(clipboardText);
		const rows = this.table.getRowModel().rows;
		const startRow = rows.findIndex((row) => row.id === focused.row.id);
		const columns = this.table.getVisibleLeafColumns();
		const startColumn = columns.findIndex(
			(column) => column.id === focused.column.id
		);
		const updates: CellUpdate[] = [];
		for (let y = 0; y < matrix.length; y += 1) {
			const rowIndex = startRow + y;
			if (rowIndex >= rows.length) {
				if (truncate) break;
				continue;
			}
			for (let x = 0; x < (matrix[y]?.length ?? 0); x += 1) {
				const column = columns[startColumn + x];
				if (!column || column.columnDef.enableCellSelection === false)
					continue;
				const value = coercePastedValue(
					matrix[y]?.[x] ?? "",
					column.columnDef.meta?.cell
				);
				if (value !== undefined)
					updates.push({ rowIndex, columnId: column.id, value });
			}
		}
		await this.updateCells(updates);
	};

	closePasteDialog = () => {
		this.pasteDialog = { open: false, rowsNeeded: 0, clipboardText: "" };
	};

	openContextMenu = (
		rowIndex: number,
		columnId: string,
		event: MouseEvent
	) => {
		event.preventDefault();
		const cell = this.rows[rowIndex]
			?.getVisibleCells()
			.find((item) => item.column.id === columnId);
		if (cell && !cell.getIsSelected())
			this.table.setFocusedCell(cell.row.id, columnId);
		this.contextMenu = {
			open: true,
			x: event.clientX,
			y: event.clientY,
			rowIndex,
			columnId
		};
	};

	closeContextMenu = () => {
		this.contextMenu = { open: false, x: 0, y: 0 };
	};

	deleteSelectedRows = async () => {
		if (this.readOnly) return;
		const selectedIds = new Set([
			...this.table.getCellSelectionRowIds(),
			...Object.keys(this.table.atoms.rowSelection.get()).filter(
				(id) => this.table.atoms.rowSelection.get()[id]
			)
		]);
		const indices = this.rows
			.map((row, index) => (selectedIds.has(row.id) ? index : -1))
			.filter((index) => index >= 0);
		if (indices.length === 0 && this.contextMenu.rowIndex !== undefined) {
			indices.push(this.contextMenu.rowIndex);
		}
		const originals = indices
			.map((index) => this.rows[index]?.original)
			.filter(Boolean) as TData[];
		if (this.options.onRowsDelete)
			await this.options.onRowsDelete(originals, indices);
		else {
			const deleting = new Set(indices);
			const nextData = this.data.filter(
				(_, index) => !deleting.has(index)
			);
			this.data = nextData;
			this.options.onDataChange?.(nextData);
		}
		this.table.resetCellSelection(true);
		this.table.resetRowSelection(true);
		this.closeContextMenu();
	};

	setSearchOpen = (open: boolean) => {
		if (open) {
			this.searchOpen = true;
			return;
		}

		const currentMatch = this.activeSearchMatch;
		this.searchOpen = false;
		this.searchQuery = "";
		this.searchMatches = [];
		this.matchIndex = -1;

		if (currentMatch) {
			const cell = this.cellAt(
				currentMatch.rowIndex,
				currentMatch.columnId
			);
			if (cell) this.table.setFocusedCell(cell.row.id, cell.column.id);
		}
		requestAnimationFrame(() => this.dataGridRef?.focus());
	};

	search = (query: string) => {
		this.searchQuery = query;
		const normalized = query.trim().toLowerCase();
		if (!normalized) {
			this.searchMatches = [];
			this.matchIndex = -1;
			return;
		}
		const matches: CellPosition[] = [];
		for (const [rowIndex, row] of this.rows.entries()) {
			for (const cell of row.getVisibleCells()) {
				if (
					String(cell.getValue() ?? "")
						.toLowerCase()
						.includes(normalized)
				) {
					matches.push({ rowIndex, columnId: cell.column.id });
				}
			}
		}
		this.searchMatches = matches;
		this.matchIndex = matches.length ? 0 : -1;
		if (matches[0])
			get(this.rowVirtualizer).scrollToIndex(matches[0].rowIndex, {
				align: "center"
			});
	};

	navigateSearch = (direction: 1 | -1) => {
		if (this.searchMatches.length === 0) return;
		this.matchIndex =
			(this.matchIndex + direction + this.searchMatches.length) %
			this.searchMatches.length;
		const match = this.searchMatches[this.matchIndex];
		if (!match) return;
		get(this.rowVirtualizer).scrollToIndex(match.rowIndex, {
			align: "center"
		});
		const cell = this.cellAt(match.rowIndex, match.columnId);
		if (cell) this.table.setFocusedCell(cell.row.id, cell.column.id);
	};

	selectColumn = (columnId: string) => {
		if (!this.options.enableColumnSelection || this.rows.length === 0)
			return;
		this.table.selectCellRange({
			anchorRowId: this.rows[0]!.id,
			anchorColumnId: columnId,
			focusRowId: this.rows.at(-1)!.id,
			focusColumnId: columnId
		});
	};

	addRow = async (event?: MouseEvent) => {
		if (!this.options.onRowAdd || this.readOnly) return;
		const target = await this.options.onRowAdd(event);
		await tick();
		if (target)
			this.focusCell(
				target.rowIndex ?? this.rows.length - 1,
				target.columnId
			);
	};

	setRowHeight = (value: RowHeightValue) => {
		this.rowHeight = value;
		this.options.onRowHeightChange?.(value);
	};

	handleGlobalKeydown = (event: KeyboardEvent) => {
		if (
			!this.options.enableSearch ||
			!(event.metaKey || event.ctrlKey) ||
			event.shiftKey ||
			event.key.toLowerCase() !== "f"
		)
			return;

		const target = event.target;
		if (!(target instanceof HTMLElement) || !this.dataGridRef) return;

		const isInGrid = this.dataGridRef.contains(target);
		const isInSearch = target.closest('[role="search"]') !== null;
		const isTyping =
			target.matches("input, textarea") || target.isContentEditable;

		// Preserve the browser shortcut while typing in controls outside the grid.
		if (!isInGrid && !isInSearch && isTyping) return;

		event.preventDefault();
		event.stopPropagation();
		this.setSearchOpen(!this.searchOpen);
	};

	handleKeydown = async (event: KeyboardEvent) => {
		if (getIsInPopover(event.target)) return;
		const command = event.metaKey || event.ctrlKey;
		if (
			command &&
			event.key.toLowerCase() === "f" &&
			this.options.enableSearch
		) {
			event.preventDefault();
			this.setSearchOpen(!this.searchOpen);
			return;
		}
		if (this.editingCell) return;
		if (command && event.key.toLowerCase() === "a") {
			event.preventDefault();
			this.table.selectAllCells();
			return;
		}
		if (command && event.key.toLowerCase() === "c") {
			event.preventDefault();
			await this.copy();
			return;
		}
		if (command && event.key.toLowerCase() === "x") {
			event.preventDefault();
			await this.cut();
			return;
		}
		if (command && event.key.toLowerCase() === "v") {
			event.preventDefault();
			await this.paste();
			return;
		}
		if (event.key === "Escape") {
			event.preventDefault();
			if (this.searchOpen) this.setSearchOpen(false);
			else this.table.resetCellSelection(true);
			return;
		}
		if (
			(event.key === "Delete" || event.key === "Backspace") &&
			!this.readOnly
		) {
			event.preventDefault();
			await this.clear();
			return;
		}
		const direction = getScrollDirection(event.key, this.dir);
		if (direction) {
			event.preventDefault();
			if (event.shiftKey) this.table.extendCellSelection(direction);
			else this.table.moveCellSelection(direction);
			requestAnimationFrame(() => this.focusActiveElement());
			return;
		}
		if (event.key === "Tab") {
			event.preventDefault();
			this.table.moveCellSelection(event.shiftKey ? "left" : "right");
			requestAnimationFrame(() => this.focusActiveElement());
			return;
		}
		const focused = this.table.getFocusedCell();
		if (!focused) return;
		const rowIndex = this.rows.findIndex(
			(row) => row.id === focused.row.id
		);
		if (event.key === "Enter" || event.key === "F2") {
			event.preventDefault();
			this.startEditing(rowIndex, focused.column.id);
		} else if (
			!this.readOnly &&
			event.key.length === 1 &&
			!command &&
			!event.altKey
		) {
			event.preventDefault();
			this.startEditing(rowIndex, focused.column.id, event.key);
		}
	};

	cellAt = (
		rowIndex: number,
		columnId: string
	): DataGridCell<TData> | undefined =>
		this.rows[rowIndex]
			?.getVisibleCells()
			.find((cell) => cell.column.id === columnId);
}

export function useDataGrid<TData extends Record<string, any>>(
	options: UseDataGridProps<TData>
) {
	return new DataGridController(options);
}
