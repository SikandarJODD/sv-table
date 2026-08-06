<script lang="ts" module>
	export type CsvValue = string | number | boolean | Date | null | undefined;

	export type CsvExportColumn<T> = {
		id: string;
		header: string;
		accessor: keyof T | ((row: T) => CsvValue);
		format?: (value: CsvValue, row: T) => CsvValue;
	};

	export type CsvExportResult = {
		filename: string;
		rowCount: number;
	};
</script>

<script lang="ts" generics="T">
	import DownloadIcon from "@lucide/svelte/icons/download";

	import { Button } from "$lib/components/ui/button";
	import { cn } from "$lib/utils.js";

	type Props = {
		rows: T[];
		columns: CsvExportColumn<T>[];
		filename?: string;
		label?: string;
		delimiter?: string;
		includeBom?: boolean;
		protectFormulas?: boolean;
		disabled?: boolean;
		class?: string;
		onExport?: (result: CsvExportResult) => void;
	};

	let {
		rows,
		columns,
		filename = "table-export",
		label = "Export CSV",
		delimiter = ",",
		includeBom = true,
		protectFormulas = true,
		disabled = false,
		class: className,
		onExport
	}: Props = $props();

	function getValue(row: T, column: CsvExportColumn<T>): CsvValue {
		const value =
			typeof column.accessor === "function"
				? column.accessor(row)
				: (row[column.accessor] as CsvValue);

		return column.format ? column.format(value, row) : value;
	}

	function stringifyValue(value: CsvValue) {
		if (value === null || value === undefined) return "";
		if (value instanceof Date) return value.toISOString();

		const text = String(value);

		if (
			protectFormulas &&
			typeof value === "string" &&
			/^[=+\-@\t\r]/.test(text)
		) {
			return `'${text}`;
		}

		return text;
	}

	function escapeCell(value: CsvValue) {
		const text = stringifyValue(value);
		const escaped = text.replaceAll('"', '""');

		return text.includes(delimiter) || /["\r\n]/.test(text)
			? `"${escaped}"`
			: escaped;
	}

	function getFilename() {
		return filename.toLowerCase().endsWith(".csv")
			? filename
			: `${filename}.csv`;
	}

	function exportCsv() {
		if (
			rows.length === 0 ||
			columns.length === 0 ||
			delimiter.length === 0
		) {
			return;
		}

		const lines = [
			columns.map((column) => escapeCell(column.header)).join(delimiter),
			...rows.map((row) =>
				columns
					.map((column) => escapeCell(getValue(row, column)))
					.join(delimiter)
			)
		];
		const csv = `${includeBom ? "\uFEFF" : ""}${lines.join("\r\n")}`;
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		const resolvedFilename = getFilename();

		anchor.href = url;
		anchor.download = resolvedFilename;
		anchor.hidden = true;
		document.body.append(anchor);
		anchor.click();
		anchor.remove();
		setTimeout(() => URL.revokeObjectURL(url), 0);

		onExport?.({ filename: resolvedFilename, rowCount: rows.length });
	}
</script>

<Button
	type="button"
	variant="outline"
	size="sm"
	class={cn("shrink-0", className)}
	disabled={disabled ||
		rows.length === 0 ||
		columns.length === 0 ||
		delimiter.length === 0}
	onclick={exportCsv}
>
	<DownloadIcon />
	{label}
</Button>
