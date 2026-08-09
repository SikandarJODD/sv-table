<script lang="ts">
	import type { Props } from "..";
	import { cn } from "$lib/utils";

	let { class: className, ...rest }: Props = $props();
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
	<path class="opacity-50" d="M7 8L3 12L7 16" />
	<path class="opacity-50" d="M17 8L21 12L17 16" />
	<path d="M14 4L10 20" />
</svg>
