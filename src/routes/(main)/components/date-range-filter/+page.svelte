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
	import FileCodeIcon from "@lucide/svelte/icons/file-code";
	import {
		Blockquote,
		CodeSpan,
		H1,
		H2,
		Paragraph,
		Step,
		Steps
	} from "$markdown";
	import DateRangeFilterCode from "$table/date-range-filter/date-range-filter.svelte?raw";
	import DateRangeFilterIndexCode from "$table/date-range-filter/index.ts?raw";
	import CalendarOnlyPreview from "./examples/calendar-only-preview.svelte";
	import CalendarOnlyPreviewCode from "./examples/calendar-only-preview.svelte?raw";
	import CustomPresetsPreview from "./examples/custom-presets-preview.svelte";
	import CustomPresetsPreviewCode from "./examples/custom-presets-preview.svelte?raw";
	import DateRangeFilterPreview from "./examples/date-range-filter-preview.svelte";
	import DateRangeFilterPreviewCode from "./examples/date-range-filter-preview.svelte?raw";

	const title = "Date Range Filter";
	const description =
		"A controlled date-range picker with responsive calendars, quick presets, and explicit clear and apply actions.";

	const previewCode: CodeBlock = {
		name: "date-range-filter-preview.svelte",
		lang: "svelte",
		code: DateRangeFilterPreviewCode,
		highlight: [
			[2, 4],
			[6, 9],
			[23, 29]
		]
	};

	const stateCode: CodeBlock = {
		name: "filters.svelte",
		lang: "svelte",
		code: `<script lang="ts">
  import DateRangeFilter, {
    type DateRangeFilterValue
  } from "$lib/components/table/date-range-filter";

  let range = $state<DateRangeFilterValue | undefined>();
${"</" + "script>"}`,
		highlight: [
			[2, 4],
			[6, 6]
		]
	};

	const renderCode: CodeBlock = {
		name: "filters.svelte",
		lang: "svelte",
		code: `<DateRangeFilter
  bind:value={range}
  title="Created"
/>`,
		highlight: [[1, 4]]
	};

	const tableSetupCode: CodeBlock = {
		name: "table.svelte.ts",
		lang: "typescript",
		code: `import {
  columnFilteringFeature,
  createFilteredRowModel,
  filterFn_inDateRange,
  tableFeatures
} from "@tanstack/svelte-table";

const features = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { inDateRange: filterFn_inDateRange }
});

const columns = [
  {
    accessorKey: "createdAt",
    header: "Created",
    filterFn: "inDateRange"
  }
];`,
		highlight: [
			[2, 5],
			[8, 12],
			[15, 19]
		]
	};

	const connectCode: CodeBlock = {
		name: "filters.svelte",
		lang: "svelte",
		code: `<script lang="ts">
  const createdColumn = table.getColumn("createdAt")!;

  function changeRange(value: DateRangeFilterValue | undefined) {
    range = value;
    createdColumn.setFilterValue(
      value ? [value.start, value.end] : undefined
    );
  }
${"</" + "script>"}

<DateRangeFilter
  value={range}
  onValueChange={changeRange}
  title="Created"
/>`,
		highlight: [
			[2, 2],
			[4, 9],
			[12, 16]
		]
	};

	const customPresetsCode: CodeBlock = {
		name: "custom-presets-preview.svelte",
		lang: "svelte",
		code: CustomPresetsPreviewCode,
		highlight: [
			[2, 5],
			[11, 36],
			[54, 59]
		]
	};

	const calendarOnlyCode: CodeBlock = {
		name: "calendar-only-preview.svelte",
		lang: "svelte",
		code: CalendarOnlyPreviewCode,
		highlight: [
			[2, 4],
			[6, 9],
			[13, 22]
		]
	};

	// const folderStructure = [
	// 	"src/",
	// 	"`-- lib/",
	// 	"    `-- components/",
	// 	"        `-- table/",
	// 	"            `-- date-range-filter/",
	// 	"                |-- index.ts",
	// 	"                `-- date-range-filter.svelte"
	// ].join("\n");

	const folderStructure = `src/
└── lib/
    └── components/
        └── table/
            └── date-range-filter/
                ├── date-range-filter.svelte
                └── index.ts`;

	const propsTable: PropsTable = {
		name: "Date range filter props",
		props: [
			{
				name: "value",
				type: "DateRangeFilterValue | undefined",
				default: "undefined",
				description:
					"Bindable applied range. Draft calendar changes do not update it until Apply."
			},
			{
				name: "onValueChange",
				type: "(value) => void",
				default: "undefined",
				description: "Called when a range is applied or cleared."
			},
			{
				name: "title",
				type: "string",
				default: '"Date"',
				description: "Filter name displayed in the trigger."
			},
			{
				name: "placeholder",
				type: "string",
				default: '"Select date range"',
				description: "Trigger text shown before a range is applied."
			},
			{
				name: "presets",
				type: "DateRangeFilterPreset[] | false",
				default: "default presets",
				description:
					"Preset choices, or false to render the calendar without presets."
			},
			{
				name: "min",
				type: "Date",
				default: "undefined",
				description: "Earliest selectable date."
			},
			{
				name: "max",
				type: "Date",
				default: "undefined",
				description: "Latest selectable date."
			},
			{
				name: "numberOfMonths",
				type: "number",
				default: "2",
				description:
					"Months displayed on desktop. Mobile always displays one."
			},
			{
				name: "weekStartsOn",
				type: "0 | 1 | 2 | 3 | 4 | 5 | 6",
				default: "0",
				description: "First day of the calendar week."
			},
			{
				name: "locale",
				type: "string",
				default: '"en-US"',
				description: "Locale for calendar labels and date formatting."
			},
			{
				name: "clearText",
				type: "string",
				default: '"Clear"',
				description: "Clear action label."
			},
			{
				name: "applyText",
				type: "string",
				default: '"Apply"',
				description: "Apply action label."
			},
			{
				name: "disabled",
				type: "boolean",
				default: "false",
				description: "Disables the filter trigger."
			},
			{
				name: "open",
				type: "boolean",
				default: "false",
				description: "Bindable popover open state."
			},
			{
				name: "class",
				type: "string",
				default: "undefined",
				description: "Classes applied to the trigger button."
			},
			{
				name: "contentClass",
				type: "string",
				default: "undefined",
				description: "Classes applied to the popover content."
			}
		]
	};

	const valueTable: PropsTable = {
		name: "DateRangeFilterValue",
		props: [
			{
				name: "start",
				type: "Date | undefined",
				default: "required",
				required: true,
				description: "Inclusive start date at local midnight."
			},
			{
				name: "end",
				type: "Date | undefined",
				default: "required",
				required: true,
				description: "Inclusive end date at local midnight."
			}
		]
	};

	const presetTable: PropsTable = {
		name: "DateRangeFilterPreset",
		props: [
			{
				name: "label",
				type: "string",
				default: "required",
				required: true,
				description: "Preset button label."
			},
			{
				name: "getValue",
				type: "(referenceDate: Date) => DateRangeFilterValue",
				default: "required",
				required: true,
				description:
					"Builds the preset range from the current local date."
			}
		]
	};

	const getURLPath = (url: string) => url.split("?")[0].split("#")[0];
	const installUrl = $derived(`${page.url.origin}/r/date-range-filter.json`);
	const llmsTxtUrl = $derived(`${getURLPath(page.url.href)}/llms.txt`);
</script>

<Seo
	{title}
	{description}
	keywords={[
		"date range filter",
		"date picker",
		"svelte table",
		"tanstack table",
		"calendar filter"
	]}
/>

<div class="space-y-8 md:space-y-10">
	<section class="space-y-3">
		<div
			class="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-4"
		>
			<H1 id="date-range-filter">{title}</H1>
			<CopyPageDropdown componentName={title} {llmsTxtUrl} />
		</div>

		<div class="max-w-2xl">
			<Paragraph>{description}</Paragraph>
			<Paragraph>
				Calendar and preset selections stay in a draft until Apply is
				pressed, preventing partial ranges from repeatedly filtering a
				table.
			</Paragraph>
		</div>
	</section>

	<section>
		<PreviewComponent
			code={previewCode}
			frame
			isCentered={false}
			class="min-h-72 p-4 md:p-6"
		>
			<DateRangeFilterPreview />
		</PreviewComponent>

		<Blockquote
			class="mt-4 rounded-sm border-dashed border-amber-400/70 bg-amber-50/50 text-amber-950/80 not-italic shadow-none dark:border-amber-500/40 dark:bg-amber-950/20 dark:text-amber-100/80"
		>
			<div
				class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"
			>
				<p>
					If selected dates lose contrast on hover, update both
					endpoint classes:
				</p>
				<span
					class="inline-flex shrink-0 items-center gap-1 self-start rounded-sm border border-amber-400/40 bg-amber-100/60 px-1.5 py-1 font-mono text-[11px] leading-none sm:self-auto dark:border-amber-500/30 dark:bg-amber-900/30"
				>
					<FileCodeIcon class="size-3" />
					range-calendar-day.svelte
				</span>
			</div>
			<span class="mt-2 flex flex-wrap items-center gap-2">
				<s class="decoration-amber-700/70 decoration-2">
					<CodeSpan>hover:text-foreground</CodeSpan>
				</s>
				<span aria-hidden="true">→</span>
				<CodeSpan>hover:text-primary-foreground</CodeSpan>
			</span>
		</Blockquote>
	</section>

	<section>
		<H2 id="installation">Installation</H2>
		<InstallComponent
			{installUrl}
			packages={["@lucide/svelte", "@internationalized/date"]}
			codeBlocks={[
				{
					name: "table/date-range-filter/date-range-filter.svelte",
					lang: "svelte",
					code: DateRangeFilterCode,
					isExpand: true
				},
				{
					name: "table/date-range-filter/index.ts",
					lang: "typescript",
					code: DateRangeFilterIndexCode
				}
			]}
			{folderStructure}
			class="mt-4"
		/>
	</section>

	<section class="space-y-3">
		<H2 id="guide">Step-by-step guide</H2>
		<Paragraph>
			The component is controlled and table-agnostic. Start with local
			state, then connect that state to a table column only when needed.
		</Paragraph>

		<Steps class="mt-6 mb-0">
			<Step title="Create the range state">
				<Paragraph>
					Import the component value type and initialize an optional
					range.
				</Paragraph>
				<div class="mt-3">
					<SingleFile code={stateCode} />
				</div>
			</Step>

			<Step title="Render the controlled filter">
				<Paragraph>
					Bind the value for the shortest setup. It changes only after
					Apply or Clear.
				</Paragraph>
				<div class="mt-3">
					<SingleFile code={renderCode} />
				</div>
			</Step>

			<Step title="Register TanStack's date filter">
				<Paragraph>
					For a table column, enable filtering and register
					<CodeSpan>filterFn_inDateRange</CodeSpan>. Both endpoints
					are inclusive.
				</Paragraph>
				<div class="mt-3">
					<SingleFile code={tableSetupCode} />
				</div>
			</Step>

			<Step title="Send the applied range to the column" class="pb-0">
				<Paragraph>
					Translate the component's named range into the
					<CodeSpan>[start, end]</CodeSpan> tuple expected by the table
					filter.
				</Paragraph>
				<div class="mt-3">
					<SingleFile code={connectCode} />
				</div>
			</Step>
		</Steps>
	</section>

	<section class="space-y-3">
		<H2 id="custom-presets">Custom presets</H2>
		<Paragraph>
			Replace the built-in choices with domain-specific ranges. Each
			preset receives the current local date when selected, so relative
			ranges do not become stale.
		</Paragraph>
		<PreviewComponent
			code={customPresetsCode}
			frame
			isCentered={false}
			class="min-h-48 p-4 md:p-6"
		>
			<CustomPresetsPreview />
		</PreviewComponent>
	</section>

	<section class="space-y-3">
		<H2 id="calendar-only">Calendar only and date limits</H2>
		<Paragraph>
			Pass <CodeSpan>{"presets={false}"}</CodeSpan> for a focused calendar.
			This example also limits the selectable dates, starts weeks on Monday,
			and uses British English date formatting.
		</Paragraph>
		<PreviewComponent
			code={calendarOnlyCode}
			frame
			isCentered={false}
			class="min-h-48 p-4 md:p-6"
		>
			<CalendarOnlyPreview />
		</PreviewComponent>
	</section>

	<section class="space-y-3">
		<H2 id="behavior">Behavior</H2>
		<Paragraph>
			The default presets are Today, Last 7 days, Last 30 days, and This
			month. An applied range can be removed directly from the clear
			button beside the trigger. Dates are returned at local midnight. Two
			months appear on desktop and the component switches to one month
			below the mobile breakpoint. <CodeSpan>min</CodeSpan> and
			<CodeSpan>max</CodeSpan> constrain the calendar and disable presets outside
			those boundaries.
		</Paragraph>
	</section>

	<section class="space-y-3">
		<H2 id="accessibility">Accessibility</H2>
		<Paragraph>
			The trigger announces the applied range and the adjacent clear
			control has a filter-specific accessible label. The popover restores
			focus on close, while the range calendar provides keyboard day
			navigation, month controls, selected-range semantics, and localized
			labels.
		</Paragraph>
	</section>

	<section>
		<H2 id="props">Props</H2>
		<div class="mt-3 space-y-6">
			<ApiTable data={propsTable} />
			<ApiTable data={valueTable} />
			<ApiTable data={presetTable} />
		</div>
	</section>
</div>
