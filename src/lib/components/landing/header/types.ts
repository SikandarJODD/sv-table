import type { LucideIcon } from "@lucide/svelte";
import type { Component } from "svelte";

export type LinkItemType = {
	name: string;
	description?: string;
	icon?: LucideIcon | Component;
	href: string;
};

export type NavType = {
	name: string;
	description?: string;
	icon?: LucideIcon | Component;
	href: string;
	sub?: LinkItemType[];
	isNew?: boolean;
};
