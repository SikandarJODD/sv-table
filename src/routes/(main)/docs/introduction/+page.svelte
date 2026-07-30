<script lang="ts">
	import { page } from "$app/state";
	import CopyPageDropdown from "$lib/components/docs/base/main/copy-page-dropdown.svelte";
	import Seo from "$lib/components/docs/base/main/seo.svelte";
	import { H1, Paragraph } from "$markdown";

	let getURLPath = (url: string) => {
		return url.split("?")[0].split("#")[0];
	};

	let llmsTxtUrl = $derived(`${getURLPath(page.url.href)}/llms.txt`);
</script>

<Seo
	title="Introduction"
	description="Introduction to the table docs, inspired by COSS UI and Bazza UI, built on top of TanStack Table Svelte V9."
	keywords={["sveltekit", "tailwind css", "shadcn-svelte", "docs", "introduction"]}
/>

<div class="space-y-3">
	<section>
		<div class="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-4">
			<H1 id="introduction">Introduction</H1>
			<CopyPageDropdown componentName="Introduction" {llmsTxtUrl} />
		</div>
		<div class="mt-3 max-w-2xl">
			<Paragraph>
				Inspired by COSS UI and Bazza UI.
			</Paragraph>
			<Paragraph>
				Tables are built on top of TanStack Table Svelte V9.
			</Paragraph>
		</div>
	</section>
</div>
