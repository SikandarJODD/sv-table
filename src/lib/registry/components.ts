export type BadgeType = "New" | "Updated" | "Beta";

export interface Component {
  id: string;
  name: string;
  href: string;
  badge?: BadgeType;
  desc?: string;
}

export interface DocPage {
  id: string;
  name: string;
  href: string;
  desc?: string;
}

export interface QuickExample {
  id: string;
  name: string;
  href: string;
  desc?: string;
}

let components: Component[] = [
  {
    id: "filters",
    name: "Data Table Filters",
    href: "/components/filters",
    desc: "Composable table filters with text, number, option, and date operators for Svelte apps.",
    badge: 'New'
  },
];

export { components };

let quickExamples: QuickExample[] = [
  {
    id: "basic",
    name: "Basic Example",
    href: "/quick-examples/basic",
    desc: "A complete quick example that mirrors the table filters preview.",
  },
  {
    id: "sorting",
    name: "Sorting",
    href: "/quick-examples/sorting",
    desc: "Sorting-focused quick example route.",
  },
  {
    id: "pagination",
    name: "Pagination",
    href: "/quick-examples/pagination",
    desc: "Pagination-focused quick example route.",
  },
];

export { quickExamples };

let docsPages: DocPage[] = [
  {
    id: "docs",
    name: "Introduction",
    href: "/docs",
    desc: "Getting started with the setup.",
  },
  // {
  //   id: "installation",
  //   name: "Installation",
  //   href: "/docs/installation",
  //   desc: "Create the app and initialize shadcn-svelte.",
  // },
];

export { docsPages };

type NavigationItem = DocPage | Component | QuickExample;

function getNavigationItems(): NavigationItem[] {
  return [...docsPages, ...components, ...quickExamples];
}

export function getPrevNext(id: string): {
  prev: NavigationItem | null;
  next: NavigationItem | null;
} {
  let items = getNavigationItems();
  let index = items.findIndex((item) => item.id === id);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? items[index - 1] : null,
    next: index < items.length - 1 ? items[index + 1] : null,
  };
}
