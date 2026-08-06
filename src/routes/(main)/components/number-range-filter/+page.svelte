<script lang="ts">
	import { page } from "$app/state";
	import ApiTable from "$lib/components/docs/base/api-table/api-table.svelte";
	import CopyPageDropdown from "$lib/components/docs/base/main/copy-page-dropdown.svelte";
	import InstallComponent from "$lib/components/docs/base/main/install-component.svelte";
	import Seo from "$lib/components/docs/base/main/seo.svelte";
	import { SingleFile } from "$lib/components/ui/code";
	import { PreviewComponent } from "$lib/components/ui/preview-component";
	import type { CodeBlock } from "$lib/types/code";
	import type { PropsTable } from "$lib/types/structure";
	import { CodeSpan, H1, H2, Paragraph, Step, Steps } from "$markdown";
	import NumberRangeFilterCode from "$table/number-range-filter/number-range-filter.svelte?raw";
	import NumberRangeFilterIndexCode from "$table/number-range-filter/index.ts?raw";
	import InputsOnlyPreview from "./examples/inputs-only-preview.svelte";
	import InputsOnlyPreviewCode from "./examples/inputs-only-preview.svelte?raw";
	import NumberRangeFilterPreview from "./examples/number-range-filter-preview.svelte";
	import NumberRangeFilterPreviewCode from "./examples/number-range-filter-preview.svelte?raw";

	const title = "Number Range Filter";
	const description =
		"A controlled number range picker with exact inputs, an optional slider, and explicit apply behavior.";

	const previewCode: CodeBlock = {
		name: "number-range-filter-preview.svelte",
		lang: "svelte",
		code: NumberRangeFilterPreviewCode
	};

	const inputsOnlyCode: CodeBlock = {
		name: "inputs-only-preview.svelte",
		lang: "svelte",
		code: InputsOnlyPreviewCode
	};

	const stateCode: CodeBlock = {
		name: "filters.svelte",
		lang: "svelte",
		code: `<script lang="ts">
  import NumberRangeFilter, {
    type NumberRangeFilterValue
  } from "$lib/components/table/number-range-filter";

  let range = $state<NumberRangeFilterValue | undefined>();
${"</" + "script>"}`
	};

	const renderCode: CodeBlock = {
		name: "filters.svelte",
		lang: "svelte",
		code: `<NumberRangeFilter
  bind:value={range}
  title="Price"
  min={0}
  max={5000}
  step={100}
/>`
	};

	const tableSetupCode: CodeBlock = {
		name: "table.svelte.ts",
		lang: "typescript",
		code: `import {
  columnFilteringFeature,
  createFilteredRowModel,
  filterFn_inNumberRange,
  tableFeatures
} from "@tanstack/svelte-table";

const features = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { inNumberRange: filterFn_inNumberRange }
});

const columns = [{
  accessorKey: "price",
  header: "Price",
  filterFn: "inNumberRange"
}];`
	};

	const connectCode: CodeBlock = {
		name: "filters.svelte",
		lang: "svelte",
		code: `<script lang="ts">
  const priceColumn = table.getColumn("price")!;

  function changeRange(value: NumberRangeFilterValue | undefined) {
    range = value;
    priceColumn.setFilterValue(
      value ? [value.min, value.max] : undefined
    );
  }
${"</" + "script>"}

<NumberRangeFilter
  value={range}
  onValueChange={changeRange}
  title="Price"
/>`
	};

	const folderStructure = [
		"src/",
		"`-- lib/",
		"    `-- components/",
		"        `-- table/",
		"            `-- number-range-filter/",
		"                |-- index.ts",
		"                `-- number-range-filter.svelte"
	].join("\n");

	const propsTable: PropsTable = {
		name: "Number range filter props",
		props: [
			{
				name: "value",
				type: "NumberRangeFilterValue | undefined",
				default: "undefined",
				description: "Bindable applied range."
			},
			{
				name: "onValueChange",
				type: "(value) => void",
				default: "undefined",
				description: "Called after Apply or Clear."
			},
			{
				name: "title",
				type: "string",
				default: '"Value"',
				description: "Trigger label."
			},
			{
				name: "placeholder",
				type: "string",
				default: '"Any value"',
				description: "Text shown without a range."
			},
			{
				name: "min",
				type: "number",
				default: "undefined",
				description: "Lowest allowed value."
			},
			{
				name: "max",
				type: "number",
				default: "undefined",
				description: "Highest allowed value."
			},
			{
				name: "step",
				type: "number",
				default: "1",
				description: "Input and slider increment."
			},
			{
				name: "showSlider",
				type: "boolean",
				default: "true",
				description: "Shows the slider when min and max exist."
			},
			{
				name: "formatValue",
				type: "(value: number) => string",
				default: "Intl.NumberFormat",
				description: "Formats displayed numbers."
			},
			{
				name: "locale",
				type: "string",
				default: '"en-US"',
				description: "Default number format locale."
			},
			{
				name: "minimumText / maximumText",
				type: "string",
				default: '"Minimum" / "Maximum"',
				description: "Input labels."
			},
			{
				name: "clearText / applyText",
				type: "string",
				default: '"Clear" / "Apply"',
				description: "Action labels."
			},
			{
				name: "disabled",
				type: "boolean",
				default: "false",
				description: "Disables the trigger."
			},
			{
				name: "open",
				type: "boolean",
				default: "false",
				description: "Bindable popover state."
			},
			{
				name: "class / contentClass",
				type: "string",
				default: "undefined",
				description: "Trigger and popover classes."
			}
		]
	};

	const valueTable: PropsTable = {
		name: "NumberRangeFilterValue",
		props: [
			{
				name: "min",
				type: "number | undefined",
				default: "required",
				required: true,
				description: "Inclusive lower value."
			},
			{
				name: "max",
				type: "number | undefined",
				default: "required",
				required: true,
				description: "Inclusive upper value."
			}
		]
	};

	const getURLPath = (url: string) => url.split("?")[0].split("#")[0];
	const installUrl = $derived(
		`${page.url.origin}/r/number-range-filter.json`
	);
	const llmsTxtUrl = $derived(`${getURLPath(page.url.href)}/llms.txt`);
</script>

<Seo
	{title}
	{description}
	keywords={[
		"number range filter",
		"range slider",
		"svelte table",
		"tanstack table"
	]}
/>

<div class="space-y-8 md:space-y-10">
	<section class="space-y-3">
		<div
			class="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-4"
		>
			<H1 id="number-range-filter">{title}</H1>
			<CopyPageDropdown componentName={title} {llmsTxtUrl} />
		</div>
		<div class="max-w-2xl">
			<Paragraph>{description}</Paragraph>
		</div>
	</section>

	<section>
		<PreviewComponent
			code={previewCode}
			frame
			isCentered={false}
			class="min-h-56 p-4 md:p-6"
		>
			<NumberRangeFilterPreview />
		</PreviewComponent>
	</section>

	<section>
		<H2 id="installation">Installation</H2>
		<InstallComponent
			{installUrl}
			packages={["@lucide/svelte"]}
			codeBlocks={[
				{
					name: "table/number-range-filter/number-range-filter.svelte",
					lang: "svelte",
					code: NumberRangeFilterCode,
					isExpand: true
				},
				{
					name: "table/number-range-filter/index.ts",
					lang: "typescript",
					code: NumberRangeFilterIndexCode
				}
			]}
			{folderStructure}
			class="mt-4"
		/>
	</section>

	<section class="space-y-3">
		<H2 id="guide">Step-by-step guide</H2>
		<Steps class="mt-6 mb-0">
			<Step title="Create the range state">
				<Paragraph
					>Import the value type and create optional state.</Paragraph
				>
				<div class="mt-3"><SingleFile code={stateCode} /></div>
			</Step>

			<Step title="Render the filter">
				<Paragraph>
					Set boundaries to enable the slider. The value changes after
					Apply.
				</Paragraph>
				<div class="mt-3"><SingleFile code={renderCode} /></div>
			</Step>

			<Step title="Register the table filter">
				<Paragraph>
					Use TanStack's inclusive
					<CodeSpan>filterFn_inNumberRange</CodeSpan> filter.
				</Paragraph>
				<div class="mt-3"><SingleFile code={tableSetupCode} /></div>
			</Step>

			<Step title="Connect the column" class="pb-0">
				<Paragraph
					>Send the applied range to the column as a tuple.</Paragraph
				>
				<div class="mt-3"><SingleFile code={connectCode} /></div>
			</Step>
		</Steps>
	</section>

	<section class="space-y-3">
		<H2 id="inputs-only">Inputs only</H2>
		<Paragraph>
			Hide the slider for exact input. Leave either field empty for an
			open-ended range.
		</Paragraph>
		<PreviewComponent
			code={inputsOnlyCode}
			frame
			isCentered={false}
			class="min-h-48 p-4 md:p-6"
		>
			<InputsOnlyPreview />
		</PreviewComponent>
	</section>

	<section class="space-y-3">
		<H2 id="behavior">Behavior</H2>
		<Paragraph>
			Typed values move the slider on blur or Enter. A committed slider
			change updates the inputs. Invalid or reversed ranges cannot be
			applied.
		</Paragraph>
	</section>

	<section>
		<H2 id="props">Props</H2>
		<div class="mt-3 space-y-6">
			<ApiTable data={propsTable} />
			<ApiTable data={valueTable} />
		</div>
	</section>
</div>
