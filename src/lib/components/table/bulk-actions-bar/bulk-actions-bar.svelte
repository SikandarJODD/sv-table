<script lang="ts">
	import XIcon from "@lucide/svelte/icons/x";
	import { prefersReducedMotion } from "svelte/motion";
	import { fly } from "svelte/transition";
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	import { Button } from "$lib/components/ui/button";
	import { cn } from "$lib/utils.js";

	type Props = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
		selectedCount: number;
		onClear: () => void;
		children: Snippet;
		summary?: Snippet<[selectedCount: number]>;
		clearLabel?: string;
	};

	let {
		selectedCount,
		onClear,
		children,
		summary,
		clearLabel = "Clear selection",
		"aria-label": ariaLabel = "Bulk actions",
		class: className,
		...restProps
	}: Props = $props();
</script>

{#if selectedCount > 0}
	<div
		class="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex justify-center px-4"
		transition:fly={{
			y: prefersReducedMotion.current ? 0 : 24,
			duration: prefersReducedMotion.current ? 0 : 200
		}}
	>
		<div
			{...restProps}
			data-slot="bulk-actions-bar"
			role="region"
			aria-label={ariaLabel}
			class={cn(
				"pointer-events-auto flex max-w-full items-center gap-2 rounded-xl border bg-background/95 p-2 text-foreground shadow-lg ring-1 ring-foreground/5 backdrop-blur supports-[backdrop-filter]:bg-background/85",
				className
			)}
		>
			<div
				role="status"
				aria-live="polite"
				class="shrink-0 px-1 text-sm font-medium whitespace-nowrap"
			>
				{#if summary}
					{@render summary(selectedCount)}
				{:else}
					{selectedCount}
					{selectedCount === 1 ? "item" : "items"} selected
				{/if}
			</div>

			<div aria-hidden="true" class="h-5 w-px shrink-0 bg-border"></div>

			<div class="flex min-w-0 items-center gap-1 overflow-x-auto">
				{@render children()}
			</div>

			<Button
				variant="ghost"
				size="icon-sm"
				onclick={onClear}
				aria-label={clearLabel}
				title={clearLabel}
				class="shrink-0"
			>
				<XIcon />
			</Button>
		</div>
	</div>
{/if}
