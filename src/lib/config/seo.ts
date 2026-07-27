type SeoConfig = {
  title: string;
  description: string;
  title_template: string;
  site_name: string;
  url: string;
};
export let seo_config: SeoConfig = {
  title: "Svelte Datatables Examples",
  description:
    "Svelte Datatables Examples includes examples like filtering, sorting, pagination and more.",
  title_template: "%s | Svelte Datatables Examples",
  site_name: "Svelte Datatables Examples",
  url: "https://sv-table.vercel.app",
};