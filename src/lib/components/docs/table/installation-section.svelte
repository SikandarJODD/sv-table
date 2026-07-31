<script lang="ts">
	import { PMCommand } from "$lib/components/ui/pm-command";
	import { CodeSpan, H2, Paragraph } from "$markdown";
	import { installReceiptPaths } from "./filters-doc-content";
	import SectionCallout from "./section-callout.svelte";

	interface Props {
		componentURL: string;
	}

	let { componentURL }: Props = $props();
</script>

<section class="space-y-4">
	<H2 id="installation">Installation</H2>

	<div class="max-w-3xl space-y-3">
		<Paragraph>
			Install the registry block first. The package ships with the UI components, core column
			types, helper utilities, and locale files needed to get a working filter bar into your
			project quickly.
		</Paragraph>
	</div>

	<PMCommand command="add" args={[componentURL]} />

	<SectionCallout title="What gets installed" badge="Registry block" tone="emerald">
		<ul class="list-disc space-y-1 pl-5">
			{#each installReceiptPaths as path (path)}
				<li>
					<CodeSpan>{path}</CodeSpan>
				</li>
			{/each}
		</ul>
	</SectionCallout>
</section>
