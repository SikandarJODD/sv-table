<script lang="ts">
	import { cn } from "$lib/utils";
	import type { Icon } from "@lucide/svelte";
	import type { HTMLAttributes } from "svelte/elements";

	type Feature = {
		title: string;
		icon: typeof Icon;
		description: string;
		iconWrapClass: string;
		iconClass: string;
	};

	type Props = HTMLAttributes<HTMLDivElement> & {
		feature: Feature;
	};

	let { feature, class: className, ...props }: Props = $props();
	let FeatureIcon: typeof Icon = $derived(feature.icon);
</script>

<div
	class={cn("relative overflow-hidden bg-background p-6 md:p-7", className)}
	{...props}
>
	<div
		class="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 size-full mask-[radial-gradient(farthest-side_at_top,white,transparent)]"
	></div>

	<div
		class={cn(
			"relative inline-flex size-12 items-center justify-center rounded-2xl border shadow-sm",
			feature.iconWrapClass
		)}
	>
		<FeatureIcon class={cn("size-5", feature.iconClass)} />
	</div>
	<h3 class="mt-6 text-sm font-medium md:text-base">{feature.title}</h3>
	<p
		class="relative z-20 mt-2 max-w-xs text-sm leading-6 text-muted-foreground"
	>
		{feature.description}
	</p>
</div>
