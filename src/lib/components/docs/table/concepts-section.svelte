<script lang="ts">
	import { SingleFile } from "$lib/components/ui/code";
	import { CodeSpan, H2, H3 } from "$markdown";
	import {
		columnOptionCode,
		columnTypeCode,
		configHelperCode,
		filterModelCode
	} from "./filters-doc-content";
</script>

<section class="space-y-5">
	<H2 id="concepts">Concepts</H2>

	<div class="space-y-4">
		<div class="space-y-2">
			<H3 id="strategy" class="text-base font-semibold tracking-tight"
				>Strategy</H3
			>
			<p class="text-sm leading-6 text-muted-foreground">
				Use <CodeSpan>client</CodeSpan> for local rows or <CodeSpan
					>server</CodeSpan
				> when the backend owns filtering.
			</p>
		</div>

		<div class="space-y-3">
			<H3
				id="column-data-types"
				class="text-base font-semibold tracking-tight"
			>
				Column data types
			</H3>
			<SingleFile code={columnTypeCode} />
		</div>

		<div class="space-y-3">
			<H3 id="filters" class="text-base font-semibold tracking-tight"
				>Filters</H3
			>
			<p class="text-sm leading-6 text-muted-foreground">
				Applied filters live inside <CodeSpan>FiltersState</CodeSpan>.
			</p>
			<SingleFile code={filterModelCode} />
		</div>

		<div class="space-y-3">
			<H3
				id="column-options"
				class="text-base font-semibold tracking-tight"
			>
				Column options
			</H3>
			<SingleFile code={columnOptionCode} />
		</div>

		<div class="space-y-3">
			<H3
				id="column-configure"
				class="text-base font-semibold tracking-tight"
			>
				Column configuration
			</H3>
			<p class="text-sm leading-6 text-muted-foreground">
				Use <CodeSpan>createColumnConfigHelper&lt;TData&gt;()</CodeSpan> to
				keep columns typed.
			</p>
			<SingleFile code={configHelperCode} />
		</div>

		<div class="space-y-2">
			<H3 id="instance" class="text-base font-semibold tracking-tight"
				>Instance</H3
			>
			<p class="text-sm leading-6 text-muted-foreground">
				<CodeSpan>createFilters()</CodeSpan> creates the filter controller.
			</p>
		</div>

		<div class="space-y-2">
			<H3 id="component" class="text-base font-semibold tracking-tight"
				>Component</H3
			>
			<p class="text-sm leading-6 text-muted-foreground">
				<CodeSpan>DataTableFilter</CodeSpan> renders the visual filter UI.
			</p>
		</div>
	</div>
</section>
