import type { Component } from "svelte";
import May14_26 from "./May14-26.svelte";

export type ChangelogEntry = {
    id: string;
    component: Component;
};

export const changelog: ChangelogEntry[] = [
    {
        id: "2026-05-14",
        component: May14_26,
    },
];
