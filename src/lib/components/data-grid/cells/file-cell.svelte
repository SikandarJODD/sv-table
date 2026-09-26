<script lang="ts" generics="TData extends Record<string, any>">
	import FileIcon from "@lucide/svelte/icons/file";
	import FileArchiveIcon from "@lucide/svelte/icons/file-archive";
	import FileTextIcon from "@lucide/svelte/icons/file-text";
	import FilmIcon from "@lucide/svelte/icons/film";
	import ImageIcon from "@lucide/svelte/icons/image";
	import MusicIcon from "@lucide/svelte/icons/music";
	import UploadIcon from "@lucide/svelte/icons/upload";
	import XIcon from "@lucide/svelte/icons/x";
	import { onDestroy } from "svelte";
	import { toast } from "svelte-sonner";
	import { watch } from "runed";

	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import * as Popover from "$lib/components/ui/popover";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import type { DataGridController } from "$lib/hooks/use-data-grid.svelte";

	import DataGridCellWrapper from "../data-grid-cell-wrapper.svelte";
	import type { DataGridCell, FileCellData } from "../types";
	import { formatFileSize } from "../utils";

	let {
		cell,
		grid,
		rowIndex
	}: {
		cell: DataGridCell<TData>;
		grid: DataGridController<TData>;
		rowIndex: number;
	} = $props();
	function readFiles() {
		return [...((cell.getValue() as FileCellData[] | null) ?? [])];
	}
	let files = $state<FileCellData[]>(readFiles());
	let pending = $state(new Set<string>());
	let error = $state<string | null>(null);
	let dragging = $state(false);
	let inputRef = $state<HTMLInputElement | null>(null);
	const editing = $derived(grid.isEditing(rowIndex, cell.column.id));
	const options = $derived(
		cell.column.columnDef.meta?.cell?.variant === "file"
			? cell.column.columnDef.meta.cell
			: null
	);
	const accept = $derived(options?.accept);
	const maxFiles = $derived(options?.maxFiles ?? 10);
	const maxFileSize = $derived(options?.maxFileSize ?? 10 * 1024 * 1024);
	const multiple = $derived(options?.multiple ?? false);

	watch(
		() => cell.getValue(),
		(next) => {
			if (!editing) files = [...((next as FileCellData[] | null) ?? [])];
		},
		{ lazy: true }
	);

	onDestroy(() => {
		for (const file of files)
			if (file.url?.startsWith("blob:")) URL.revokeObjectURL(file.url);
	});

	function iconFor(type: string) {
		if (type.startsWith("image/")) return ImageIcon;
		if (type.startsWith("video/")) return FilmIcon;
		if (type.startsWith("audio/")) return MusicIcon;
		if (/zip|archive|compressed/.test(type)) return FileArchiveIcon;
		if (type.startsWith("text/") || /pdf|document/.test(type))
			return FileTextIcon;
		return FileIcon;
	}

	function validate(file: File) {
		if (file.size > maxFileSize)
			return `File exceeds ${formatFileSize(maxFileSize)}`;
		if (!accept) return null;
		const rules = accept
			.split(",")
			.map((rule) => rule.trim().toLowerCase());
		const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
		const accepted = rules.some((rule) =>
			rule.endsWith("/*")
				? file.type.startsWith(rule.slice(0, -1))
				: rule.startsWith(".")
					? extension === rule
					: file.type.toLowerCase() === rule
		);
		return accepted ? null : "File type is not accepted";
	}

	async function addFiles(incoming: File[]) {
		if (grid.readOnly || pending.size) return;
		error = null;
		const selected = multiple ? incoming : incoming.slice(0, 1);
		if (files.length + selected.length > maxFiles) {
			error = `Maximum ${maxFiles} file${maxFiles === 1 ? "" : "s"} allowed`;
			toast.error(error);
			return;
		}
		const valid: File[] = [];
		for (const file of selected) {
			const reason = validate(file);
			if (reason) toast.error(reason, { description: file.name });
			else valid.push(file);
		}
		if (!valid.length) return;
		const temporary = valid.map((file) => ({
			id: crypto.randomUUID(),
			name: file.name,
			size: file.size,
			type: file.type
		}));
		files = [...files, ...temporary];
		pending = new Set(temporary.map((file) => file.id));
		try {
			const uploaded = grid.options.onFilesUpload
				? await grid.options.onFilesUpload({
						files: valid,
						rowIndex,
						columnId: cell.column.id
					})
				: valid.map((file, index) => ({
						...temporary[index]!,
						url: URL.createObjectURL(file)
					}));
			const temporaryIds = new Set<string>(
				temporary.map((file) => file.id)
			);
			files = [
				...files.filter((file) => !temporaryIds.has(file.id)),
				...uploaded
			];
			grid.updateCell(rowIndex, cell.column.id, files);
		} catch (cause) {
			const temporaryIds = new Set<string>(
				temporary.map((file) => file.id)
			);
			files = files.filter((file) => !temporaryIds.has(file.id));
			toast.error(
				cause instanceof Error ? cause.message : "File upload failed"
			);
		} finally {
			pending = new Set();
			if (inputRef) inputRef.value = "";
		}
	}

	async function remove(file: FileCellData) {
		if (grid.readOnly || pending.size) return;
		pending = new Set([file.id]);
		try {
			await grid.options.onFilesDelete?.({
				fileIds: [file.id],
				rowIndex,
				columnId: cell.column.id
			});
			if (file.url?.startsWith("blob:")) URL.revokeObjectURL(file.url);
			files = files.filter((item) => item.id !== file.id);
			grid.updateCell(rowIndex, cell.column.id, files);
		} catch (cause) {
			toast.error(
				cause instanceof Error ? cause.message : "Unable to delete file"
			);
		} finally {
			pending = new Set();
		}
	}

	function drop(event: DragEvent) {
		event.preventDefault();
		dragging = false;
		void addFiles(Array.from(event.dataTransfer?.files ?? []));
	}

	function keydown(event: KeyboardEvent) {
		if (event.key === "Escape") {
			event.preventDefault();
			grid.stopEditing();
		} else if (event.key === "Tab") {
			event.preventDefault();
			grid.stopEditing({ direction: event.shiftKey ? "left" : "right" });
		}
	}
</script>

<Popover.Root
	open={editing}
	onOpenChange={(open) => !open && editing && grid.stopEditing()}
>
	<Popover.Trigger>
		{#snippet child({ props })}
			<DataGridCellWrapper
				{...props}
				{cell}
				{grid}
				{rowIndex}
				onkeydown={keydown}
			>
				<div
					data-slot="grid-cell-content"
					class="flex flex-wrap items-center gap-1 overflow-hidden"
				>
					{#each files.slice(0, 2) as file (file.id)}
						<Badge
							variant="secondary"
							class="max-w-36 gap-1 px-1.5 py-px"
						>
							{@const Icon = iconFor(file.type)}<Icon
								class="size-3 shrink-0"
							/><span class="truncate">{file.name}</span>
						</Badge>
					{/each}
					{#if files.length > 2}<Badge
							variant="outline"
							class="px-1.5 py-px">+{files.length - 2}</Badge
						>{/if}
				</div>
			</DataGridCellWrapper>
		{/snippet}
	</Popover.Trigger>
	{#if editing}
		<Popover.Content data-grid-cell-editor align="start" class="w-96 p-3">
			<div
				class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-5 text-center hover:bg-accent/30"
				class:border-primary={dragging}
				class:border-destructive={Boolean(error)}
				role="button"
				tabindex="0"
				ondragenter={(event) => {
					event.preventDefault();
					dragging = true;
				}}
				ondragover={(event) => event.preventDefault()}
				ondragleave={() => (dragging = false)}
				ondrop={drop}
				onclick={() => inputRef?.click()}
				onkeydown={(event) =>
					(event.key === "Enter" || event.key === " ") &&
					inputRef?.click()}
			>
				<UploadIcon class="size-6 text-muted-foreground" />
				<div>
					<p class="text-sm font-medium">Drop files here or browse</p>
					<p class="text-xs text-muted-foreground">
						Up to {maxFiles}, {formatFileSize(maxFileSize)} each
					</p>
				</div>
				<input
					bind:this={inputRef}
					class="sr-only"
					type="file"
					{accept}
					{multiple}
					onchange={(event) =>
						void addFiles(
							Array.from(event.currentTarget.files ?? [])
						)}
				/>
			</div>
			{#if error}<p class="mt-2 text-sm text-destructive">{error}</p>{/if}
			<div class="mt-3 max-h-64 space-y-1 overflow-y-auto">
				{#each files as file (file.id)}
					<div class="flex items-center gap-2 rounded-md border p-2">
						{#if pending.has(file.id)}
							<Skeleton class="size-8 rounded" />
						{:else}
							{@const Icon = iconFor(file.type)}<Icon
								class="size-5 text-muted-foreground"
							/>
						{/if}
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm">{file.name}</p>
							<p class="text-xs text-muted-foreground">
								{formatFileSize(file.size)}
							</p>
						</div>
						<Button
							size="icon-sm"
							variant="ghost"
							disabled={pending.size > 0}
							onclick={() => void remove(file)}
							aria-label={`Remove ${file.name}`}><XIcon /></Button
						>
					</div>
				{/each}
			</div>
		</Popover.Content>
	{/if}
</Popover.Root>
