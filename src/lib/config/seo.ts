type SeoConfig = {
  title: string;
  description: string;
  title_template: string;
  site_name: string;
  url: string;
};
export let seo_config: SeoConfig = {
  title: "Svelte Component",
  description:
    "A SvelteKit template for building and documenting Svelte components.",
  title_template: "%s | Svelte Component Setup",
  site_name: "Svelte Component Setup",
  url: "https://svelte-component-setup.vercel.app",
};