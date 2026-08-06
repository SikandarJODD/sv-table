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
	import { ArrowUpRightIcon, PackageIcon } from "@lucide/svelte";
	import { cn } from "$lib/utils";

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
	type ProjectItem = {
		title: string;
		description: string;
		url: string;
		github: string;
		slug: string;
		accent?: "amber";
	};

	const projectItems: ProjectItem[] = [
		{
			title: "Svelte Animations",
			description:
				"Unoffical Port of Magic UI and Spell UI for Svelte. Include 50+ Animation components.",
			url: "https://sv-animations.vercel.app/",
			github: "https://github.com/SikandarJODD/animations",
			slug: "svelte-animations"
		},
		{
			title: "Svelte Marketing Blocks",
			description: "Reusable marketing sections and landing-page blocks.",
			url: "https://sv-blocks.vercel.app/",
			github: "https://github.com/SikandarJODD/cnblocks",
			slug: "svelte-marketing-blocks"
		},
		{
			title: "Svelte Quality Marketing Blocks",
			description:
				"Polished marketing blocks for high-quality Svelte sites.",
			url: "https://sv-efferd.pages.dev/",
			github: "https://github.com/SikandarJODD/sv-efferd",
			slug: "svelte-quality-marketing-blocks"
		},
		{
			title: "Svelte AI Elements",
			description:
				"Composable Svelte elements for AI product interfaces.",
			url: "https://svelte-ai-elements.vercel.app/",
			github: "https://github.com/SikandarJODD/ai-elements",
			slug: "svelte-ai-elements"
		},
		{
			title: "Svelte Particles",
			description:
				"Interactive particle effects and examples for Svelte.",
			url: "https://sv-particles.vercel.app/",
			github: "https://github.com/SikandarJODD/sv-particles",
			slug: "svelte-particles"
		},
		{
			title: "Svelte Data Table Components & Examples",
			description:
				"Data table components, patterns, and practical examples.",
			url: "https://sv-table.vercel.app/",
			github: "https://github.com/SikandarJODD/sv-table",
			slug: "svelte-data-table"
		},
		{
			title: "Svelte Globe Examples",
			description: "Interactive globe examples and visual experiments.",
			url: "https://sv-globe.vercel.app/",
			github: "https://github.com/SikandarJODD/sv-globe",
			slug: "svelte-globe"
		},
		{
			title: "Svelte Dot Matrix Loaders",
			description:
				"Customizable dot-matrix loading animations for Svelte.",
			url: "https://sv-matrix.vercel.app/",
			github: "https://github.com/SikandarJODD/sv-matrix",
			slug: "svelte-dot-matrix-loaders"
		},
		{
			title: "Svelte Agentation",
			description:
				"Visual feedback and annotation tools for AI coding agents.",
			url: "https://sv-agentation.com/",
			github: "https://github.com/SikandarJODD/sv-agentation",
			slug: "svelte-agentation",
			accent: "amber"
		}
	];

	function withUtm(url: string, content: string) {
		const params = new URLSearchParams({
			utm_source: "sv-animations",
			utm_medium: "referral",
			utm_campaign: "other-projects",
			utm_content: content
		});

		return `${url}?${params.toString()}`;
	}
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
		<NavigationMenu.Item id="other-projects">
			<NavigationMenu.Trigger
				class="bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-transparent hover:text-primary focus:bg-transparent focus:text-primary data-[state=open]:bg-transparent data-[state=open]:text-primary"
			>
				Other Projects
			</NavigationMenu.Trigger>
			<NavigationMenu.Content class="p-0">
				<div class="w-[42rem]">
					<ul class="grid grid-cols-2 gap-1 p-2">
						{#each projectItems as project (project.url)}
							<li
								class="group/project-card relative flex min-w-0 items-start gap-2 rounded-md p-2.5 transition-colors focus-within:bg-accent hover:bg-accent"
							>
								<a
									href={withUtm(
										project.url,
										`navbar-${project.slug}`
									)}
									target="_blank"
									rel="noopener noreferrer"
									class="min-w-0 flex-1 rounded-sm outline-none"
								>
									<div
										class="flex items-center gap-1.5 text-sm leading-none font-medium"
									>
										<span class="truncate"
											>{project.title}</span
										>
										{#if project.accent === "amber"}
											<PackageIcon
												aria-label="Library"
												class="size-3 shrink-0 text-amber-500"
											/>
										{/if}
									</div>
									<p
										class="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground"
									>
										{project.description}
									</p>
								</a>
								<a
									href={withUtm(
										project.github,
										`navbar-${project.slug}-github`
									)}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={`View ${project.title} on GitHub`}
									class="-mt-0.5 shrink-0 rounded-sm p-1 text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
								>
									<svg
										class={cn("size-3 fill-current")}
										viewBox="0 0 256 250"
										xmlns="http://www.w3.org/2000/svg"
										preserveAspectRatio="xMidYMid"
									>
										<path
											d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46 6.397 1.185 8.746-2.777 8.746-6.158 0-3.052-.12-13.135-.174-23.83-35.61 7.742-43.124-15.103-43.124-15.103-5.823-14.795-14.213-18.73-14.213-18.73-11.613-7.944.876-7.78.876-7.78 12.853.902 19.621 13.19 19.621 13.19 11.417 19.568 29.945 13.911 37.249 10.64 1.149-8.272 4.466-13.92 8.127-17.116-28.431-3.236-58.318-14.212-58.318-63.258 0-13.975 5-25.394 13.188-34.358-1.329-3.224-5.71-16.242 1.24-33.874 0 0 10.749-3.44 35.21 13.121 10.21-2.836 21.16-4.258 32.038-4.307 10.878.049 21.837 1.47 32.066 4.307 24.431-16.56 35.165-13.12 35.165-13.12 6.967 17.63 2.584 30.65 1.255 33.873 8.207 8.964 13.173 20.383 13.173 34.358 0 49.163-29.944 59.988-58.447 63.157 4.591 3.972 8.682 11.762 8.682 23.704 0 17.126-.148 30.91-.148 35.126 0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002 256 57.307 198.691 0 128.001 0Zm-80.06 182.34c-.282.636-1.283.827-2.194.39-.929-.417-1.45-1.284-1.15-1.922.276-.655 1.279-.838 2.205-.399.93.418 1.46 1.293 1.139 1.931Zm6.296 5.618c-.61.566-1.804.303-2.614-.591-.837-.892-.994-2.086-.375-2.66.63-.566 1.787-.301 2.626.591.838.903 1 2.088.363 2.66Zm4.32 7.188c-.785.545-2.067.034-2.86-1.104-.784-1.138-.784-2.503.017-3.05.795-.547 2.058-.055 2.861 1.075.782 1.157.782 2.522-.019 3.08Zm7.304 8.325c-.701.774-2.196.566-3.29-.49-1.119-1.032-1.43-2.496-.726-3.27.71-.776 2.213-.558 3.315.49 1.11 1.03 1.45 2.505.701 3.27Zm9.442 2.81c-.31 1.003-1.75 1.459-3.199 1.033-1.448-.439-2.395-1.613-2.103-2.626.301-1.01 1.747-1.484 3.207-1.028 1.446.436 2.396 1.602 2.095 2.622Zm10.744 1.193c.036 1.055-1.193 1.93-2.715 1.95-1.53.034-2.769-.82-2.786-1.86 0-1.065 1.202-1.932 2.733-1.958 1.522-.03 2.768.818 2.768 1.868Zm10.555-.405c.182 1.03-.875 2.088-2.387 2.37-1.485.271-2.861-.365-3.05-1.386-.184-1.056.893-2.114 2.376-2.387 1.514-.263 2.868.356 3.061 1.403Z"
										/>
									</svg>
								</a>
								<span
									aria-hidden="true"
									class="pointer-events-none absolute right-2 bottom-2 translate-y-1 rounded-md bg-muted p-1 text-muted-foreground opacity-0 shadow-xs transition-all duration-200 group-hover/project-card:translate-y-0 group-hover/project-card:opacity-100"
								>
									<ArrowUpRightIcon class="size-3" />
								</span>
							</li>
						{/each}
					</ul>
					<a
						href={withUtm("https://bhide.dev", "navbar-owner")}
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center justify-center gap-1.5 border-t border-t-amber-200 bg-amber-100/40 px-3 py-3 text-xs text-muted-foreground dark:border-t-yellow-600/30 dark:bg-amber-900/10"
					>
						<span>Built by</span>
						<span
							class="inline-flex items-center gap-1.5 rounded-sm font-medium text-amber-500 transition-colors outline-none hover:text-amber-500/90 focus-visible:ring-[3px] focus-visible:ring-ring/50"
						>
							<img
								src="https://github.com/SikandarJODD.png"
								alt=""
								width="16"
								height="16"
								class="size-4 rounded-full"
							/>
							Bhide Svelte
						</span>
					</a>
				</div>
			</NavigationMenu.Content>
		</NavigationMenu.Item>
	</NavigationMenu.List>
</NavigationMenu.Root>
