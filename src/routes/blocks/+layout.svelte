<script lang="ts">
	import BlocksSidebar from "$lib/components/docs/layout/all-sidebar/blocks-sidebar.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import type { Snippet } from "svelte";

	let { children }: { children: Snippet } = $props();
</script>

<Sidebar.Provider>
	<BlocksSidebar />
	<main class="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-10">
		{@render children()}
	</main>
</Sidebar.Provider>
