import FileTextIcon from "@lucide/svelte/icons/file-text";
import GlobeIcon from "@lucide/svelte/icons/globe";
import LayersIcon from "@lucide/svelte/icons/layers";

import type { NavType } from "./types";

let navs: NavType[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Components",
    href: "/components",
    sub: [
      {
        name: "Backlight",
        href: "/components/backlight",
        description:
          "simple and customizable button component",
        icon: FileTextIcon,
      },
      {
        name: "Input",
        href: "/components/input",
        description:
          "simple and customizable input component",
        icon: GlobeIcon,
      },
      {
        name: "Badge",
        href: "/components/badge",
        description:
          "simple and customizable badge component",
        icon: LayersIcon,
      }
    ],
  },
  {
    name: "Docs",
    href: "/docs",
  },
  {
    name: "Changelog",
    href: "/changelog",
  },
];
export { navs };