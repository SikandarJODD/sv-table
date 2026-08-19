<script lang="ts">
	import Seo from "$lib/components/docs/base/main/seo.svelte";
	import BlockPreview from "$lib/components/docs/tree/BlockPreview.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	const title = "Svelte Data Table Blocks";
	const description =
		"Explore reusable Svelte 5 and TanStack Table V9 blocks for selection, filtering, sorting, resizing, dragging, and column pinning.";
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

<div class="mb-32 space-y-12">
	<header class="max-w-3xl space-y-2">
		<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
		<p class="text-base text-muted-foreground sm:text-lg">{description}</p>
	</header>

	<div>
		{#each data.blocks as block (block.id)}
			<BlockPreview {...block} />
		{/each}
	</div>
</div>
