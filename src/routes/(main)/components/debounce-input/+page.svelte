<script lang="ts">
	import { page } from "$app/state";
	import ApiTable from "$lib/components/docs/base/api-table/api-table.svelte";
	import CopyPageDropdown from "$lib/components/docs/base/main/copy-page-dropdown.svelte";
	import InstallComponent from "$lib/components/docs/base/main/install-component.svelte";
	import Seo from "$lib/components/docs/base/main/seo.svelte";
	import { SingleFile } from "$lib/components/ui/code";
	import { PreviewComponent } from "$lib/components/ui/preview-component";
	import DebounceInputCode from "$lib/components/table/debounce-input/debounce-input.svelte?raw";
	import DebounceInputIndexCode from "$lib/components/table/debounce-input/index.ts?raw";
	import type { CodeBlock } from "$lib/types/code";
	import type { PropsTable } from "$lib/types/structure";
	import { CodeSpan, H1, H2, Paragraph } from "$markdown";
	import DebounceInputPreview from "./examples/debounce-input-preview.svelte";
	import DebounceInputPreviewCode from "./examples/debounce-input-preview.svelte?raw";

	const title = "Debounce Input";
	const description =
		"A search input that delays value changes until typing pauses.";

	const previewCode: CodeBlock = {
		name: "debounce-input-preview.svelte",
		lang: "svelte",
		code: DebounceInputPreviewCode
	};

	const usageCode: CodeBlock = {
		name: "usage.svelte",
		lang: "svelte",
		code: `<script lang="ts">
  import DebounceInput from "$lib/components/table/debounce-input";

  let value = $state("");
${"</" + "script>"}

<DebounceInput
  bind:value
  placeholder="Search tables..."
  onChange={(value) => console.log(value)}
/>`
	};

	const folderStructure = [
		"src/",
		"`-- lib/",
		"    `-- components/",
		"        `-- table/",
		"            `-- debounce-input/",
		"                |-- index.ts",
		"                `-- debounce-input.svelte"
	].join("\n");

	const propsTable: PropsTable = {
		name: "Debounce input props",
		props: [
			{
				name: "value",
				type: "string",
				default: '\"\"',
				description:
					"The controlled value, updated after the debounce delay."
			},
			{
				name: "onChange",
				type: "(value: string) => void",
				default: "undefined",
				description: "Called with the value after the debounce delay."
			},
			{
				name: "class",
				type: "string",
				default: "undefined",
				description: "Optional classes for the root input group."
			},
			{
				name: "placeholder",
				type: "string",
				default: '\"Search...\"',
				description: "Placeholder text for the input."
			},
			{
				name: "debounce",
				type: "number",
				default: "500",
				description:
					"Delay in milliseconds before updating value and calling onChange."
			}
		]
	};

	const getURLPath = (url: string) => url.split("?")[0].split("#")[0];
	const installUrl = $derived(`${page.url.origin}/r/debounce-input.json`);
	const llmsTxtUrl = $derived(`${getURLPath(page.url.href)}/llms.txt`);
</script>

<Seo
	{title}
	{description}
	keywords={["debounce input", "search input", "svelte", "runed"]}
/>

<div class="space-y-8 md:space-y-10">
	<section class="space-y-3">
		<div
			class="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-4"
		>
			<H1 id="debounce-input">{title}</H1>
			<CopyPageDropdown componentName={title} {llmsTxtUrl} />
		</div>

		<div class="max-w-2xl">
			<Paragraph>{description}</Paragraph>
			<!-- <Paragraph>
				The <CodeSpan>value</CodeSpan> binding and
				<CodeSpan>onChange</CodeSpan> callback update after the configured
				delay.
			</Paragraph> -->
		</div>
	</section>

	<section>
		<PreviewComponent code={previewCode} frame>
			<DebounceInputPreview />
		</PreviewComponent>
	</section>

	<section>
		<H2 id="installation">Installation</H2>
		<InstallComponent
			{installUrl}
			codeBlocks={[
				{
					name: "table/debounce-input/debounce-input.svelte",
					lang: "svelte",
					code: DebounceInputCode,
					isExpand: true
				},
				{
					name: "table/debounce-input/index.ts",
					lang: "typescript",
					code: DebounceInputIndexCode
				}
			]}
			{folderStructure}
			class="mt-4"
		/>
	</section>

	<section class="space-y-3">
		<H2 id="usage">Usage</H2>
		<Paragraph>
			Use <CodeSpan>bind:value</CodeSpan> for controlled state or handle the
			debounced value with <CodeSpan>onChange</CodeSpan>.
		</Paragraph>
		<SingleFile code={usageCode} />
	</section>

	<section class="space-y-3">
		<H2 id="notes">Notes</H2>
		<Paragraph>
			Set <CodeSpan>{"debounce={0}"}</CodeSpan> for instant updates.
		</Paragraph>

		<ul
			class="ml-5 max-w-2xl list-disc space-y-2 text-sm leading-7 text-muted-foreground"
		>
			<li>
				The visible input responds immediately while
				<CodeSpan>value</CodeSpan> and <CodeSpan>onChange</CodeSpan> wait
				for the debounce delay.
			</li>
			<li>
				The clear button uses the same delay as typing, keeping search
				and filter updates consistent.
			</li>
		</ul>
	</section>

	<section>
		<H2 id="props">Props</H2>
		<div class="mt-3">
			<ApiTable data={propsTable} />
		</div>
	</section>
</div>
