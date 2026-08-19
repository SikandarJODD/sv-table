<script lang="ts">
	import ArrowUpRightIcon from "@lucide/svelte/icons/arrow-up-right";
	import MenuIcon from "@lucide/svelte/icons/menu";
	import XIcon from "@lucide/svelte/icons/x";
	import { blocks } from "$lib/components/blocks/blocks";
	import FaviconLink from "$lib/components/docs/markdown/favicon-link.svelte";
	import { Button } from "$lib/components/ui/button";
	import Github from "$lib/components/icons/github.svelte";
	import SearchNavigation from "$lib/components/docs/layout/navigation/search-navigation.svelte";
	import { LightSwitch } from "$lib/components/ui/light-switch";
	import { Badge } from "$lib/components/ui/spell/badge";
	import { components } from "$lib/registry/components";

	const otherProjects = [
		{
			name: "Svelte Animations",
			href: "https://sv-animations.vercel.app/"
		},
		{
			name: "Svelte Marketing Blocks",
			href: "https://sv-blocks.vercel.app/"
		},
		{
			name: "Svelte Quality Marketing Blocks",
			href: "https://sv-efferd.pages.dev/"
		},
		{
			name: "Svelte AI Elements",
			href: "https://svelte-ai-elements.vercel.app/"
		},
		{
			name: "Svelte QBlocks",
			href: "https://sv-particles.vercel.app/"
		},
		{
			name: "Svelte Globe Examples",
			href: "https://sv-globe.vercel.app/"
		},
		{
			name: "Svelte Dot Matrix Loaders",
			href: "https://sv-matrix.vercel.app/"
		},
		{
			name: "Svelte Agentation",
			href: "https://sv-agentation.com/"
		}
	];

	let open = $state(true);
</script>

<div class="relative flex items-center gap-1 md:hidden">
	<SearchNavigation iconOnly enableShortcut={false} />
	<Button
		aria-label="View sv-table on GitHub"
		href="https://github.com/SikandarJODD/sv-table"
		rel="noopener noreferrer"
		size="icon-sm"
		target="_blank"
		variant="ghost"
	>
		<Github />
	</Button>
	<LightSwitch size="icon-sm" />
	<Button
		aria-controls="mobile-menu"
		aria-expanded={open}
		aria-label="Toggle menu"
		class="md:hidden"
		onclick={() => (open = !open)}
		size="icon-sm"
		variant="secondary"
	>
		<div
			class={open
				? "scale-100 opacity-100 transition-all"
				: "scale-0 opacity-0 transition-all"}
		>
			<XIcon />
		</div>
		<div
			class={open
				? "absolute scale-0 opacity-0 transition-all"
				: "absolute scale-100 opacity-100 transition-all"}
		>
			<MenuIcon />
		</div>
	</Button>

	{#if open}
		<div
			id="mobile-menu"
			class="absolute top-full right-0 z-50 mt-2 flex max-h-[calc(100dvh-4.5rem)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-xl border bg-background p-2 shadow-lg"
		>
			<div class="min-h-0 overflow-y-auto overscroll-contain">
				<a
					class="block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
					href="/"
					onclick={() => (open = false)}
				>
					Home
				</a>

				<section class="mt-2">
					<a
						class="block rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-muted"
						href="/docs/introduction"
						onclick={() => (open = false)}
					>
						Components
					</a>
					<ul class="space-y-0.5 px-1">
						{#each components as component (component.id)}
							<li>
								<a
									class="block rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
									href={component.href}
									onclick={() => (open = false)}
								>
									{component.name}
								</a>
							</li>
						{/each}
					</ul>
				</section>

				<section class="mt-2">
					<a
						class="block rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-muted"
						href="/blocks"
						onclick={() => (open = false)}
					>
						Blocks
					</a>
					<ul class="space-y-0.5 px-1">
						{#each blocks as block (block.name)}
							<li>
								<a
									class="block rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
									href={block.url}
									onclick={() => (open = false)}
								>
									{block.name}
								</a>
							</li>
						{/each}
					</ul>
				</section>

				<section class="mt-2 border-t border-dashed pt-2">
					<div
						class="flex items-center justify-between gap-3 px-3 py-2"
					>
						<p class="text-sm font-semibold">Other Projects</p>
						<Badge variant="emerald" class="rounded-full"
							>Open Source</Badge
						>
					</div>
					<ul class="space-y-0.5 px-1">
						{#each otherProjects as project (project.href)}
							<li>
								<a
									class="flex items-center justify-between gap-3 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
									href={project.href}
									target="_blank"
									rel="noopener noreferrer"
									onclick={() => (open = false)}
								>
									<span>{project.name}</span>
									<ArrowUpRightIcon
										class="size-3.5 shrink-0"
									/>
								</a>
							</li>
						{/each}
					</ul>
				</section>
			</div>

			<div
				class="sticky bottom-0 z-10 mt-2 flex shrink-0 items-center justify-center border-t border-dashed pt-2 pb-1 text-sm text-muted-foreground backdrop-blur-sm"
			>
				<span>Built by</span>
				<FaviconLink
					class="rounded-sm bg-amber-100/60 pr-1 text-sm text-amber-500 hover:text-amber-600 dark:bg-amber-900/40"
					href="https://bhide.dev"
					imageClass="size-4.5 rounded-full object-cover dark:border-amber-600"
					alt="Bhide Svelte avatar"
					rel="noreferrer"
					target="_blank">Bhide Svelte</FaviconLink
				>
			</div>
		</div>
	{/if}
</div>
