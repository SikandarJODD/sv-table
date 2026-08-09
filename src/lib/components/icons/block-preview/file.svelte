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
	<path d="M14 2.75H7A2.25 2.25 0 0 0 4.75 5V19A2.25 2.25 0 0 0 7 21.25H17A2.25 2.25 0 0 0 19.25 19V8Z" />
	<path d="M14 2.75V6A2 2 0 0 0 16 8H19.25" />
</svg>
