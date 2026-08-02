<script lang="ts">
	import { page } from "$app/state";
	import { Hero } from "$lib/components/landing";
	import Feature from "$lib/components/landing/feature/feature.svelte";
	import Footer from "$lib/components/landing/footer.svelte";
	import { seo_config } from "$lib/config/seo";
	import { MetaTags } from "svelte-meta-tags";

	const title = seo_config.title;
	const description = seo_config.description;
	const canonical = $derived(page.url.origin);
</script>

<MetaTags
	{title}
	titleTemplate={seo_config.title_template}
	{description}
	{canonical}
	openGraph={{
		url: canonical,
		title,
		description,
		siteName: seo_config.site_name
	}}
	twitter={{
		creator: "@Sikandar_Bhide",
		site: "@Sikandar_Bhide",
		cardType: "summary_large_image",
		title,
		description
	}}
/>

<Hero />
<!-- <Feature /> -->
<Footer />
