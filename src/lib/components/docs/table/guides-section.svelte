<script lang="ts">
	import { Badge } from "$lib/components/ui/spell/badge";
	import { SingleFile } from "$lib/components/ui/code";
	import { PreviewComponent } from "$lib/components/ui/preview-component";
	import { CodeSpan, H2, H3, Paragraph, Step, Steps } from "$markdown";
	import FiltersPreview from "./filters-preview.svelte";
	import SectionCallout from "./section-callout.svelte";
	import {
		columnShowcases,
		columnsConfigCode,
		controllerCode,
		filterBarCode,
		fullExampleCode,
		issueTypesCode,
		localeUsageCode,
		supportedLocales,
		tableRenderCode
	} from "./filters-doc-content";
</script>

<section class="space-y-6">
	<H2 id="guides">Guides</H2>

	<div class="space-y-4">
		<H3 id="columns" class="mt-0">Columns</H3>

		<div class="max-w-3xl space-y-3">
			<Paragraph>
				Start by defining your row model and then build a filter configuration for every field
				you want to expose in the toolbar. This keeps the UI labels, value accessors, and
				operator behavior tied to a single typed source of truth.
			</Paragraph>
		</div>

		<Steps>
			<Step title="Define the row shape">
				<p class="mb-4 text-sm leading-6 text-muted-foreground">
					Model the same data your table is going to render. Your column accessors should read
					from this type directly.
				</p>
				<SingleFile code={issueTypesCode} />
			</Step>

			<Step title="Create the helper and column config">
				<p class="mb-4 text-sm leading-6 text-muted-foreground">
					Build each filterable column with <CodeSpan>createColumnConfigHelper</CodeSpan>. Use
					static <CodeSpan>options</CodeSpan> for categorical columns when you already know the
					available values.
				</p>
				<SingleFile code={columnsConfigCode} />
			</Step>
		</Steps>

		<div class="grid gap-4 xl:grid-cols-2">
			{#each columnShowcases as column (column.id)}
				<article class="rounded-2xl border border-border/70 bg-card/70 p-5">
					<div class="flex flex-wrap items-center gap-2">
						<h4 class="text-base font-semibold tracking-tight">{column.title}</h4>
						<Badge variant="secondary">{column.accessorType}</Badge>
					</div>

					<p class="mt-3 text-sm leading-6 text-muted-foreground">{column.note}</p>

					<div class="mt-4 flex flex-wrap gap-2">
						{#each column.operators as operator (operator)}
							<Badge variant="outline">{operator}</Badge>
						{/each}
					</div>

					<div class="mt-4 grid gap-3 sm:grid-cols-2">
						<div>
							<p class="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
								Required
							</p>
							<ul class="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
								{#each column.required as item (item)}
									<li><CodeSpan>{item}</CodeSpan></li>
								{/each}
							</ul>
						</div>

						<div>
							<p class="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
								Optional
							</p>
							<ul class="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
								{#each column.optional as item (item)}
									<li><CodeSpan>{item}</CodeSpan></li>
								{/each}
							</ul>
						</div>
					</div>

					<div class="mt-4">
						<SingleFile code={column.code} />
					</div>
				</article>
			{/each}
		</div>
	</div>

	<div class="space-y-4">
		<H3 id="instance">Instance</H3>

		<div class="max-w-3xl space-y-3">
			<Paragraph>
				Once your config exists, create a filter controller, hand its state to
				<CodeSpan>DataTableFilter</CodeSpan>, and render the matching rows with
				<CodeSpan>ui/table</CodeSpan>.
			</Paragraph>
		</div>

		<Steps>
			<Step title="Create the filters controller">
				<p class="mb-4 text-sm leading-6 text-muted-foreground">
					<CodeSpan>createFilters</CodeSpan> returns the columns, live filters state, actions,
					and the active strategy for your table.
				</p>
				<SingleFile code={controllerCode} />
			</Step>

			<Step title="Mount the DataTableFilter component">
				<p class="mb-4 text-sm leading-6 text-muted-foreground">
					Pass the controller output straight into the filter bar. The UI is fully controlled by
					the live <CodeSpan>filters</CodeSpan> array and the action methods.
				</p>
				<SingleFile code={filterBarCode} />
			</Step>

			<Step title="Render your rows with ui/table">
				<p class="mb-4 text-sm leading-6 text-muted-foreground">
					The preview below uses the current filter state to derive <CodeSpan>filteredIssues</CodeSpan>
					and then renders those rows through the shared table primitives.
				</p>
				<SingleFile code={tableRenderCode} />
			</Step>
		</Steps>

		<SectionCallout title="Preview" badge="Live example" tone="emerald">
			<p>
				The live preview keeps everything on one page: column config, the filters controller,
				locale switching, and <CodeSpan>ui/table</CodeSpan> rendering. Use the filter bar to
				confirm the rows below react immediately.
			</p>
		</SectionCallout>

		<PreviewComponent code={fullExampleCode} showRetry={false} isCentered={false} class="min-h-0 p-5">
			<FiltersPreview />
		</PreviewComponent>
	</div>

	<div class="space-y-4">
		<H3 id="internationalization">Internationalization</H3>

		<div class="max-w-3xl space-y-3">
			<Paragraph>
				This repo already ships locale files and the expanded
				<CodeSpan>$lib/components/data-table/utils/i18n.ts</CodeSpan> helper. Pass a
				<CodeSpan>locale</CodeSpan> prop to <CodeSpan>DataTableFilter</CodeSpan> to swap operator
				labels, placeholders, and control text.
			</Paragraph>
		</div>

		<div class="flex flex-wrap gap-2">
			{#each supportedLocales as locale (locale)}
				<Badge variant={locale === "zh_CN" || locale === "zh_TW" ? "sky" : "secondary"}>
					{locale}
				</Badge>
			{/each}
		</div>

		<div class="grid gap-4 xl:grid-cols-[minmax(0,1fr),22rem]">
			<SingleFile code={localeUsageCode} />

			<SectionCallout title="Locale notes" badge="Included" tone="amber">
				<ul class="list-disc space-y-1 pl-5">
					<li><CodeSpan>en</CodeSpan> is the default installation.</li>
					<li><CodeSpan>zh_CN</CodeSpan> and <CodeSpan>zh_TW</CodeSpan> are both shipped.</li>
					<li>The live preview above includes an <CodeSpan>en</CodeSpan> / <CodeSpan>zh_CN</CodeSpan> toggle.</li>
				</ul>
			</SectionCallout>
		</div>
	</div>
</section>
