<script lang="ts" module>
	import type { Component } from "svelte";
	import type { CodeBlock } from "$lib/types/code";
	import type { PropsTable } from "$lib/types/structure";

	export type VariantSectionProps = {
		title: string;
		description: string;
		preview: Component;
		previewCode: CodeBlock;
		installUrl: string;
		installCodeBlocks: CodeBlock[];
		installPackages?: string[];
		folderStructure: string;
		usageCode: CodeBlock;
		propsTable: PropsTable;
	};
</script>

<script lang="ts">
	import ApiTable from "$lib/components/docs/base/api-table/api-table.svelte";
	import InstallComponent from "$lib/components/docs/base/main/install-component.svelte";
	import { H2, H3, Paragraph } from "$markdown";
	import { SingleFile } from "$lib/components/ui/code";
	import { PreviewComponent } from "$lib/components/ui/preview-component";

	let {
		title,
		description,
		preview,
		previewCode,
		installUrl,
		installCodeBlocks,
		installPackages = [],
		folderStructure,
		usageCode,
		propsTable
	}: VariantSectionProps = $props();

	let Preview = $derived(preview);
</script>

<section class="space-y-5">
	<div class="space-y-2">
		<H2 id={title.toLowerCase().replace(/\s+/g, "-")}>{title}</H2>
		<Paragraph>{description}</Paragraph>
	</div>

	<PreviewComponent code={previewCode} frame>
		{#if Preview}
			<Preview />
		{/if}
	</PreviewComponent>

	<div class="space-y-3">
		<H3 id={`${title.toLowerCase().replace(/\s+/g, "-")}-installation`}>
			Installation
		</H3>
		<InstallComponent
			{installUrl}
			codeBlocks={installCodeBlocks}
			packages={installPackages}
			{folderStructure}
			class="mt-0"
		/>
	</div>

	<div class="space-y-3">
		<H3 id={`${title.toLowerCase().replace(/\s+/g, "-")}-usage`}>Usage</H3>
		<SingleFile code={usageCode} />
	</div>

	<div class="space-y-3">
		<H3 id={`${title.toLowerCase().replace(/\s+/g, "-")}-props`}>Props</H3>
		<ApiTable data={propsTable} />
	</div>
</section>
