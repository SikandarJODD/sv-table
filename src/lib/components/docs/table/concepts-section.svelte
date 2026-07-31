<script lang="ts">
	import { Badge } from "$lib/components/ui/spell/badge";
	import { SingleFile } from "$lib/components/ui/code";
	import { CodeSpan, H2, Paragraph } from "$markdown";
	import {
		columnOptionCode,
		columnTypeCode,
		configHelperCode,
		filterModelCode
	} from "./filters-doc-content";
</script>

<section class="space-y-5">
	<H2 id="concepts">Concepts</H2>

	<div class="grid gap-4 lg:grid-cols-2">
		<div class="rounded-2xl border border-border/70 bg-card/70 p-5">
			<div class="flex items-center gap-2">
				<h4 class="text-base font-semibold tracking-tight">FilterStrategy</h4>
				<Badge variant="blue">client</Badge>
				<Badge variant="amber">server</Badge>
			</div>
			<p class="mt-3 text-sm leading-6 text-muted-foreground">
				Choose where filtering happens. <CodeSpan>client</CodeSpan> keeps every row in the
				browser and applies filters locally. <CodeSpan>server</CodeSpan> keeps the UI state on
				the client but lets your backend own the result set and counts.
			</p>
		</div>

		<div class="rounded-2xl border border-border/70 bg-card/70 p-5">
			<h4 class="text-base font-semibold tracking-tight">Column configuration</h4>
			<p class="mt-3 text-sm leading-6 text-muted-foreground">
				Each filterable field is described as a column configuration. The config tells the
				filter bar how to read the row value, how to label it in the UI, which operators are
				valid, and which option values are selectable.
			</p>
		</div>
	</div>

	<div class="grid gap-5 xl:grid-cols-2">
		<div class="space-y-3">
			<div>
				<h4 class="text-base font-semibold tracking-tight">Supported ColumnDataType values</h4>
				<Paragraph class="mt-2">
					The component currently supports five column kinds. The type controls both the editor
					UI and the operator set available for that column.
				</Paragraph>
			</div>
			<SingleFile code={columnTypeCode} />
		</div>

		<div class="space-y-3">
			<div>
				<h4 class="text-base font-semibold tracking-tight">FiltersState and FilterModel</h4>
				<Paragraph class="mt-2">
					The applied filters are stored as an array of models. Each model identifies a column,
					its data type, the selected operator, and one or more typed values.
				</Paragraph>
			</div>
			<SingleFile code={filterModelCode} />
		</div>

		<div class="space-y-3">
			<div>
				<h4 class="text-base font-semibold tracking-tight">ColumnOption</h4>
				<Paragraph class="mt-2">
					Option-based columns normalize values into a shared label/value shape. That keeps the
					filter UI and counts consistent even when your raw data source is more complex.
				</Paragraph>
			</div>
			<SingleFile code={columnOptionCode} />
		</div>

		<div class="space-y-3">
			<div>
				<h4 class="text-base font-semibold tracking-tight">Builder helper</h4>
				<Paragraph class="mt-2">
					Use <CodeSpan>createColumnConfigHelper&lt;TData&gt;()</CodeSpan> once, then derive each
					filterable column with a fluent builder that stays tied to your row type.
				</Paragraph>
			</div>
			<SingleFile code={configHelperCode} />
		</div>
	</div>
</section>
