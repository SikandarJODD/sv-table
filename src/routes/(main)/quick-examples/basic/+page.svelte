<script lang="ts">
	import { H1, Paragraph } from "$markdown";
	import { PreviewComponent } from "$lib/components/ui/preview-component";
	import type { CodeBlock } from "$lib/types/code";
	import Basic from "./basic.svelte";
	import basicCode from "./basic.svelte?raw";

	const previewCode: CodeBlock = {
		name: "basic.svelte",
		lang: "svelte",
		code: basicCode,
		highlight: [
			[147, 151],
			[222, 228]
		]
	};
</script>

<div class="space-y-8">
	<section class="space-y-3">
		<H1 id="basic-example">Basic Example</H1>
		<div class="max-w-2xl">
			<Paragraph>
				A quick example route that mirrors the full filter preview so
				you can inspect the basic setup and source in one place.
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
			<Basic />
		</PreviewComponent>
	</section>
</div>
