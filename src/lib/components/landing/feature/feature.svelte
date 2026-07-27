<script lang="ts">
	import {
		BadgeCheckIcon,
		BlocksIcon,
		DownloadIcon,
		FolderGit2Icon,
		LockOpenIcon,
		PaletteIcon,
		type Icon
	} from "@lucide/svelte";
	import FeatureCard from "./feature-card.svelte";

	type Feature = {
		title: string;
		icon: typeof Icon;
		description: string;
		iconWrapClass: string;
		iconClass: string;
	};

	const features: Feature[] = [
		{
			title: "Open Source",
			icon: FolderGit2Icon,
			description:
				"Everything ships as code you can inspect, adapt, and keep in your own repo.",
			iconWrapClass:
				"border-emerald-200/70 bg-emerald-100/90 shadow-emerald-200/50 dark:border-emerald-900/80 dark:bg-emerald-950/50 dark:shadow-transparent",
			iconClass: "text-emerald-700 dark:text-emerald-300"
		},
		{
			title: "Install with shadcn-svelte",
			icon: DownloadIcon,
			description:
				"Add only the pieces you need with the shadcn-svelte CLI instead of pulling in a full framework.",
			iconWrapClass:
				"border-sky-200/70 bg-sky-100/90 shadow-sky-200/50 dark:border-sky-900/80 dark:bg-sky-950/50 dark:shadow-transparent",
			iconClass: "text-sky-700 dark:text-sky-300"
		},
		{
			title: "No Lock-In",
			icon: LockOpenIcon,
			description:
				"Copy the component, edit the markup, and own the final implementation from day one.",
			iconWrapClass:
				"border-amber-200/70 bg-amber-100/90 shadow-amber-200/50 dark:border-amber-900/80 dark:bg-amber-950/50 dark:shadow-transparent",
			iconClass: "text-amber-700 dark:text-amber-300"
		},
		{
			title: "Fully Customizable",
			icon: PaletteIcon,
			description:
				"Tune spacing, colors, variants, and states so the UI matches your product instead of fighting it.",
			iconWrapClass:
				"border-rose-200/70 bg-rose-100/90 shadow-rose-200/50 dark:border-rose-900/80 dark:bg-rose-950/50 dark:shadow-transparent",
			iconClass: "text-rose-700 dark:text-rose-300"
		},
		{
			title: "Composable Blocks",
			icon: BlocksIcon,
			description:
				"Build landing pages and app screens from focused pieces that stay easy to extend as requirements grow.",
			iconWrapClass:
				"border-violet-200/70 bg-violet-100/90 shadow-violet-200/50 dark:border-violet-900/80 dark:bg-violet-950/50 dark:shadow-transparent",
			iconClass: "text-violet-700 dark:text-violet-300"
		},
		{
			title: "Free to Build With",
			icon: BadgeCheckIcon,
			description:
				"Use the components in experiments, client work, and production apps without paying for access to the source.",
			iconWrapClass:
				"border-fuchsia-200/70 bg-fuchsia-100/90 shadow-fuchsia-200/50 dark:border-fuchsia-900/80 dark:bg-fuchsia-950/50 dark:shadow-transparent",
			iconClass: "text-fuchsia-700 dark:text-fuchsia-300"
		}
	];
</script>

<div class="mx-auto w-full max-w-5xl space-y-10 py-16 md:space-y-12 md:py-24">
	<div class="mx-auto max-w-3xl text-center">
		<div
			class="mx-auto inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase shadow-sm backdrop-blur"
		>
			Built for modern Svelte teams
		</div>
		<h2
			class="mt-5 text-2xl font-medium text-balance md:text-4xl lg:text-5xl"
		>
			Open. Customizable. Ready to ship.
		</h2>
		<p
			class="mt-4 text-sm leading-6 text-balance text-muted-foreground md:text-base"
		>
			Free, open-source Svelte components you can install with
			<code class="rounded bg-muted px-1.5 py-0.5 text-foreground">
				shadcn-svelte
			</code>,
			shape to your system, and ship without giving up control of the code.
		</p>
	</div>

	<div class="overflow-hidden rounded-2xl border bg-background/70 shadow-sm">
		<div
			class="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 md:grid-cols-3"
		>
			{#each features as feature (feature.title)}
				<FeatureCard {feature} />
			{/each}
		</div>
	</div>
</div>
