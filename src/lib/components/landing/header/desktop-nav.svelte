<script lang="ts">
	import BotIcon from "@lucide/svelte/icons/bot";
	import Grid2x2Icon from "@lucide/svelte/icons/grid-2x2";
	import LayoutTemplateIcon from "@lucide/svelte/icons/layout-template";
	import LoaderCircleIcon from "@lucide/svelte/icons/loader-circle";
	import SparklesIcon from "@lucide/svelte/icons/sparkles";
	import SwatchBookIcon from "@lucide/svelte/icons/swatch-book";
	import * as NavigationMenu from "$lib/components/ui/navigation-menu/index";
	import LinkItem from "./link-item.svelte";
	import { navs } from "./nav-links";

	const otherProjects = [
		{
			name: "Svelte Animation",
			href: "",
			description:
				"Animation-focused components and motion patterns for Svelte.",
			icon: SparklesIcon
		},
		{
			name: "Svelte Marketing Components",
			href: "",
			description: "Reusable sections and UI blocks for marketing pages.",
			icon: LayoutTemplateIcon
		},
		{
			name: "Svelte Premium Marketing Components",
			href: "",
			description:
				"A premium set of polished marketing components for Svelte.",
			icon: SwatchBookIcon
		},
		{
			name: "Svelte AI Elements",
			href: "",
			description:
				"Interface elements tailored for AI-first product experiences.",
			icon: BotIcon
		},
		{
			name: "Svelte Dot Matrix Loaders",
			href: "",
			description: "Dot matrix loading indicators and related UI states.",
			icon: LoaderCircleIcon
		},
		{
			name: "Svelte Agentation",
			href: "",
			description:
				"A Svelte library for building agent-driven application flows.",
			icon: Grid2x2Icon
		}
	];
</script>

<NavigationMenu.Root class="hidden md:flex">
	<NavigationMenu.List class="gap-2">
		{#each navs as nav (nav.name)}
			{#if nav.sub}
				<NavigationMenu.Item>
					<NavigationMenu.Trigger
						class="h-fit py-1.5! hover:bg-accent/60!"
						>{nav.name}</NavigationMenu.Trigger
					>
					<NavigationMenu.Content class="p-0">
						<div
							class="grid w-lg grid-cols-2 gap-2 rounded-lg bg-popover p-1 shadow"
						>
							{#each nav.sub as item (item.name)}
								<NavigationMenu.Link class="rounded-lg!">
									<LinkItem {...item} />
								</NavigationMenu.Link>
							{/each}
						</div>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
			{:else}
				<NavigationMenu.Item>
					<NavigationMenu.Link
						class="rounded-md py-1.5 hover:bg-accent/60!"
					>
						{#snippet child({ props })}
							<a href={nav.href} {...props}>{nav.name}</a>
						{/snippet}
					</NavigationMenu.Link>
				</NavigationMenu.Item>
			{/if}
		{/each}
		<NavigationMenu.Item>
			<NavigationMenu.Trigger class="h-fit py-1.5! hover:bg-accent/60!"
				>Other Projects</NavigationMenu.Trigger
			>
			<NavigationMenu.Content class="p-0">
				<div
					class="grid w-[42rem] grid-cols-2 gap-2 rounded-lg bg-popover p-1 shadow"
				>
					{#each otherProjects as item (item.name)}
						<NavigationMenu.Link class="rounded-lg!">
							<LinkItem {...item} />
						</NavigationMenu.Link>
					{/each}
				</div>
			</NavigationMenu.Content>
		</NavigationMenu.Item>
	</NavigationMenu.List>
</NavigationMenu.Root>
