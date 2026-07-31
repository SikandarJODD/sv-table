<script lang="ts">
	import { page } from "$app/state";
	import { H1, Link, Paragraph } from "$markdown";
	import CopyPageDropdown from "./copy-page-dropdown.svelte";
	import Seo from "./seo.svelte";

	const getURLPath = (url: string) => url.split("?")[0].split("#")[0];

	let llmsTxtUrl = $derived(`${getURLPath(page.url.href)}/llms.txt`);
</script>

<Seo
	title="Introduction"
	description="Introduction to the table docs, including the Data Table Filters component and upcoming examples."
	keywords={[
		"sveltekit",
		"tailwind css",
		"shadcn-svelte",
		"docs",
		"introduction",
		"data table filters",
		"pagination"
	]}
/>

<div class="space-y-3">
	<section>
		<div
			class="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-4"
		>
			<H1 id="introduction">Introduction</H1>
			<CopyPageDropdown componentName="Introduction" {llmsTxtUrl} />
		</div>
	</section>

	<Paragraph
		>Includes the <Link href="/components/filters">Data Table Filter</Link> component.</Paragraph
	>
	<Paragraph>Inspired from Bazza UI.</Paragraph>
</div>
