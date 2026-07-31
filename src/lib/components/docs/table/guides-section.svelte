<script lang="ts">
	import { SingleFile } from "$lib/components/ui/code";
	import { PreviewComponent } from "$lib/components/ui/preview-component";
	import { CodeSpan, H2, H3, Paragraph } from "$markdown";
	import FiltersPreview from "./filters-preview.svelte";
	import {
		columnsConfigCode,
		columnsHelperCode,
		componentCode,
		declaredOptionsCode,
		defaultFiltersCode,
		fullExampleCode,
		guideFileStructureCode,
		inferredOptionsCode,
		issueTypesCode,
		localeUsageCode,
		numberBoundariesCode,
		remoteOptionsCode,
		textColumnCode,
		controllerCode
	} from "./filters-doc-content";
	import SectionCallout from "./section-callout.svelte";
</script>

<section class="space-y-8">
	<H2 id="guides">Guides</H2>

	<div class="max-w-3xl space-y-3">
		<Paragraph>
			Build in this order: <CodeSpan>types.ts</CodeSpan>, then
			<CodeSpan>columns.ts</CodeSpan>, then a filter controller module,
			and finally a <CodeSpan>.svelte</CodeSpan> component that renders the
			UI and applies the filters.
		</Paragraph>
	</div>

	<div class="space-y-4">
		<H3 id="guide-structure" class="mt-0">Suggested structure</H3>
		<SingleFile code={guideFileStructureCode} />
	</div>

	<div class="space-y-4">
		<H3 id="guide-scenario">Reference scenario</H3>

		<div class="max-w-2xl">
			<Paragraph>
				We will use a small issue tracker model for the rest of the
				guide so each column example builds on the same row shape.
			</Paragraph>
		</div>

		<SingleFile code={issueTypesCode} />
	</div>

	<div class="space-y-5">
		<H3 id="columns">Columns</H3>

		<div class="max-w-3xl space-y-3">
			<Paragraph>
				The filter component needs its own column configuration because
				it does more than render cells. It needs a stable ID, a typed
				accessor, a display label, an icon, and enough metadata to
				decide how each filter should behave.
			</Paragraph>
		</div>

		<div class="space-y-3" data-toc-ignore="false">
			<h4 class="text-base font-semibold tracking-tight">
				1. Start with the helper
			</h4>
			<p class="text-sm leading-6 text-muted-foreground">
				Pass your row type into
				<CodeSpan>createColumnConfigHelper&lt;TData&gt;()</CodeSpan> once,
				then build every column from that helper.
			</p>
			<SingleFile code={columnsHelperCode} />
		</div>

		<div class="space-y-3" data-toc-ignore="false">
			<h4 class="text-base font-semibold tracking-tight">
				2. Build each column in order
			</h4>
			<p class="text-sm leading-6 text-muted-foreground">
				The safest order is:
				<CodeSpan
					>type -&gt; id -&gt; accessor -&gt; displayName -&gt; icon
					-&gt; build()</CodeSpan
				>.
			</p>
			<SingleFile code={textColumnCode} />
		</div>

		<div class="space-y-3" data-toc-ignore="false">
			<h4 class="text-base font-semibold tracking-tight">
				3. Use declared options for known values
			</h4>
			<p class="text-sm leading-6 text-muted-foreground">
				For <CodeSpan>option</CodeSpan> and
				<CodeSpan>multiOption</CodeSpan> columns with a fixed set of values,
				pass <CodeSpan>options()</CodeSpan> directly on the builder.
			</p>
			<SingleFile code={declaredOptionsCode} />
		</div>

		<div class="space-y-3" data-toc-ignore="false">
			<h4 class="text-base font-semibold tracking-tight">
				4. Use <CodeSpan>transformOptionFn()</CodeSpan> when values are richer
				than strings
			</h4>
			<p class="text-sm leading-6 text-muted-foreground">
				If your accessor returns objects instead of string IDs,
				transform each distinct value into a <CodeSpan
					>ColumnOption</CodeSpan
				>.
			</p>
			<SingleFile code={inferredOptionsCode} />
		</div>

		<div class="space-y-3" data-toc-ignore="false">
			<h4 class="text-base font-semibold tracking-tight">
				5. Add boundaries to number columns when you know them
			</h4>
			<p class="text-sm leading-6 text-muted-foreground">
				<CodeSpan>min()</CodeSpan> and <CodeSpan>max()</CodeSpan> control
				the visual range for number filters. They are especially important
				when you use the <CodeSpan>server</CodeSpan> strategy.
			</p>
			<SingleFile code={numberBoundariesCode} />
		</div>

		<div class="space-y-3" data-toc-ignore="false">
			<h4 class="text-base font-semibold tracking-tight">
				6. Export the final config as <CodeSpan>as const</CodeSpan>
			</h4>
			<p class="text-sm leading-6 text-muted-foreground">
				This preserves literal column IDs and keeps the rest of the API
				fully typed.
			</p>
			<SingleFile code={columnsConfigCode} />
		</div>
	</div>

	<div class="space-y-5">
		<H3 id="instance">Instance</H3>

		<div class="max-w-3xl space-y-3">
			<Paragraph>
				<CodeSpan>createFilters()</CodeSpan> creates the controller. It gives
				you the resolved columns, the current filters state, the mutating
				actions, and the active strategy.
			</Paragraph>
		</div>

		<div class="space-y-3" data-toc-ignore="false">
			<h4 class="text-base font-semibold tracking-tight">
				1. Create the controller
			</h4>
			<p class="text-sm leading-6 text-muted-foreground">
				For local filtering, pass the current rows and your column
				config.
			</p>
			<SingleFile code={controllerCode} />
		</div>

		<div class="space-y-3" data-toc-ignore="false">
			<h4 class="text-base font-semibold tracking-tight">
				2. Seed initial filters with <CodeSpan>defaultFilters</CodeSpan>
			</h4>
			<p class="text-sm leading-6 text-muted-foreground">
				Use this when the table should open with a predefined filter
				applied.
			</p>
			<SingleFile code={defaultFiltersCode} />
		</div>

		<div class="space-y-3" data-toc-ignore="false">
			<h4 class="text-base font-semibold tracking-tight">
				3. Pass remote options and faceted values for server mode
			</h4>
			<p class="text-sm leading-6 text-muted-foreground">
				When the server owns filtering, send declared options and counts
				into the controller so the menus still know what to render.
			</p>
			<SingleFile code={remoteOptionsCode} />
		</div>

		<SectionCallout title="State ownership" badge="Current API" tone="blue">
			The Svelte controller owns its filters state. Use
			<CodeSpan>defaultFilters</CodeSpan> for initial state, or pass
			<CodeSpan>filters</CodeSpan> when you want to seed the controller at creation
			time. There is no <CodeSpan>onFiltersChange</CodeSpan> controlled mode
			exposed here.
		</SectionCallout>
	</div>

	<div class="space-y-5">
		<H3 id="component">Component</H3>

		<div class="max-w-3xl space-y-3">
			<Paragraph>
				<CodeSpan>DataTableFilter</CodeSpan> renders the filter UI. Pair it
				with a derived list of rows for client-side filtering, or forward
				<CodeSpan>filterController.filters</CodeSpan> into your data-fetching
				layer for server-side filtering.
			</Paragraph>
		</div>

		<SingleFile code={componentCode} />

		<PreviewComponent
			code={fullExampleCode}
			showRetry={false}
			isCentered={false}
			class="min-h-0 p-5"
		>
			<FiltersPreview />
		</PreviewComponent>
	</div>

	<div class="space-y-4">
		<H3 id="internationalization">Internationalization</H3>

		<div class="max-w-2xl">
			<Paragraph>
				Pass a <CodeSpan>locale</CodeSpan> prop to switch the built-in text
				for search, operators, buttons, and placeholders.
			</Paragraph>
		</div>

		<SingleFile code={localeUsageCode} />
	</div>
</section>
