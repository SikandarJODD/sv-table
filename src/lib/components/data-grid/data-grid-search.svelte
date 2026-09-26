<script lang="ts" generics="TData extends Record<string, any>">
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import ChevronUpIcon from "@lucide/svelte/icons/chevron-up";
	import XIcon from "@lucide/svelte/icons/x";
	import { watch } from "runed";

	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import type { DataGridController } from "$lib/hooks/use-data-grid.svelte";
	import { useDebounceCallback } from "$lib/hooks/use-debounce-callback";

	let { grid }: { grid: DataGridController<TData> } = $props();
	let inputRef = $state<HTMLInputElement | null>(null);
	let value = $state("");
	const debouncedSearch = useDebounceCallback(
		(query: string) => grid.search(query),
		200
	);

	watch(
		() => grid.searchOpen,
		(open) => {
			if (open) requestAnimationFrame(() => inputRef?.focus());
			else value = "";
		}
	);

	function input(event: Event) {
		value = (event.currentTarget as HTMLInputElement).value;
		grid.searchQuery = value;
		debouncedSearch(value);
	}

	function keydown(event: KeyboardEvent) {
		event.stopPropagation();
		if (event.key === "Enter") {
			event.preventDefault();
			grid.navigateSearch(event.shiftKey ? -1 : 1);
		} else if (event.key === "Escape") {
			event.preventDefault();
			grid.setSearchOpen(false);
		}
	}
</script>

{#if grid.searchOpen}
	<div
		role="search"
		class="absolute top-2 right-2 z-30 flex items-center gap-1 rounded-md border bg-background p-1 shadow-md"
		data-grid-popover
	>
		<Input
			bind:ref={inputRef}
			{value}
			class="h-8 w-56 border-0 shadow-none focus-visible:ring-0"
			placeholder="Search cells..."
			oninput={input}
			onkeydown={keydown}
		/>
		<span class="min-w-16 text-center text-xs text-muted-foreground">
			{grid.searchMatches.length ? grid.matchIndex + 1 : 0}/{grid
				.searchMatches.length}
		</span>
		<Button
			size="icon-sm"
			variant="ghost"
			onclick={() => grid.navigateSearch(-1)}
			aria-label="Previous match"
		>
			<ChevronUpIcon />
		</Button>
		<Button
			size="icon-sm"
			variant="ghost"
			onclick={() => grid.navigateSearch(1)}
			aria-label="Next match"
		>
			<ChevronDownIcon />
		</Button>
		<Button
			size="icon-sm"
			variant="ghost"
			onclick={() => grid.setSearchOpen(false)}
			aria-label="Close search"
		>
			<XIcon />
		</Button>
	</div>
{/if}
