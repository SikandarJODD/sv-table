<script lang="ts">
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import ChevronUpIcon from "@lucide/svelte/icons/chevron-up";

	import { Button } from "$lib/components/ui/button";

	type Props = {
		expanded: boolean;
		name: string;
		onclick: () => void;
	};

	let { expanded, name, onclick }: Props = $props();
</script>

<Button
	aria-expanded={expanded}
	aria-label={`${expanded ? "Collapse" : "Expand"} details for ${name}`}
	class="size-7 text-muted-foreground shadow-none"
	{onclick}
	size="icon-xs"
	variant="ghost"
>
	{#if expanded}
		<ChevronUpIcon aria-hidden="true" class="size-4 opacity-60" />
	{:else}
		<ChevronDownIcon aria-hidden="true" class="size-4 opacity-60" />
	{/if}
</Button>
