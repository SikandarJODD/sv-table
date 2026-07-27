import BadgeSvelteRaw from "$lib/components/ui/badge/badge.svelte?raw";
import IndexTsRaw from "$lib/components/ui/badge/index.ts?raw";

import type {
	ComponentDoc,
	ComponentMeta,
	InstallComponentDocs,
} from "$lib/types/structure";
import type { Example } from "$lib/types/example";
import type { SEO } from "$lib/types/seo";
import Preview from "./examples/preview.svelte";
import PreviewCode from "./examples/preview.svelte?raw";
import DemoExample from "./examples/demo-example.svelte";
import DemoExampleRaw from "./examples/demo-example.svelte?raw";

export const meta: ComponentMeta = {
	id: "badge",
	title: "Badge",
	description: "TODO: Add a concise description for Badge.",
	category: "ui",
};

const seo: SEO = {
	title: "Badge",
	description: "TODO: Add an SEO description for Badge.",
	keywords: ["Svelte", "Badge", "Component"],
};

const examples: Example[] = [
	{
		name: "Demo",
		preview: DemoExample,
		code: {
			name: "demo-example.svelte",
			code: DemoExampleRaw,
			lang: "svelte",
		},
	},
];

const install_block: InstallComponentDocs = {
	packages: [],
	install_code: [
		{ name: "badge.svelte", code: BadgeSvelteRaw, lang: "svelte", isExpand: true, },
		{ name: "index.ts", code: IndexTsRaw, lang: "typescript", }
	],
	folder_structure: `src/
	└── lib/
		└── components/
			└── magic/
				└── backlight/
					├── backlight.svelte
					└── index.ts`,
};

export const data: ComponentDoc = {
	...meta,
	preview: Preview,
	preview_code: {
		name: "preview.svelte",
		code: PreviewCode,
		lang: "svelte",
		hideLines: true,
	},
	install_block,
	examples,
	seo,
	props: [],
};
