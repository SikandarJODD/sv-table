<script lang="ts">
	import { page } from "$app/state";
	import ApiTable from "$lib/components/docs/base/api-table/api-table.svelte";
	import CopyPageDropdown from "$lib/components/docs/base/main/copy-page-dropdown.svelte";
	import InstallComponent from "$lib/components/docs/base/main/install-component.svelte";
	import Seo from "$lib/components/docs/base/main/seo.svelte";
	import { H1, Paragraph, CodeSpan } from "$markdown";
	import { SingleFile } from "$lib/components/ui/code";
	import { seo, variants } from "../data";
	import ExamplesPlaceholder from "./examples-placeholder.svelte";
	import GuidesLinks from "./guides-links.svelte";
	import VariantSection from "./variant-section.svelte";

	const getURLPath = (url: string) => url.split("?")[0].split("#")[0];

	let llmsTxtUrl = $derived(`${getURLPath(page.url.href)}/llms.txt`);
	let installUrls = $derived.by(() =>
		Object.fromEntries(
			variants.map((variant) => [
				variant.id,
				`${page.url.origin}${variant.installPath}`
			])
		)
	);
</script>

<Seo title={seo.title} description={seo.description} keywords={seo.keywords} />

<div class="space-y-8 md:space-y-10">
	<section class="space-y-3">
		<div
			class="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-4"
		>
			<H1 id="pagination">Pagination</H1>
			<CopyPageDropdown componentName="Pagination" {llmsTxtUrl} />
		</div>

		<div class="max-w-2xl">
			<Paragraph>
				Use <CodeSpan>pagination</CodeSpan> for numbered links and
				<CodeSpan>pagination-arrow</CodeSpan> for compact arrow controls.
			</Paragraph>
		</div>
	</section>

	{#each variants as variant (variant.id)}
		<VariantSection
			title={variant.title}
			description={variant.description}
			preview={variant.preview}
			previewCode={variant.previewCode}
			installUrl={installUrls[variant.id]}
			installCodeBlocks={variant.installCodeBlocks}
			installPackages={variant.installPackages}
			folderStructure={variant.folderStructure}
			usageCode={variant.usageCode}
			propsTable={variant.propsTable}
		/>
	{/each}

	<ExamplesPlaceholder />
	<GuidesLinks />
</div>
