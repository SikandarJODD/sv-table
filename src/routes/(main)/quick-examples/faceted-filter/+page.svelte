<script lang="ts">
	import { H1, Paragraph } from "$markdown";
	import { PreviewComponent } from "$lib/components/ui/preview-component";
	import type { CodeBlock } from "$lib/types/code";
	import FacetedFilter from "./faceted-filter.svelte";
	import facetedFilterCode from "./faceted-filter.svelte?raw";

	const previewCode: CodeBlock = {
		name: "faceted-filter.svelte",
		lang: "svelte",
		code: facetedFilterCode,
		highlight: [
			[21, 21],
			[42, 52],
			[100, 110]
		]
	};
</script>

<div class="space-y-8">
	<section class="space-y-3">
		<H1 id="faceted-filter-example">Faceted Filter</H1>
		<div class="max-w-2xl">
			<Paragraph>
				Filter 400 deterministic people by status and department.
				Selecting one facet recalculates the counts shown by the other,
				while multiple values inside a facet use OR matching.
			</Paragraph>
		</div>
	</section>

	<section>
		<PreviewComponent
			code={previewCode}
			isCentered={false}
			class="min-h-96! p-4"
			frame
		>
			<FacetedFilter />
		</PreviewComponent>
	</section>
</div>
