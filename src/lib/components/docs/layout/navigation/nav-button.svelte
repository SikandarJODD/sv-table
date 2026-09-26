<script lang="ts">
	import { cn } from "$lib/utils";
	import { ChevronLeftIcon, ChevronRightIcon } from "@lucide/svelte";

	type ComponentProps = {
		label: string;
		title: string;
		href: string;
		align?: "left" | "right";
		forceSecondColumn?: boolean;
	};

	const {
		label,
		title,
		href,
		align = "left",
		forceSecondColumn = false,
		...rest
	}: ComponentProps = $props();
</script>

<a
	{href}
	{...rest}
	class={cn(
		"group relative flex flex-col rounded-lg border border-border bg-background px-4 py-3 shadow-sm transition-[background-color] duration-150 ease-out hover:bg-muted/50",
		forceSecondColumn && "col-start-2"
	)}
>
	<div
		class={cn("flex items-start gap-1", align === "right" && "justify-end")}
	>
		{#if align === "left"}
			<span>
				<ChevronLeftIcon
					class="mt-0.5 h-4 w-4 text-foreground/50 transition-colors duration-150 ease-out group-hover:text-foreground"
				/>
			</span>
		{/if}
		<div class={cn("flex flex-col", align === "right" && "text-right")}>
			<span class="my-0 py-0 text-sm text-foreground">
				{title}
			</span>
			<span
				class={[
					"mt-1 line-clamp-1 text-sm text-foreground/45",
					align === "left" && "pr-2"
				]}
			>
				{label}
			</span>
		</div>
		{#if align === "right"}
			<span>
				<ChevronRightIcon
					class="mt-0.5 h-4 w-4 text-foreground/50 transition-colors duration-150 ease-out group-hover:text-foreground"
				/>
			</span>
		{/if}
	</div>
</a>
