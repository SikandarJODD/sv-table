<script lang="ts">
	import {
		ArrowUpDownIcon,
		FilterIcon,
		LayoutGridIcon,
		Rows3Icon,
		SearchIcon,
		Table2Icon,
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
			icon: FilterIcon,
			description:
				"Use an open source Svelte datatable starter that you can inspect, adapt, and extend for real table workflows.",
			iconWrapClass:
				"border-emerald-200/70 bg-emerald-100/90 shadow-emerald-200/50 dark:border-emerald-900/80 dark:bg-emerald-950/50 dark:shadow-transparent",
			iconClass: "text-emerald-700 dark:text-emerald-300"
		},
		{
			title: "20+ Table Examples",
			icon: ArrowUpDownIcon,
			description:
				"Browse more than 20 examples covering table behaviors, layouts, and common TanStack Table patterns for Svelte apps.",
			iconWrapClass:
				"border-sky-200/70 bg-sky-100/90 shadow-sky-200/50 dark:border-sky-900/80 dark:bg-sky-950/50 dark:shadow-transparent",
			iconClass: "text-sky-700 dark:text-sky-300"
		},
		{
			title: "Pre-built Table Components",
			icon: Rows3Icon,
			description:
				"Start with ready-made pieces like Datatable Filter and other reusable building blocks designed for table UIs.",
			iconWrapClass:
				"border-amber-200/70 bg-amber-100/90 shadow-amber-200/50 dark:border-amber-900/80 dark:bg-amber-950/50 dark:shadow-transparent",
			iconClass: "text-amber-700 dark:text-amber-300"
		},
		{
			title: "Shadcn Svelte CLI",
			icon: SearchIcon,
			description:
				"Install the table components through the Shadcn Svelte CLI so setup stays consistent with the rest of your UI.",
			iconWrapClass:
				"border-rose-200/70 bg-rose-100/90 shadow-rose-200/50 dark:border-rose-900/80 dark:bg-rose-950/50 dark:shadow-transparent",
			iconClass: "text-rose-700 dark:text-rose-300"
		},
		{
			title: "Guides and Docs",
			icon: LayoutGridIcon,
			description:
				"Follow practical guides, setup notes, and documentation that explain how the table pieces fit together.",
			iconWrapClass:
				"border-violet-200/70 bg-violet-100/90 shadow-violet-200/50 dark:border-violet-900/80 dark:bg-violet-950/50 dark:shadow-transparent",
			iconClass: "text-violet-700 dark:text-violet-300"
		},
		{
			title: "Built for Tables",
			icon: Table2Icon,
			description:
				"Everything stays focused on datatables, including filtering, sorting, pagination, search, and table-specific UI patterns.",
			iconWrapClass:
				"border-fuchsia-200/70 bg-fuchsia-100/90 shadow-fuchsia-200/50 dark:border-fuchsia-900/80 dark:bg-fuchsia-950/50 dark:shadow-transparent",
			iconClass: "text-fuchsia-700 dark:text-fuchsia-300"
		}
	];
</script>

<div class="mx-auto w-full max-w-5xl space-y-10 py-16 md:space-y-12 md:py-24">
	<div class="mx-auto max-w-3xl text-center">
		<h2
			class="mt-5 text-2xl font-medium text-balance md:text-4xl lg:text-5xl"
		>
			Datatable resources built for Svelte teams.
		</h2>
		<p
			class="mt-4 text-sm leading-6 text-balance text-muted-foreground md:text-base"
		>
			Explore open source table components, example-heavy patterns,
			install guides, and table-focused docs in one place.
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
