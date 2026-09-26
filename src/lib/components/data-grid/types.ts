import type {
	Cell,
	ColumnDef,
	RowData,
	TableOptions,
	TableState
} from "@tanstack/svelte-table";
import type { HTMLAttributes } from "svelte/elements";

import type { DataGridFeatures } from "./data-grid-features";

export type Direction = "ltr" | "rtl";
export type RowHeightValue = "short" | "medium" | "tall" | "extra-tall";
export type NavigationDirection = "up" | "down" | "left" | "right";

export interface CellPosition {
	rowIndex: number;
	columnId: string;
}

export interface CellUpdate extends CellPosition {
	value: unknown;
}

export interface SelectOption {
	label: string;
	value: string;
}

export interface FileCellData {
	id: string;
	name: string;
	size: number;
	type: string;
	url?: string;
}

export type DataGridCellOptions =
	| { variant?: "text" | "short-text" }
	| { variant: "long-text" }
	| { variant: "number"; min?: number; max?: number; step?: number }
	| { variant: "url" }
	| { variant: "checkbox" }
	| { variant: "select"; options: SelectOption[] }
	| { variant: "multi-select"; options: SelectOption[] }
	| { variant: "date" }
	| {
			variant: "file";
			accept?: string;
			maxFileSize?: number;
			maxFiles?: number;
			multiple?: boolean;
	  };

export interface DataGridColumnMeta {
	label?: string;
	cell?: DataGridCellOptions;
}

export interface ContextMenuState extends Partial<CellPosition> {
	open: boolean;
	x: number;
	y: number;
}

export interface PasteDialogState {
	open: boolean;
	rowsNeeded: number;
	clipboardText: string;
}

export interface SearchState {
	searchMatches: CellPosition[];
	matchIndex: number;
	searchOpen: boolean;
	searchQuery: string;
}

export interface EditingStopOptions {
	direction?: NavigationDirection;
	moveToNextRow?: boolean;
}

export type DataGridColumnDef<TData extends RowData> = ColumnDef<
	DataGridFeatures,
	TData,
	any
>;
export type DataGridCell<TData extends RowData> = Cell<
	DataGridFeatures,
	TData,
	any
>;

export interface UseDataGridProps<TData extends RowData> extends Omit<
	TableOptions<DataGridFeatures, TData>,
	| "features"
	| "data"
	| "columns"
	| "defaultColumn"
	| "columnResizeMode"
	| "columnResizeDirection"
> {
	data: TData[];
	columns: DataGridColumnDef<TData>[];
	onDataChange?: (data: TData[]) => void;
	onRowAdd?: (
		event?: MouseEvent
	) => Partial<CellPosition> | Promise<Partial<CellPosition> | null> | null;
	onRowsAdd?: (count: number) => void | Promise<void>;
	onRowsDelete?: (
		rows: TData[],
		rowIndices: number[]
	) => void | Promise<void>;
	onPaste?: (updates: CellUpdate[]) => void | Promise<void>;
	onFilesUpload?: (params: {
		files: File[];
		rowIndex: number;
		columnId: string;
	}) => Promise<FileCellData[]>;
	onFilesDelete?: (params: {
		fileIds: string[];
		rowIndex: number;
		columnId: string;
	}) => void | Promise<void>;
	rowHeight?: RowHeightValue;
	onRowHeightChange?: (rowHeight: RowHeightValue) => void;
	overscan?: number;
	dir?: Direction;
	autoFocus?: boolean | Partial<CellPosition>;
	enableSingleCellSelection?: boolean;
	enableColumnSelection?: boolean;
	enableSearch?: boolean;
	enablePaste?: boolean;
	readOnly?: boolean;
}

export interface DataGridProps<
	TData extends RowData
> extends HTMLAttributes<HTMLDivElement> {
	height?: number;
	stretchColumns?: boolean;
}

declare module "@tanstack/svelte-table" {
	interface ColumnMeta<TFeatures, TData, TValue> extends DataGridColumnMeta {}
}

export type DataGridInitialState = Partial<TableState<DataGridFeatures>>;
