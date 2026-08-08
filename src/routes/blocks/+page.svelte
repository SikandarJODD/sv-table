<script lang="ts">
	import BasicDataTable from "$blocks/examples/basic-data-table.svelte";
	import CustomFiltersExample from "$blocks/examples/custom-filters-example.svelte";
	import DataTableFiltersExample from "$blocks/examples/data-table-filters-example.svelte";
	import DndKitExample from "$blocks/examples/dnd-kit-example/dnd-kit-example.svelte";
	import DraggableExample from "$blocks/examples/draggable-example/draggable-example.svelte";
	import ExpandedSubRows from "$blocks/examples/expanded-sub-rows/expanded-sub-rows.svelte";
	import PinnableColumn from "$blocks/examples/pinnable-column.svelte";
	import ResizableSortExample from "$blocks/examples/resizable-sort-example.svelte";
	import RowSelection from "$blocks/examples/row-selection.svelte";
	import Seo from "$lib/components/docs/base/main/seo.svelte";

	const title = "Svelte Data Table Blocks";
	const description =
		"Explore reusable Svelte 5 and TanStack Table blocks for selection, filtering, sorting, resizing, dragging, and column pinning.";
</script>

<Seo
	{title}
	{description}
	keywords={[
		"Svelte data table",
		"Svelte table",
		"Svelte 5 table",
		"Svelte table components",
		"Svelte data grid",
		"TanStack Table Svelte",
		"TanStack Table v9",
		"data table blocks",
		"reusable table components",
		"responsive data table",
		"accessible data table",
		"headless data table",
		"table row selection",
		"table filtering",
		"custom table filters",
		"faceted table filters",
		"sortable table columns",
		"resizable table columns",
		"draggable table columns",
		"pinnable table columns",
		"SvelteKit data table",
		"TypeScript data table",
		"Tailwind CSS table",
		"Svelte UI blocks",
		"data table examples",
		"sv table"
	]}
/>

<div class="mb-88 space-y-12">
	<header class="max-w-3xl space-y-2">
		<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
		<p class="text-base text-muted-foreground sm:text-lg">{description}</p>
	</header>

	<section class="space-y-4">
		<h2
			id="basic-data-table"
			class="scroll-mt-20 text-2xl font-semibold tracking-tight"
		>
			Basic Data Table
		</h2>
		<BasicDataTable />
	</section>

	<section class="space-y-4">
		<h2
			id="row-selection"
			class="scroll-mt-20 text-2xl font-semibold tracking-tight"
		>
			Row Selection
		</h2>
		<RowSelection />
	</section>

	<section class="space-y-4">
		<h2
			id="data-table-with-filters"
			class="scroll-mt-20 text-2xl font-semibold tracking-tight"
		>
			Data Table with Filters
		</h2>
		<DataTableFiltersExample />
	</section>

	<section class="space-y-4">
		<h2
			id="data-table-with-custom-filters"
			class="scroll-mt-20 text-2xl font-semibold tracking-tight"
		>
			Data Table with Custom Filters
		</h2>
		<CustomFiltersExample />
	</section>

	<section class="space-y-4">
		<h2
			id="resizable-sortable-columns"
			class="scroll-mt-20 text-2xl font-semibold tracking-tight"
		>
			Resizable &amp; Sortable Columns
		</h2>
		<ResizableSortExample />
	</section>

	<section class="space-y-4">
		<h2
			id="pinnable-columns"
			class="scroll-mt-20 text-2xl font-semibold tracking-tight"
		>
			Pinnable Columns
		</h2>
		<PinnableColumn />
	</section>

	<section class="space-y-4">
		<h2
			id="draggable-columns"
			class="scroll-mt-20 text-2xl font-semibold tracking-tight"
		>
			Draggable Columns
		</h2>
		<DraggableExample />
	</section>

	<section class="space-y-4">
		<h2
			id="expandable-sub-rows"
			class="scroll-mt-20 text-2xl font-semibold tracking-tight"
		>
			Expandable Sub Rows
		</h2>
		<ExpandedSubRows />
	</section>

	<!-- <section class="space-y-4">
		<h2
			id="dnd-kit-draggable-columns"
			class="scroll-mt-20 text-2xl font-semibold tracking-tight"
		>
			dnd kit Draggable Columns
		</h2>
		<DndKitExample />
	</section> -->
</div>
