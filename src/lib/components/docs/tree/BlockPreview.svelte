<script lang="ts">
	import { flattenBlockCodeFiles, type BlockShowcaseItem } from "./types";
	import type { CodeBlock } from "$lib/types/code";
	import { scale } from "svelte/transition";
	import CodeEditor from "./CodeEditor.svelte";
	import { SingleFile } from "$lib/components/ui/code";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import {
		CodeIcon,
		PreviewIcon
	} from "$lib/components/icons/block-preview/index.js";

	const MIN_PREVIEW_HEIGHT = 400;

	let {
		id,
		title,
		description = "",
		codeTree,
		previewComponent: PreviewComponent
	}: BlockShowcaseItem = $props();

	let mode = $state<"preview" | "code">("preview");

	let codeFiles = $derived(flattenBlockCodeFiles(codeTree.nodes));
	let singleFileCode = $derived.by((): CodeBlock | undefined => {
		const file = codeFiles[0];

		if (codeFiles.length !== 1 || !file?.code) return undefined;

		return {
			name: file.name,
			code: file.code,
			lang: file.lang,
			highlight: file.highlight
		};
	});
</script>

<section {id} class="group scroll-mt-20 py-10 first:pt-0">
	<div class="relative mx-auto max-w-7xl">
		<div class="mb-5 space-y-1.5">
			<h2
				class="text-xl font-medium tracking-tight text-foreground sm:text-2xl"
			>
				{title}
			</h2>

			{#if description}
				<p class="max-w-3xl text-sm leading-6 text-muted-foreground">
					{description}
				</p>
			{/if}
		</div>

		<Tabs.Root bind:value={mode} class="gap-0">
			<Tabs.List
				aria-label="Block view"
				class="gap-1 rounded-lg bg-transparent p-1"
			>
				<Tabs.Trigger value="preview">
					<PreviewIcon class="size-[18px]" aria-hidden="true" />
					<span>Preview</span>
				</Tabs.Trigger>

				<Tabs.Trigger value="code">
					<CodeIcon class="size-[18px]" aria-hidden="true" />
					<span>Code</span>
				</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content
				value="preview"
				class="mt-0 bg-white pt-5 sm:pt-6 dark:bg-background"
				style={`--preview-min-height: ${MIN_PREVIEW_HEIGHT}px;`}
			>
				<div
					in:scale={{ start: 0.85 }}
					class="min-h-(--preview-min-height) w-full overflow-hidden"
				>
					<PreviewComponent />
				</div>
			</Tabs.Content>

			<Tabs.Content
				value="code"
				class="mt-0 bg-white pt-5 sm:pt-6 dark:bg-transparent"
			>
				{#if singleFileCode}
					<SingleFile code={singleFileCode} />
				{:else}
					<CodeEditor {codeTree} />
				{/if}
			</Tabs.Content>
		</Tabs.Root>
	</div>
</section>
