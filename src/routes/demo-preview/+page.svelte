<script lang="ts">
	import { TextMorph } from "torph/svelte";
	import type { Component } from "svelte";
	import { PressedKeys } from "runed";

	import FaviconLink from "$lib/components/docs/markdown/favicon-link.svelte";
	import BlocksIcon from "$lib/components/icons/blocks-icon.svelte";
	import BasicDataTable from "$lib/components/blocks/examples/basic-data-table.svelte";
	import ComplexExample from "$lib/components/blocks/examples/complex-example/complex-example.svelte";
	import CustomFiltersExample from "$lib/components/blocks/examples/custom-filters-example.svelte";
	import DataTableFiltersExample from "$lib/components/blocks/examples/data-table-filters-example.svelte";
	import DndKitExample from "$lib/components/blocks/examples/dnd-kit-example/dnd-kit-example.svelte";
	import DraggableExample from "$lib/components/blocks/examples/draggable-example/draggable-example.svelte";
	import ExpandedSubRows from "$lib/components/blocks/examples/expanded-sub-rows/expanded-sub-rows.svelte";
	import NumericPaginationExample from "$lib/components/blocks/examples/numeric-pagination-example.svelte";
	import PaginatedExample from "$lib/components/blocks/examples/paginated-example.svelte";
	import PinnableColumn from "$lib/components/blocks/examples/pinnable-column.svelte";
	import ResizableSortExample from "$lib/components/blocks/examples/resizable-sort-example.svelte";
	import RowSelection from "$lib/components/blocks/examples/row-selection.svelte";
	import { Button } from "$lib/components/ui/button";

	type Example = {
		name: string;
		component: Component;
	};

	const examples: Example[] = [
		{ name: "Basic Data Table", component: BasicDataTable },
		{ name: "Row Selection", component: RowSelection },
		{ name: "Data Table with Filters", component: DataTableFiltersExample },
		{
			name: "Data Table with Custom Filters",
			component: CustomFiltersExample
		},
		{
			name: "Resizable & Sortable Columns",
			component: ResizableSortExample
		},
		{ name: "Pinnable Columns", component: PinnableColumn },
		{ name: "Draggable Columns", component: DraggableExample },
		// { name: "Draggable Columns — DnD Kit", component: DndKitExample },
		{ name: "Expandable Sub Rows", component: ExpandedSubRows },
		{ name: "Paginated Table", component: PaginatedExample },
		{ name: "Numeric Pagination", component: NumericPaginationExample },
		{ name: "Complex Table", component: ComplexExample }
	];

	let currentIndex = $state(0);
	let currentExample = $derived(examples[currentIndex] ?? examples[0]);

	function previous() {
		currentIndex = (currentIndex - 1 + examples.length) % examples.length;
	}

	function next() {
		currentIndex = (currentIndex + 1) % examples.length;
	}

	const pressedKeys = new PressedKeys();
	pressedKeys.onKeys("arrowleft", previous);
	pressedKeys.onKeys("arrowright", next);
</script>

<svelte:head>
	<title>{currentExample.name} — Demo Preview</title>
</svelte:head>

<main
	class="demo-preview relative flex min-h-svh items-center justify-center overflow-hidden bg-background"
>
	<div class="corner-mark corner-mark--top-left" aria-hidden="true"></div>
	<div class="corner-mark corner-mark--top-right" aria-hidden="true"></div>
	<div class="corner-mark corner-mark--bottom-left" aria-hidden="true"></div>
	<div class="corner-mark corner-mark--bottom-right" aria-hidden="true"></div>

	<section class="w-full max-w-6xl px-20 py-24" aria-live="polite">
		<div class="mb-4 flex items-center justify-between">
			<h3
				class="font-mono text-2xl font-semibold tracking-tight text-ink"
			>
				Svelte Data Table Blocks
			</h3>
			<div>
				<Button
					variant="outline"
					class="rounded-none border-dashed border-ink/50 bg-blue-50/60 text-ink"
					>11 Blocks</Button
				>
			</div>
		</div>
		<div class="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2">
			{#each examples as item}
				<div
					class="flex items-center justify-between rounded-sm border border-dashed bg-mauve-50/50 p-2"
				>
					<div class="flex items-center gap-1.5">
						<BlocksIcon
							class="size-3.5 shrink-0 text-muted-foreground"
						/>
						<h1 class="font-mono text-sm tracking-tight">
							{item.name}
						</h1>
					</div>
					<!-- <div
						class="z-10 font-mono text-xs tracking-tight text-muted-foreground/70"
					>
						Built by <span class="text-primary">Bhide Svelte</span>
					</div> -->
				</div>
			{/each}
		</div>

		<!-- <div class="min-h-130">
			{#key currentExample.name}
				{@const Preview = currentExample.component}
				<Preview />
			{/key}
		</div> -->
	</section>

	<div class="absolute top-46 left-58 flex -rotate-20 items-center">
		<img
			src="https://cdn.reicon.dev/describe-table.svg"
			alt="describe table"
			width="80"
			height="80"
			class="opacity-15 transition-opacity group-hover:opacity-100"
		/>
	</div>
	<div class="absolute right-70 bottom-50 flex rotate-20 items-center">
		<img
			src="https://cdn.reicon.dev/raw-results-table.svg"
			alt="raw results table"
			width="80"
			height="80"
			class="opacity-15 transition-opacity group-hover:opacity-100"
		/>
	</div>
	<div class="absolute bottom-46 left-68 flex rotate-12 items-center">
		<img
			src="https://cdn.reicon.dev/terminal-table.svg"
			alt="terminal table"
			width="80"
			height="80"
			class="opacity-15 transition-opacity group-hover:opacity-100"
		/>
	</div>
	<div class="absolute top-45 right-50 flex -rotate-16 items-center">
		<img
			src="https://cdn.reicon.dev/view-as-window-onto.svg"
			alt="view as window onto"
			width="80"
			height="80"
			class="opacity-15 transition-opacity group-hover:opacity-100"
		/>
	</div>

	<!-- <p class="z-10 flex items-center text-base text-muted-foreground/60">
		<span>Built by</span>
		<FaviconLink
			href="https://bhide.dev"
			target="_blank"
			rel="noreferrer"
			class="mr-0 rounded-xl bg-linear-to-r from-amber-100 to-white pr-1 font-mono text-sm text-amber-600 transition-none"
			imageClass=" rounded-full border border-amber-400 size-5"
		>
			Bhide Svelte
		</FaviconLink>
	</p> -->
</main>

<style>
	:global(body:has(.demo-preview) > div > header) {
		display: none;
	}

	:global(body:has(.demo-preview)) {
		overflow: hidden;
	}

	.corner-mark {
		position: absolute;
		z-index: 10;
		width: 6rem;
		height: 6rem;
		pointer-events: none;
	}

	.corner-mark::before,
	.corner-mark::after {
		position: absolute;
		content: "";
		border-color: color-mix(in oklab, var(--foreground) 28%, transparent);
	}

	.corner-mark::before {
		width: 6rem;
		border-top-width: 1px;
		border-top-style: dashed;
	}

	.corner-mark::after {
		height: 6rem;
		border-left-width: 1px;
		border-left-style: dashed;
	}

	.corner-mark--top-left {
		top: 2.5rem;
		left: 2.5rem;
	}

	.corner-mark--top-right {
		top: 2.5rem;
		right: 2.5rem;
		transform: rotate(90deg);
	}

	.corner-mark--bottom-left {
		bottom: 2.5rem;
		left: 2.5rem;
		transform: rotate(-90deg);
	}

	.corner-mark--bottom-right {
		right: 2.5rem;
		bottom: 2.5rem;
		transform: rotate(180deg);
	}
</style>
