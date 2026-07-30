<script lang="ts">
	import MenuIcon from "@lucide/svelte/icons/menu";
	import XIcon from "@lucide/svelte/icons/x";
	import { Button } from "$lib/components/ui/button";
	import { navs } from "./nav-links";

	let open = $state(false);
</script>

<div class="relative md:hidden">
	<Button
		aria-controls="mobile-menu"
		aria-expanded={open}
		aria-label="Toggle menu"
		class="md:hidden"
		onclick={() => (open = !open)}
		size="icon"
		variant="outline"
	>
		<div class={open ? "scale-100 opacity-100 transition-all" : "scale-0 opacity-0 transition-all"}>
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
