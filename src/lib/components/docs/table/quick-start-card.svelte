<script lang="ts">
	import { Badge } from "$lib/components/ui/spell/badge";

	interface Props {
		title: string;
		description: string;
		tags: string[];
	}

	let { title, description, tags }: Props = $props();
</script>

<article class="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-xs">
	<div class="flex items-start justify-between gap-3">
		<div>
			<h4 class="text-base font-semibold tracking-tight text-foreground">{title}</h4>
			<p class="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
		</div>
		<Badge variant="amber">Soon</Badge>
	</div>

	<div class="mt-4 flex flex-wrap gap-2">
		{#each tags as tag (tag)}
			<Badge variant="secondary">{tag}</Badge>
		{/each}
	</div>
</article>
