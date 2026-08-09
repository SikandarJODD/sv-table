<script lang="ts">
	import {
		collectDefaultOpenFolderIds,
		findBlockCodeFile,
		getDefaultBlockCodeFile,
		type BlockCodeTree
	} from "./types";
	import Check from "@lucide/svelte/icons/check";
	import Copy from "@lucide/svelte/icons/copy";
	import ExternalLink from "@lucide/svelte/icons/external-link";
	import { UseClipboard } from "$lib/hooks/use-clipboard.svelte";
	import { scale } from "svelte/transition";
	import CodeTreeNode from "./CodeTreeNode.svelte";
	import { Button } from "$lib/components/ui/button";
	import * as Code from "$lib/components/ui/code";
	import ScrollFadeEffect from "$lib/components/ui/scroll-area/scroll-fade-effect.svelte";

	import {
		ReiconFileIcon,
		ReiconFolderIcon
	} from "$lib/components/icons/block-preview";

	let { codeTree }: { codeTree: BlockCodeTree } = $props();

	let clipboard = new UseClipboard({ delay: 1500 });
	let openFolderIds = $state(new Set<string>());
	let activeFileId = $state("");

	let fallbackFileId = $derived(getDefaultBlockCodeFile(codeTree)?.id ?? "");
	let activeFile = $derived(
		findBlockCodeFile(codeTree, activeFileId) ??
			getDefaultBlockCodeFile(codeTree)
	);

	$effect(() => {
		activeFileId = fallbackFileId;
		openFolderIds = new Set(collectDefaultOpenFolderIds(codeTree.nodes));
	});

	function selectFile(fileId: string) {
		activeFileId = fileId;
	}

	function toggleFolder(folderId: string) {
		const next = new Set(openFolderIds);

		if (next.has(folderId)) {
			next.delete(folderId);
		} else {
			next.add(folderId);
		}

		openFolderIds = next;
	}

	async function copyCode() {
		if (!activeFile) return;
		if (!activeFile.code) return;
		await clipboard.copy(activeFile.code);
	}
</script>

<!-- border-t -->
<div
	class="flex flex-col overflow-hidden rounded-xl border sm:min-h-128 sm:flex-row"
>
	<div
		class="w-full border-b bg-neutral-50 text-black [--color-background:var(--color-zinc-900)] [--color-foreground:white] [--color-muted:var(--color-zinc-800)] sm:w-72 sm:border-r sm:border-b-0 dark:bg-zinc-900/25 dark:text-white"
	>
		<div
			class="flex items-center gap-1.5 border-b px-4 py-2.5 font-mono text-sm text-muted-foreground"
		>
			<ReiconFolderIcon class="size-3.5" />
			Files
		</div>
		<div class="max-h-[18rem] overflow-auto px-1 pt-1 sm:max-h-[36rem]">
			{#each codeTree.nodes as node (node.id)}
				<CodeTreeNode
					{node}
					{activeFileId}
					{openFolderIds}
					onSelectFile={selectFile}
					onToggleFolder={toggleFolder}
				/>
			{/each}
		</div>
	</div>

	<div class="relative min-w-0 flex-1">
		<div
			class="flex items-center justify-between gap-3 border-b py-1 pr-1 pl-2.5"
		>
			<p
				class="flex min-w-0 items-center gap-1.5 truncate font-mono text-sm text-muted-foreground"
			>
				<ReiconFileIcon class="size-3.5" />
				{activeFile?.name ?? "No file selected"}
			</p>

			<div class="flex items-center gap-1">
				{#if activeFile?.externalUrl}
					<Button
						class="h-8 gap-1.5 px-3 text-xs"
						variant="outline"
						size="sm"
						href={activeFile.externalUrl}
						target="_blank"
					>
						<ExternalLink class="size-3.5" />
						<span>{activeFile.externalLabel ?? "Open docs"}</span>
					</Button>
				{/if}

				{#if activeFile?.code}
					<Button
						class="h-8 w-8 shrink-0"
						variant="ghost"
						size="icon"
						type="button"
						onclick={copyCode}
					>
						{#if clipboard.status === "success"}
							<span in:scale>
								<Check class="!size-3.5 text-[#10B981]" />
							</span>
						{:else}
							<span in:scale>
								<Copy class="!size-3.5 opacity-50" />
							</span>
						{/if}
					</Button>
				{/if}
			</div>
		</div>

		<div class="">
			{#if activeFile?.code}
				<ScrollFadeEffect class="max-h-[600px]">
					<Code.Root
						code={activeFile.code}
						lang={activeFile.lang}
						highlight={activeFile.highlight}
						class="h-auto w-full overflow-visible rounded-none border-none"
					/>
				</ScrollFadeEffect>
			{:else if activeFile?.externalUrl}
				<div
					class="flex min-h-[20rem] items-center justify-center px-6"
				>
					<div class="max-w-md text-center">
						<p class="text-sm font-medium text-foreground">
							{activeFile.externalLabel ?? activeFile.name}
						</p>
						<p class="mt-2 text-sm leading-6 text-muted-foreground">
							This base UI component is referenced from its
							original source instead of being duplicated here.
						</p>
						<div class="mt-4 flex justify-center">
							<Button
								href={activeFile.externalUrl}
								target="_blank"
								variant="outline"
								size="sm"
							>
								<ExternalLink class="size-3.5" />
								<span>Open component docs</span>
							</Button>
						</div>
					</div>
				</div>
			{:else}
				<div
					class="flex h-full min-h-[20rem] items-center justify-center px-6 text-sm text-muted-foreground"
				>
					No code files are available for this block yet.
				</div>
			{/if}
		</div>
	</div>
</div>
