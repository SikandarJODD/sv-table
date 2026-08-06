<script lang="ts">
	import { H1, Paragraph } from "$markdown";
	import { PreviewComponent } from "$lib/components/ui/preview-component";
	import type { CodeBlock } from "$lib/types/code";
	import CsvExport from "./csv-export.svelte";
	import csvExportCode from "./csv-export.svelte?raw";

	const previewCode: CodeBlock = {
		name: "csv-export.svelte",
		lang: "svelte",
		code: csvExportCode
	};
</script>

<div class="space-y-8">
	<section class="space-y-3">
		<H1 id="csv-export-example">CSV Export Example</H1>
		<div class="max-w-2xl">
			<Paragraph>
				Filter a customer table and download exactly the matching rows
				as a CSV file, with explicit headers and formatted currency
				values.
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
			<CsvExport />
		</PreviewComponent>
	</section>
</div>
