<script lang="ts">
	import { page } from "$app/state";
	import { components, quickExamples } from "$lib/registry/components";
	import {
		FaviconLink,
		H1,
		H2,
		ListItem,
		Paragraph,
		UnorderedList
	} from "$markdown";
	import CopyPageDropdown from "./copy-page-dropdown.svelte";
	import Seo from "./seo.svelte";

	const getURLPath = (url: string) => url.split("?")[0].split("#")[0];

	let llmsTxtUrl = $derived(`${getURLPath(page.url.href)}/llms.txt`);
</script>

<Seo
	title="Introduction"
	description="Reusable Svelte 5 table components and examples built on TanStack Table v9."
	keywords={[
		"svelte table",
		"sveltekit",
		"svelte 5",
		"tanstack table v9",
		"data table components",
		"table examples"
	]}
/>

<div class="space-y-8">
	<section>
		<div
			class="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-4"
		>
			<H1 id="introduction">Introduction</H1>
			<CopyPageDropdown componentName="Introduction" {llmsTxtUrl} />
		</div>

		<div class="mt-3 max-w-2xl">
			<Paragraph>
				Svelte Datatables is a collection of reusable Svelte components
				and practical examples for building data tables.
			</Paragraph>
			<Paragraph>
				It currently includes <span class="text-primary"
					>{components.length} components</span
				>
				and
				<span class="text-primary"
					>{quickExamples.length}
					quick examples</span
				>, built for Svelte 5.
			</Paragraph>
		</div>
	</section>

	<section class="max-w-2xl">
		<H2 id="whats-included">What’s included</H2>
		<Paragraph>
			The collection covers the common parts needed around a data table:
		</Paragraph>
		<UnorderedList class="mt-4">
			<ListItem>Filtering and searching</ListItem>
			<ListItem>Row selection and bulk actions</ListItem>
			<ListItem>Sorting and column controls</ListItem>
			<ListItem>Pagination and page size</ListItem>
			<ListItem>CSV export and row action menus</ListItem>
		</UnorderedList>
		<Paragraph>
			Each component page includes a preview, installation command, usage
			example, and API reference.
		</Paragraph>
	</section>

	<section class="max-w-2xl">
		<H2 id="built-on-tanstack-table">Built on TanStack Table</H2>
		<Paragraph>
			The table-aware components and examples are built on
			<FaviconLink
				target="_blank"
				rel="noopener noreferrer"
				href="https://tanstack.com/table/v9/docs/overview"
				class="mr-0 rounded-sm bg-amber-100/80 px-1 text-amber-500 hover:text-amber-600 dark:bg-amber-900/30"
			>
				TanStack Table V9 for Svelte</FaviconLink
			>
		</Paragraph>
		<Paragraph>
			TanStack Table manages table state and behavior, such as sorting,
			filtering, pagination, and row selection.
		</Paragraph>
	</section>

	<!-- <section class="max-w-2xl">
		<H2 id="using-the-docs">Using the docs</H2>
		<Paragraph>
			Choose a component from the sidebar, try its example, and add it to
			your project. The component code is yours to change and adapt to
			your app.
		</Paragraph>
	</section> -->

	<section class="max-w-2xl">
		<H2 id="inspiration">Inspiration</H2>
		<Paragraph>
			SV Table is inspired by <FaviconLink href="https://ui.bazza.dev/"
				>Bazza UI</FaviconLink
			>
			and <FaviconLink href="https://coss.com/ui/">COSS UI</FaviconLink>.
		</Paragraph>
	</section>
</div>
