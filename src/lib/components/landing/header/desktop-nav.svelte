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
			href: "https://sv-animations.vercel.app",
			description:
				"Include 50+ Animation components like Magic UI, Spell UI.",
			icon: SparklesIcon
		},
		{
			name: "Svelte Marketing Components",
			href: "https://sv-blocks.vercel.app",
			description:
				"150+ Reusable sections and UI blocks for marketing pages.",
			icon: LayoutTemplateIcon
		},
		{
			name: "Svelte Premium Marketing Components",
			href: "https://sv-efferd.pages.dev",
			description:
				"50+ Premium set of polished marketing components for Svelte.",
			icon: SwatchBookIcon
		},
		{
			name: "Svelte AI Elements",
			href: "https://svelte-ai-elements.vercel.app",
			description: "Pre-built AI Components, Guide & Examples.",
			icon: BotIcon
		},
		{
			name: "Svelte Dot Matrix Loaders",
			href: "https://sv-matrix.vercel.app",
			description: "50+ Dot Matrix loaders",
			icon: LoaderCircleIcon
		},
		{
			name: "Svelte Agentation",
			href: "https://sv-agentation.com",
			description: "Provides right context to AI Agent.",
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
