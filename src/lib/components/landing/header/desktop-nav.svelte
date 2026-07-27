<script lang="ts">
	import * as NavigationMenu from "$lib/components/ui/navigation-menu/index";
	import LinkItem from "./link-item.svelte";
	import { navs } from "./nav-links";
</script>

<NavigationMenu.Root class="hidden md:flex">
	<NavigationMenu.List class="gap-2">
		{#each navs as nav}
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
							{#each nav.sub as item, i}
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
	</NavigationMenu.List>
</NavigationMenu.Root>
