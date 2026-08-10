<script lang="ts">
	import { flattenBlockCodeFiles, type BlockShowcaseItem } from "./types";
	import type { CodeBlock } from "$lib/types/code";
	import CodeEditor from "./CodeEditor.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { SingleFile } from "$lib/components/ui/code";
	import {
		CodeIcon,
		PreviewIcon
	} from "$lib/components/icons/block-preview/index.js";
	import Badge from "$lib/components/spell/badge/badge.svelte";
	import { toCapitalize } from "$lib/utils";

	const MIN_PREVIEW_HEIGHT = 400;

	let {
		id,
		title,
		description = "",
		codeTree,
		previewComponent: PreviewComponent,
		components = []
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

<section {id} class="group scroll-mt-12 py-10 first:pt-0">
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
		<div class="flex items-center justify-between">
			<div class="flex gap-2" role="group" aria-label="Block view">
				{#if mode === "code"}
					<Button
						variant="secondary"
						size="sm"
						class="rounded-full active:not-aria-[haspopup]:translate-y-0"
						onclick={() => (mode = "preview")}
					>
						<PreviewIcon aria-hidden="true" />
						<span>Preview</span>
					</Button>
				{:else}
					<Button
						variant="secondary"
						size="sm"
						class="rounded-full active:not-aria-[haspopup]:translate-y-0"
						onclick={() => (mode = "code")}
					>
						<CodeIcon aria-hidden="true" />
						<span>Code</span>
					</Button>
				{/if}
			</div>
			<div class="flex gap-2">
				{#each components.slice(0, 3) as component}
					<a href={component.url}>
						<Badge variant="cyan" class="rounded-full">
							{component.name}
						</Badge>
					</a>
				{/each}
			</div>
		</div>

		{#if mode === "preview"}
			<div
				class="mt-0 bg-white pt-5 sm:pt-4 dark:bg-background"
				style={`--preview-min-height: ${MIN_PREVIEW_HEIGHT}px;`}
			>
				<div
					class="min-h-(--preview-min-height) w-full overflow-hidden"
				>
					<PreviewComponent />
				</div>
			</div>
		{:else}
			<div class="mt-0 bg-white pt-5 sm:pt-4 dark:bg-transparent">
				{#if singleFileCode}
					<SingleFile code={singleFileCode} />
				{:else}
					<CodeEditor {codeTree} />
				{/if}
			</div>
		{/if}
	</div>
</section>
