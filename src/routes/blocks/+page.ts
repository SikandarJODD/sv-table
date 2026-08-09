import { blockShowcases } from "$blocks/code-structure";
import type { PageLoad } from "./$types";

export const prerender = true;

export const load = (() => {
	return {
		blocks: blockShowcases
	};
}) satisfies PageLoad;
