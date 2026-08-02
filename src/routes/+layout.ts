import { defineBaseMetaTags } from "svelte-meta-tags";
import { seo_config } from "$lib/config/seo";

const ogImage = {
	url: `${seo_config.url}/og.png`,
	alt: seo_config.site_name,
	width: 1672,
	height: 941,
	type: "image/png"
};

export const load = () => {
	return defineBaseMetaTags({
		openGraph: {
			images: [ogImage]
		},
		twitter: {
			image: ogImage.url,
			imageAlt: ogImage.alt
		}
	});
};
