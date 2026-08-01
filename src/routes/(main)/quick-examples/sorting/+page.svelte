<script lang="ts">
	import { H1, Paragraph } from "$markdown";
	import { PreviewComponent } from "$lib/components/ui/preview-component";
	import type { CodeBlock } from "$lib/types/code";
	import Sorting from "./sorting.svelte";
	import sortingCode from "./sorting.svelte?raw";

	const previewCode: CodeBlock = {
		name: "sorting.svelte",
		lang: "svelte",
		code: sortingCode
	};
</script>

<div class="space-y-8">
	<section class="space-y-3">
		<H1 id="sorting-example">Sorting Example</H1>
		<div class="max-w-2xl">
			<Paragraph>
				A seeded TanStack Table v9 example that keeps the repo's data table filters,
				renders with the shared `ui/table` primitives, and exposes the full source in
				a framed code block.
			</Paragraph>
		</div>
	</section>

	<section>
		<PreviewComponent
			code={previewCode}
			isCentered={false}
			class="min-h-80! p-4"
			frame
		>
			<Sorting />
		</PreviewComponent>
	</section>
</div>
