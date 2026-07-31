<script lang="ts">
	import type { Snippet } from "svelte";
	import { Badge } from "$lib/components/ui/spell/badge";
	import { cn } from "$lib/utils";

	interface Props {
		title: string;
		badge?: string;
		tone?: "blue" | "amber" | "emerald";
		children: Snippet;
	}

	let { title, badge, tone = "blue", children }: Props = $props();

	const toneClasses = {
		blue: "border-sky-200 bg-sky-50/80 text-sky-950 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-100",
		amber:
			"border-amber-200 bg-amber-50/80 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100",
		emerald:
			"border-emerald-200 bg-emerald-50/80 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100"
	};
</script>

<div class={cn("rounded-xl border p-4", toneClasses[tone])}>
	<div class="flex flex-wrap items-center gap-2">
		<p class="text-sm font-semibold tracking-tight">{title}</p>
		{#if badge}
			<Badge variant={tone === "amber" ? "amber" : tone === "emerald" ? "emerald" : "sky"}>
				{badge}
			</Badge>
		{/if}
	</div>
	<div class="mt-2 text-sm leading-6">
		{@render children()}
	</div>
</div>
