<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { ScrollFadeEffect } from "$lib/components/ui/scroll-area";
	import { LightSwitch } from "$lib/components/ui/light-switch";
	import { Portal, PortalBackdrop } from "$lib/components/ui/portal";
	import { github_repo } from "$lib/config/repo";
	import { components } from "$lib/registry/components";
	import Github from "$lib/svg/github.svelte";
	import X from "$lib/svg/x.svelte";
	import { cn } from "$lib/utils";
	import MenuIcon from "@lucide/svelte/icons/menu";
	import XIcon from "@lucide/svelte/icons/x";

	let open = $state(false);

	const linkClass =
		"rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
</script>

<div class="flex items-center gap-1 md:hidden">
	<LightSwitch />
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
			class={cn(
				"transition-all",
				open ? "scale-100 opacity-100" : "scale-0 opacity-0"
			)}
		>
			<XIcon />
		</div>
		<div
			class={cn(
				"absolute transition-all",
				open ? "scale-0 opacity-0" : "scale-100 opacity-100"
			)}
		>
			<MenuIcon />
		</div>
	</Button>

	{#if open}
		<Portal class="top-10">
			<PortalBackdrop
				class="bg-background! backdrop-blur-none duration-200"
			/>
			<div
				id="mobile-menu"
				class={cn(
					"flex size-full min-h-0 flex-col p-4"
					// "ease-out data-[slot=open]:animate-in data-[slot=open]:zoom-in-97"
				)}
				data-slot={open ? "open" : "closed"}
			>
				<ScrollFadeEffect class="no-scrollbar min-h-0 flex-1">
					<nav class="flex flex-col gap-1 pb-4">
						<a
							class={linkClass}
							href="/"
							onclick={() => (open = false)}
						>
							Home
						</a>

						<div class="flex flex-col gap-1">
							<a
								class={linkClass}
								href={components[0].href}
								onclick={() => (open = false)}
							>
								Components
							</a>

							<div class="flex flex-col pl-4">
								{#each components as component (component.id)}
									<a
										class="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
										href={component.href}
										onclick={() => (open = false)}
									>
										{component.name}
									</a>
								{/each}
							</div>
						</div>

						<a
							class={linkClass}
							href="/sponsors"
							onclick={() => (open = false)}
						>
							Sponsors
						</a>
					</nav>
				</ScrollFadeEffect>

				<div class="flex justify-end gap-1 pt-2 pb-4">
					<Button
						aria-label="GitHub"
						href={github_repo.url}
						rel="noopener noreferrer"
						size="icon"
						target="_blank"
						variant="ghost"
					>
						<Github class="size-4" />
					</Button>
					<Button
						aria-label="X (Twitter)"
						href="https://x.com/Sikandar_Bhide"
						rel="noopener noreferrer"
						size="icon"
						target="_blank"
						variant="secondary"
					>
						<X class="size-4" />
					</Button>
				</div>
			</div>
		</Portal>
	{/if}
</div>
