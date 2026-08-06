<script lang="ts">
	import { H1, Paragraph } from "$markdown";
	import { PreviewComponent } from "$lib/components/ui/preview-component";
	import type { CodeBlock } from "$lib/types/code";
	import DateRangeFilterExample from "./date-range-filter.svelte";
	import dateRangeFilterCode from "./date-range-filter.svelte?raw";

	const previewCode: CodeBlock = {
		name: "date-range-filter.svelte",
		lang: "svelte",
		code: dateRangeFilterCode,
		highlight: [
			[19, 23],
			[32, 37],
			[48, 58],
			[69, 73]
		]
	};
</script>

<div class="space-y-8">
	<section class="space-y-3">
		<H1 id="date-range-filter-example">Date Range Filter</H1>
		<div class="max-w-2xl">
			<Paragraph>
				Filter 400 deterministic people by their joined date. This
				example connects the controlled component to TanStack Table's
				inclusive
				<code>inDateRange</code> filter.
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
			<DateRangeFilterExample />
		</PreviewComponent>
	</section>
</div>
