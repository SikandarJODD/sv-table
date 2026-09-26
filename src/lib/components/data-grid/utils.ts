import type { Column } from "@tanstack/svelte-table";

import type {
	DataGridCellOptions,
	Direction,
	FileCellData,
	NavigationDirection,
	RowHeightValue,
	SelectOption
} from "./types";
import type { DataGridFeatures } from "./data-grid-features";

export function getCellKey(rowIndex: number, columnId: string) {
	return `${rowIndex}:${columnId}`;
}

export function parseCellKey(key: string) {
	const separator = key.indexOf(":");
	return {
		rowIndex: Number(key.slice(0, separator)),
		columnId: key.slice(separator + 1)
	};
}

export function getRowHeightValue(value: RowHeightValue) {
	return { short: 36, medium: 56, tall: 76, "extra-tall": 96 }[value];
}

export function getLineCount(value: RowHeightValue) {
	return { short: 1, medium: 2, tall: 3, "extra-tall": 4 }[value];
}

export function getColumnVariant(variant?: DataGridCellOptions["variant"]) {
	const variants = {
		text: "Text",
		"short-text": "Text",
		"long-text": "Long text",
		number: "Number",
		url: "URL",
		checkbox: "Checkbox",
		select: "Select",
		"multi-select": "Multi-select",
		date: "Date",
		file: "File"
	} as const;
	return variants[variant ?? "text"];
}

export function getColumnPinningStyle<TData extends Record<string, any>>(
	column: Column<DataGridFeatures, TData, any>,
	dir: Direction
) {
	const pinned = column.getIsPinned();
	if (!pinned) return `position:relative;width:${column.getSize()}px;`;
	const logicalSide =
		pinned === "start" ? "inset-inline-start" : "inset-inline-end";
	const offset =
		pinned === "start" ? column.getStart("start") : column.getAfter("end");
	return `${logicalSide}:${offset}px;position:sticky;z-index:2;width:${column.getSize()}px;background:var(--background);direction:${dir};`;
}

export function getColumnBorderVisibility<TData extends Record<string, any>>(
	column: Column<DataGridFeatures, TData, any>,
	nextColumn?: Column<DataGridFeatures, TData, any>
) {
	const pinned = column.getIsPinned();
	const nextPinned = nextColumn?.getIsPinned();
	return {
		showStartBorder: pinned === "end" && nextPinned !== "end",
		showEndBorder: pinned === "start" && nextPinned !== "start"
	};
}

export function getScrollDirection(
	key: string,
	dir: Direction
): NavigationDirection | null {
	if (key === "ArrowUp") return "up";
	if (key === "ArrowDown") return "down";
	if (key === "ArrowLeft") return dir === "rtl" ? "right" : "left";
	if (key === "ArrowRight") return dir === "rtl" ? "left" : "right";
	return null;
}

export function formatDateForDisplay(value?: string | null) {
	const date = value ? parseLocalDate(value) : null;
	return date
		? new Intl.DateTimeFormat(undefined, {
				year: "numeric",
				month: "short",
				day: "numeric"
			}).format(date)
		: "";
}

export function parseLocalDate(value: string) {
	const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
	if (!match) return null;
	const date = new Date(
		Number(match[1]),
		Number(match[2]) - 1,
		Number(match[3])
	);
	return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateToString(date: Date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function formatFileSize(bytes: number) {
	if (!bytes) return "0 B";
	const units = ["B", "KB", "MB", "GB"];
	const index = Math.min(
		Math.floor(Math.log(bytes) / Math.log(1024)),
		units.length - 1
	);
	return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

export function getUrlHref(value: string) {
	const trimmed = value.trim();
	if (!trimmed || /^(javascript|data|vbscript|file):/i.test(trimmed))
		return "";
	if (/^[a-z][a-z\d+.-]*:/i.test(trimmed)) {
		return /^https?:/i.test(trimmed) ? trimmed : "";
	}
	return `https://${trimmed}`;
}

export function getIsInPopover(target: EventTarget | null) {
	return (
		target instanceof Element &&
		Boolean(target.closest("[data-grid-popover],[data-grid-cell-editor]"))
	);
}

export function getIsFileCellData(value: unknown): value is FileCellData[] {
	return (
		Array.isArray(value) &&
		value.every(
			(item) =>
				typeof item === "object" &&
				item !== null &&
				typeof (item as FileCellData).id === "string" &&
				typeof (item as FileCellData).name === "string"
		)
	);
}

export function getEmptyCellValue(variant?: DataGridCellOptions["variant"]) {
	if (variant === "checkbox") return false;
	if (variant === "multi-select" || variant === "file") return [];
	if (variant === "number") return null;
	return "";
}

export function matchSelectOption(value: string, options: SelectOption[]) {
	const normalized = value.trim().toLowerCase();
	return options.find(
		(option) =>
			option.value.toLowerCase() === normalized ||
			option.label.toLowerCase() === normalized
	);
}

export function parseTsv(input: string): string[][] {
	const rows: string[][] = [[]];
	let value = "";
	let quoted = false;
	for (let index = 0; index < input.length; index += 1) {
		const char = input[index];
		if (char === '"') {
			if (quoted && input[index + 1] === '"') {
				value += '"';
				index += 1;
			} else quoted = !quoted;
		} else if (!quoted && char === "\t") {
			rows.at(-1)?.push(value);
			value = "";
		} else if (!quoted && (char === "\n" || char === "\r")) {
			if (char === "\r" && input[index + 1] === "\n") index += 1;
			rows.at(-1)?.push(value);
			rows.push([]);
			value = "";
		} else value += char;
	}
	rows.at(-1)?.push(value);
	if (rows.length > 1 && rows.at(-1)?.length === 1 && rows.at(-1)?.[0] === "")
		rows.pop();
	return rows;
}

function escapeTsv(value: unknown) {
	if (getIsFileCellData(value))
		return value.map((file) => file.name).join(", ");
	const text =
		value == null
			? ""
			: Array.isArray(value)
				? value.join(", ")
				: String(value);
	return /["\t\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function rangesToTsv(ranges: unknown[][][]) {
	return ranges
		.map((range) =>
			range.map((row) => row.map(escapeTsv).join("\t")).join("\n")
		)
		.join("\n\n");
}

export function coercePastedValue(
	value: string,
	options?: DataGridCellOptions
) {
	switch (options?.variant) {
		case "number": {
			const number = Number(value);
			return value.trim() === "" || Number.isNaN(number) ? null : number;
		}
		case "checkbox":
			return new Set(["true", "1", "yes", "checked"]).has(
				value.trim().toLowerCase()
			);
		case "select":
			return matchSelectOption(value, options.options)?.value ?? value;
		case "multi-select":
			return value
				.split(",")
				.map(
					(item) =>
						matchSelectOption(item, options.options)?.value ??
						item.trim()
				)
				.filter(Boolean);
		case "date": {
			const date = parseLocalDate(value);
			return date ? formatDateToString(date) : value;
		}
		case "file":
			return undefined;
		default:
			return value;
	}
}
