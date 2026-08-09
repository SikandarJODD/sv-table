<script lang="ts">
	import type { Props } from "..";
	import { cn } from "$lib/utils";

	interface FolderIconProps extends Props {
		open?: boolean;
	}

	let { open = false, class: className, ...rest }: FolderIconProps = $props();
</script>

<svg
	class={cn("size-4", className)}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.5"
	stroke-linecap="round"
	stroke-linejoin="round"
	xmlns="http://www.w3.org/2000/svg"
	{...rest}
>
	{#if open}
		<path d="M3 7.5V6A2 2 0 0 1 5 4H9L11 6H19A2 2 0 0 1 21 8V9" />
		<path d="M4.2 20H18.3A2 2 0 0 0 20.2 18.6L22 11H6A2 2 0 0 0 4.1 12.4L2.2 18.6A1.1 1.1 0 0 0 3.2 20Z" />
	{:else}
		<path d="M3 7V18A2 2 0 0 0 5 20H19A2 2 0 0 0 21 18V8A2 2 0 0 0 19 6H11L9 4H5A2 2 0 0 0 3 6V7Z" />
	{/if}
</svg>
