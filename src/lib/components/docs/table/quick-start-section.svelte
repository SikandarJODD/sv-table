<script lang="ts">
	import { H2, H3, Paragraph } from "$markdown";
	import { quickStartCards } from "./filters-doc-content";
	import QuickStartCard from "./quick-start-card.svelte";
</script>

<section class="space-y-4">
	<H2 id="quick-start">Quick Start</H2>

	<div class="max-w-3xl space-y-3">
		<Paragraph>
			Quick Start will collect short, direct links into focused examples. For now, the section
			is laid out as placeholder cards so future demos can drop in without changing the page
			structure or the table of contents.
		</Paragraph>
	</div>

	<div class="space-y-4">
		<H3 id="examples" class="mt-0">Examples</H3>

		<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
			{#each quickStartCards as card (card.title)}
				<QuickStartCard {...card} />
			{/each}
		</div>
	</div>
</section>
