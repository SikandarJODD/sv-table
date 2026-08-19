<script lang="ts">
	import BlocksSidebar from "$lib/components/docs/layout/all-sidebar/blocks-sidebar.svelte";
	import Footer from "$lib/components/landing/footer.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import type { Snippet } from "svelte";

	let { children }: { children: Snippet } = $props();
</script>

<Sidebar.Provider>
	<BlocksSidebar />
	<main class="w-full">
		<div class="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-10">
			{@render children()}
		</div>
		<Footer />
	</main>
</Sidebar.Provider>
