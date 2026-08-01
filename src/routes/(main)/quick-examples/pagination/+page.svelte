<script lang="ts">
	import { H1, Paragraph } from "$markdown";
	import { PreviewComponent } from "$lib/components/ui/preview-component";
	import type { CodeBlock } from "$lib/types/code";
	import Pagination from "./pagination.svelte";
	import PaginationCode from "./pagination.svelte?raw";

	const previewCode: CodeBlock = {
		name: "pagination-example.svelte",
		lang: "svelte",
		code: PaginationCode
	};
</script>

<div class="space-y-8">
	<section class="space-y-3">
		<H1 id="sorting-example">Pagination Example</H1>
		<div class="max-w-2xl">
			<Paragraph>
				A seeded TanStack Table v9 example that keeps the repo's data
				table filters, renders with the shared `ui/table` primitives,
				and exposes the full source in a framed code block.
			</Paragraph>
		</div>
	</section>

	<section>
		<PreviewComponent
			code={previewCode}
			isCentered={false}
			class="min-h-80! px-4 pt-10 pb-4"
			frame
		>
			<Pagination />
		</PreviewComponent>
	</section>
</div>
