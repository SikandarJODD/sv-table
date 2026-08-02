<script lang="ts">
	import "./layout.css";
	import { asset } from "$app/paths";
	import favicon from "$lib/assets/favicon.svg";
	import { activeElement, PressedKeys } from "runed";
	import { ModeWatcher, toggleMode } from "mode-watcher";
	import { Header } from "$lib/components/landing/header";
	import { seo_config } from "$lib/config/seo";
	import { MetaTags } from "svelte-meta-tags";

	import { browser, dev } from "$app/environment";
	import { Agentation } from "sv-agentation";

	let { children } = $props();
	let keys = new PressedKeys();
	keys.onKeys(["d"], () => {
		if (
			activeElement.current?.localName === "input" ||
			activeElement.current?.localName === "textarea"
		)
			return;
		toggleMode();
	});
	const ogImage = {
		url: `${seo_config.url}${asset("/og.png")}`,
		alt: seo_config.site_name,
		width: 1672,
		height: 941,
		type: "image/png"
	};
</script>

{#if browser && dev}
	<Agentation  />
{/if}

<ModeWatcher defaultMode="dark" />
<MetaTags
	openGraph={{
		images: [ogImage]
	}}
	twitter={{
		image: ogImage.url,
		imageAlt: ogImage.alt
	}}
/>
<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<Header />

{@render children()}
