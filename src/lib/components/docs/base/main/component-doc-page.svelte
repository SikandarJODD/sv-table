<!-- Main File -->
<script lang="ts" module>
	import type { Component } from "svelte";
	import type { CodeBlock } from "$lib/types/code";
	import type { SEO } from "$lib/types/seo";
	import type { Example } from "$lib/types/example";
	import type { PropsTable } from "$lib/types/structure";

	export type ComponentDocPageProps = {
		id: string;
		title: string;
		description: string;
		seo: SEO;
		installPathPrefix?: "r" | "s" | "f";
		preview?: Component;
		previewCode?: CodeBlock | CodeBlock[];
		installCodeBlocks?: CodeBlock | CodeBlock[];
		installPackages?: string[];
		installFolderStructure?: string;
		installTailwindCode?: CodeBlock;
		examples?: Example[];
		propsTables?: PropsTable[];
		descriptionClass?: string;
		previewFrame?: boolean;
	};
</script>

<script lang="ts">
	import { page } from "$app/state";
	import { H1, H2, Paragraph, H3 } from "$markdown";
	import PackageBadges from "./package-badges.svelte";
	import InstallComponent from "./install-component.svelte";
	import ApiTable from "../api-table/api-table.svelte";
	import Seo from "./seo.svelte";
	import { PreviewComponent } from "$lib/components/ui/preview-component";
	import CopyPageDropdown from "./copy-page-dropdown.svelte";

	let {
		id,
		title,
		description,
		seo,
		installPathPrefix,
		preview,
		previewCode,
		installCodeBlocks,
		installPackages = [],
		installFolderStructure,
		installTailwindCode,
		examples = [],
		propsTables = [],
		descriptionClass = "",
		previewFrame = false
	}: ComponentDocPageProps = $props();

	let PreviewComp = $derived(preview);
	let installUrl = $derived(`${page.url.origin}/r/${id}.json`);

	let getURLPath = (url: string) => {
		// clean url by removing query params and hash
		let cleanUrl = url.split("?")[0].split("#")[0];
		return cleanUrl;
	};

	let llmsTxtUrl = $derived(`${getURLPath(page.url.href)}/llms.txt`);
</script>

<Seo title={seo.title} description={seo.description} keywords={seo.keywords} />
