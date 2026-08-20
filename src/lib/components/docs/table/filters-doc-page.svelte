<script lang="ts">
	import { page } from "$app/state";
	import CopyPageDropdown from "$lib/components/docs/base/main/copy-page-dropdown.svelte";
	import Seo from "$lib/components/docs/base/main/seo.svelte";
	import { H1, Paragraph } from "$markdown";
	import GuidesSection from "./guides-section.svelte";
	import InstallationSection from "./installation-section.svelte";
	import ConceptsSection from "./concepts-section.svelte";
	import { filterPackages } from "./filters-doc-content";
	import PackageBadges from "../base/main/package-badges.svelte";
	import FiltersPreview from "./filters-preview.svelte";

	const getURLPath = (url: string) => url.split("?")[0].split("#")[0];

	let llmsTxtUrl = $derived(`${getURLPath(page.url.href)}/llms.txt`);
	let componentURL = $derived(page.url.origin + "/r/filters.json");
</script>

<Seo
	title="Data Table Filters"
	description="Composable table filters with text, number, option, and date operators for Svelte apps."
	keywords={[
		"data table filters",
		"svelte data table",
		"svelte table filters",
		"tanstack table svelte",
		"table filtering",
		"column filters",
		"faceted filters",
		"server-side filtering",
		"client-side filtering",
		"date filters",
		"filter operators",
		"filters",
		"data table",
		"svelte",
		"date-fns",
		"runed"
	]}
/>

<div class="space-y-8 md:space-y-10">
	<section>
		<div
			class="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-4"
		>
			<H1 id="filters">Data Table Filters</H1>
			<CopyPageDropdown componentName="Filters" {llmsTxtUrl} />
		</div>

		<div class="mt-3 max-w-2xl">
			<Paragraph>
				A powerful data table filter component. Library-agnostic.
				Supports client and server-side filtering. Inspired from <span
					>Bazza UI</span
				>
			</Paragraph>
		</div>
		<div>
			<PackageBadges packages={filterPackages} />
		</div>
	</section>
	<div class="min-h-80! rounded-lg border border-dashed p-4">
		<FiltersPreview />
	</div>

	<InstallationSection {componentURL} />
	<ConceptsSection />
	<GuidesSection />
</div>
