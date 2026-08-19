<script lang="ts">
	import MenuIcon from "@lucide/svelte/icons/menu";
	import XIcon from "@lucide/svelte/icons/x";
	import { Button } from "$lib/components/ui/button";
	import Github from "$lib/components/icons/github.svelte";
	import SearchNavigation from "$lib/components/docs/layout/navigation/search-navigation.svelte";
	import { LightSwitch } from "$lib/components/ui/light-switch";
	import { navs } from "./nav-links";

	let open = $state(false);
</script>

<div class="relative flex items-center gap-1 md:hidden">
	<SearchNavigation iconOnly enableShortcut={false} />
	<Button
		aria-label="View sv-table on GitHub"
		href="https://github.com/SikandarJODD/sv-table"
		rel="noopener noreferrer"
		size="icon-sm"
		target="_blank"
		variant="ghost"
	>
		<Github />
	</Button>
	<LightSwitch size="icon-sm" />
	<Button
		aria-controls="mobile-menu"
		aria-expanded={open}
		aria-label="Toggle menu"
		class="md:hidden"
		onclick={() => (open = !open)}
		size="icon-sm"
		variant="secondary"
	>
		<div
			class={open
				? "scale-100 opacity-100 transition-all"
				: "scale-0 opacity-0 transition-all"}
		>
			<XIcon />
		</div>
		<div
			class={open
				? "absolute scale-0 opacity-0 transition-all"
				: "absolute scale-100 opacity-100 transition-all"}
		>
			<MenuIcon />
		</div>
	</Button>

	{#if open}
		<div
			id="mobile-menu"
			class="absolute top-full right-0 z-50 mt-2 flex w-56 flex-col rounded-xl border bg-background p-2 shadow-lg"
		>
			{#each navs as nav (nav.name)}
				<a
					class="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
					href={nav.href}
					onclick={() => (open = false)}
				>
					{nav.name}
				</a>
			{/each}
		</div>
	{/if}
</div>
