<script lang="ts">
	import { page } from "$app/state";
	import CopyPageDropdown from "$lib/components/docs/base/main/copy-page-dropdown.svelte";
	import PackageBadges from "$lib/components/docs/base/main/package-badges.svelte";
	import Seo from "$lib/components/docs/base/main/seo.svelte";
	import { PMCommand } from "$lib/components/ui/pm-command";
	import { H1, Paragraph } from "$markdown";

	const packages = ["date-fns", "@lucide/svelte", "runed", "@internationalized/date"];

	let getURLPath = (url: string) => {
		return url.split("?")[0].split("#")[0];
	};

	let llmsTxtUrl = $derived(`${getURLPath(page.url.href)}/llms.txt`);
</script>

<Seo
	title="Filters"
	description="Composable table filters with text, number, option, and date operators for Svelte apps."
	keywords={["filters", "data table", "svelte", "date-fns", "runed"]}
/>

<div class="space-y-6">
	<section>
		<div class="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-4">
			<H1 id="filters">Filters</H1>
			<CopyPageDropdown componentName="Filters" {llmsTxtUrl} />
		</div>

		<div class="mt-3 max-w-2xl">
			<Paragraph>
				Composable table filters with text, number, option, and date operators for
				Svelte apps.
			</Paragraph>
			<PackageBadges packages={packages} />
		</div>
	</section>

	<section class="max-w-3xl">
		<PMCommand command="add" args={packages} />
	</section>
</div>
