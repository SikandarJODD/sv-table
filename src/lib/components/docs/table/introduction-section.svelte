<script lang="ts">
	import PackageBadges from "$lib/components/docs/base/main/package-badges.svelte";
	import { CodeSpan, H2, Paragraph } from "$markdown";
	import SectionCallout from "./section-callout.svelte";

	interface Props {
		packages: string[];
	}

	let { packages }: Props = $props();
</script>

<section class="space-y-4">
	<H2 id="introduction">Introduction</H2>

	<div class="max-w-3xl space-y-3">
		<Paragraph>
			Filters is a composable data-table filter bar for Svelte applications. It gives you a
			typed column builder, a stateful filter controller, and a UI layer that supports text,
			number, date, option, and multi-option filtering.
		</Paragraph>
		<Paragraph>
			The component works for both <CodeSpan>client</CodeSpan> and <CodeSpan>server</CodeSpan>
			strategies. On the client, you can derive filtered rows locally. On the server, you can
			treat the emitted filters state as a query contract and fetch only the rows you need.
		</Paragraph>
	</div>

	<PackageBadges {packages} />

	<SectionCallout title="Repo API" badge="Svelte package" tone="blue">
		<p>
			Bazza UI’s reference docs are React-first. This repo exposes a Svelte API built around
			<CodeSpan>createFilters(...)</CodeSpan>, Svelte components, and
			<CodeSpan>$lib/components/ui/table</CodeSpan> rather than a React hook or JSX render
			tree.
		</p>
	</SectionCallout>
</section>
