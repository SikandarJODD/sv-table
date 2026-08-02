<script lang="ts">
	import "./layout.css";
	import { page } from "$app/state";
	import favicon from "$lib/assets/favicon.svg";
	import { activeElement, PressedKeys } from "runed";
	import { ModeWatcher, toggleMode } from "mode-watcher";
	import { Header } from "$lib/components/landing/header";
	import { MetaTags, deepMerge } from "svelte-meta-tags";

	import { browser, dev } from "$app/environment";
	import { Agentation } from "sv-agentation";
	import type { LayoutProps } from "./$types";

	let { data, children }: LayoutProps = $props();
	let keys = new PressedKeys();
	keys.onKeys(["d"], () => {
		if (
			activeElement.current?.localName === "input" ||
			activeElement.current?.localName === "textarea"
		)
			return;
		toggleMode();
	});
	let workSpaceRootPath = "S:\\sv\\comp-setup";
	let metaTags = $derived(deepMerge(data.baseMetaTags, page.data.pageMetaTags));
</script>

{#if browser && dev}
	<Agentation workspaceRoot={workSpaceRootPath} />
{/if}

<ModeWatcher defaultMode="dark" />
<MetaTags {...metaTags} />
<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<Header />

{@render children()}
