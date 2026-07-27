import BacklightRaw from "$lib/components/magic/backlight/backlight.svelte?raw";
import IndexTs from "$lib/components/magic/backlight/index.ts?raw";

import type {
  ComponentDoc,
  ComponentMeta,
  InstallComponentDocs,
} from "$lib/types/structure";
import type { Example } from "$lib/types/example";
import type { SEO } from "$lib/types/seo";
import Preview from "./examples/preview.svelte";
import PreviewCode from "./examples/preview.svelte?raw";
import BacklightSvgExample from "./examples/backlight-svg-example.svelte";
import BacklightSvgExampleRaw from "./examples/backlight-svg-example.svelte?raw";
import BacklightImageExample from "./examples/backlight-image-example.svelte";
import BacklightImageExampleRaw from "./examples/backlight-image-example.svelte?raw";

/** Component metadata for navigation */
export const meta: ComponentMeta = {
  id: "backlight",
  title: "Backlight",
  description:
    "An SVG filter wrapper that adds a soft, saturated backlight glow around the content it wraps.",
  category: "animation",
  badge: "new",
};

const seo: SEO = {
  title: "Backlight",
  description:
    "Learn how to wrap content with a soft backlight glow effect in Svelte using the Svelte 5 Animations library.",
  keywords: [
    "Svelte",
    "Backlight",
    "Glow Effect",
    "SVG Filter",
    "Svelte 5 Animations",
  ],
};

const examples: Example[] = [
  {
    name: "Image",
    preview: BacklightImageExample,
    previewClass: "h-100",
    code: {
      name: "backlight-image-example.svelte",
      code: BacklightImageExampleRaw,
      lang: "svelte",
      highlight: [2],
    },
  },
  {
    name: "Svg",
    preview: BacklightSvgExample,
    code: {
      name: "backlight-svg-example.svelte",
      code: BacklightSvgExampleRaw,
      lang: "svelte",
      highlight: [2],
    },
  },
];

let install_block: InstallComponentDocs = {
  packages: [],
  install_code: [
    {
      name: "backlight.svelte",
      code: BacklightRaw,
      lang: "svelte",
      isExpand: true,
    },
    {
      name: "index.ts",
      code: IndexTs,
      lang: "typescript",
    },
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
    name: "backlight.svelte",
    code: PreviewCode,
    lang: "svelte",
    hideLines: true,
    highlight: [2],
  },
  install_block,
  examples,
  seo,
  props: [
    {
      name: "Backlight",
      desc: "Wraps content in an SVG blur and saturation filter to create a glowing backlight effect.",
      props: [
        {
          name: "children",
          type: "Snippet",
          default: "''",
          description: "The content rendered inside the backlight wrapper.",
        },
        {
          name: "class",
          type: "string",
          default: "''",
          description: "Custom classes applied to the outer wrapper element.",
        },
        {
          name: "blur",
          type: "number",
          default: "10",
          description: "Controls the blur intensity used by the SVG filter.",
        },
      ],
    },
  ],
};