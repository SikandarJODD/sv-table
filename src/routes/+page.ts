import { definePageMetaTags } from "svelte-meta-tags";
import { seo_config } from "$lib/config/seo";

const ogImage = {
	url: `${seo_config.url}/og.png`,
	alt: seo_config.site_name,
	width: 1672,
	height: 941,
	type: "image/png"
};

export const prerender = true;

export const load = ({ url }: { url: URL }) => {
	const canonical = new URL(url.pathname, seo_config.url).href;

	return definePageMetaTags({
		title: seo_config.title,
		titleTemplate: seo_config.title_template,
		description: seo_config.description,
		canonical,
		openGraph: {
			url: canonical,
			title: seo_config.title,
			description: seo_config.description,
			siteName: seo_config.site_name,
			images: [ogImage]
		},
		twitter: {
			creator: "@Sikandar_Bhide",
			site: "@Sikandar_Bhide",
			cardType: "summary_large_image",
			title: seo_config.title,
			description: seo_config.description,
			image: ogImage.url,
			imageAlt: ogImage.alt
		}
	});
};
