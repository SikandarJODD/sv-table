<script lang="ts">
	import { page } from "$app/state";
	import CopyPageDropdown from "$lib/components/docs/base/main/copy-page-dropdown.svelte";
	import Seo from "$lib/components/docs/base/main/seo.svelte";
	import { blocks } from "$blocks/blocks";
	import { components } from "$lib/registry/components";
	import {
		Divider,
		FaviconLink,
		H1,
		H2,
		Link,
		Paragraph,
		Step,
		Steps
	} from "$markdown";
	import Highlight from "$lib/components/ui/highlight/highlight.svelte";
	import { SingleFile } from "$lib/components/ui/code";
	import { PMCommand } from "$lib/components/ui/pm-command";

	const getURLPath = (url: string) => url.split("?")[0].split("#")[0];
	const tableAliasCode = {
		name: "svelte.config.ts",
		lang: "typescript" as const,
		hideLines: true,
		code: `kit: {
	alias: {
		'$table': 'src/lib/components/table'
	}
}`
	};

	let llmsTxtUrl = $derived(`${getURLPath(page.url.href)}/llms.txt`);
</script>

<Seo
	title="Installation & Setup"
	description="Set up a SvelteKit data table project with shadcn-svelte, TanStack Table v9, and reusable SV Table components."
	keywords={[
		"Svelte table installation",
		"SvelteKit data table setup",
		"Svelte 5 table components",
		"TanStack Table Svelte",
		"TanStack Table v9",
		"shadcn-svelte data table",
		"Svelte table pagination",
		"Svelte table filters",
		"Svelte faceted filter",
		"Svelte debounce search",
		"SvelteKit TypeScript table",
		"Tailwind CSS data table",
		"SV Table"
	]}
/>

<div class="space-y-10">
	<section>
		<div
			class="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-4"
		>
			<H1 id="installation">Installation &amp; Setup</H1>
			<CopyPageDropdown
				componentName="Installation & Setup"
				{llmsTxtUrl}
			/>
		</div>

		<div class="mt-3 max-w-2xl">
			<Paragraph>
				Prepare a new SvelteKit project for reusable data table
				components. This setup installs the UI foundation and table
				engine before you add the components your project needs.
			</Paragraph>
		</div>
	</section>

	<section class="max-w-3xl" aria-labelledby="setup-steps">
		<H2 id="setup-steps" class="sr-only">Setup steps</H2>
		<Steps>
			<Step title="Create a new SvelteKit project">
				<Paragraph class="mt-2 mb-4">
					Create a fresh SvelteKit app, then open the new project
					directory.
				</Paragraph>
				<PMCommand
					command="execute"
					args={["sv", "create", "my-app"]}
				/>
			</Step>

			<Step title="Add shadcn-svelte">
				<Paragraph class="mt-2 mb-4">
					Run the initializer from your SvelteKit project. It
					configures the component aliases, utilities, and styling
					used by the registry components.
				</Paragraph>
				<PMCommand
					command="execute"
					args={["shadcn-svelte@latest", "init"]}
				/>
			</Step>

			<Step title="Install TanStack Table">
				<Paragraph class="mt-2 mb-4">
					Add the headless table engine that manages table state,
					filtering, sorting, pagination, and row selection.
				</Paragraph>
				<PMCommand command="add" args={["@tanstack/svelte-table"]} />
				<Paragraph class="mt-3">
					Read the
					<FaviconLink
						href="https://tanstack.com/table/v9/docs/overview"
						target="_blank"
						rel="noreferrer"
						class="rounded-sm bg-amber-100/80 px-1 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300"
					>
						TanStack Table v9 overview
					</FaviconLink>
					for its core concepts and APIs.
				</Paragraph>
			</Step>

			<Step title="Add the table alias">
				<Paragraph class="mt-2 mb-4">
					Add the <code class="rounded bg-muted px-1.5 py-0.5 text-sm"
						>$table</code
					>
					alias inside
					<code class="rounded bg-muted px-1.5 py-0.5 text-sm"
						>svelte.config.ts</code
					> so table component imports stay short and consistent.
				</Paragraph>
				<SingleFile code={tableAliasCode} />
			</Step>

			<Step title="Install pagination">
				<Paragraph class="mt-2 mb-4">
					Start with the numbered pagination component. The installer
					also adds any shadcn-svelte dependencies it requires.
				</Paragraph>
				<PMCommand
					command="execute"
					args={[
						"shadcn-svelte@latest",
						"add",
						"https://sv-table.vercel.app/r/pagination.json"
					]}
				/>
			</Step>

			<Step title="Choose the components you need" class="pb-0">
				<Paragraph class="mt-2">
					Add only what your table needs, such as filters, debounced
					search, column controls, row selection, or export.
				</Paragraph>
			</Step>
		</Steps>
	</section>

	<section class="max-w-2xl">
		<Divider />
		<H2 id="whats-included">What’s included</H2>
		<Paragraph>
			SV Table includes <FaviconLink
				href="/components/filters"
				target="_blank"
				rel="noreferrer"
			>
				{components.length} Components
			</FaviconLink>
			and <FaviconLink href="/blocks" target="_blank" rel="noreferrer">
				{blocks.length} Blocks
			</FaviconLink>
			. Start with
			<Link href="/components/filters">Data Table Filters</Link> for advanced
			filtering, then add only the pieces your project needs.
		</Paragraph>
	</section>
</div>
