<script lang="ts" module>
	import {
		components,
		quickExamples,
		type BadgeType
	} from "$lib/registry/components";

	type NavItem = {
		title: string;
		url: string;
		badge?: BadgeType;
	};

	const componentNavItems: NavItem[] = components.map(
		({ name, href, badge }) => ({
			title: name,
			url: href,
			badge
		})
	);

	// Build navigation from the shared registry.
	const data = {
		navMain: [
			{
				title: "Getting Started",
				url: "#",
				items: [
					{
						title: "Introduction",
						url: "/docs"
					}
					// {
					// 	title: "Installation",
					// 	url: "/docs/installation"
					// }
				] as NavItem[]
			},
			{
				title: "Components",
				url: "#",
				items: componentNavItems
			},
			{
				title: "Quick Examples",
				url: "#",
				items: quickExamples.map((example) => ({
					title: example.name,
					url: example.href
				})) as NavItem[]
			}
		]
	};
</script>

<script lang="ts">
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import { Button } from "$lib/components/ui/button";
	import {
		ScrollArea,
		ScrollFadeEffect
	} from "$lib/components/ui/scroll-area/index.js";
	import Badge from "$lib/components/ui/spell/badge/badge.svelte";
	import { page } from "$app/state";
	import type { ComponentProps } from "svelte";
	import { watch } from "runed";
	import SupportWork from "../../base/main/support-work.svelte";
	import { cn } from "$lib/utils";

	let {
		ref = $bindable(null),
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
	let contentRef = $state<HTMLElement | null>(null);
	let pathname = $derived(page.url.pathname);

	watch(
		() => pathname,
		() => {
			let activeItem = contentRef?.querySelector<HTMLElement>(
				'[data-sidebar="menu-button"][data-active="true"]'
			);

			activeItem?.scrollIntoView({
				block: "nearest",
				inline: "nearest",
				behavior: "smooth"
			});
		}
	);
</script>

<Sidebar.Root class="bg-background pt-14" {...restProps} bind:ref>
	<Sidebar.Content bind:ref={contentRef}>
		<!-- <ScrollFadeEffect class="max-h-[calc(100vh-6rem)] py-4 pr-1"> -->
		<!-- We create a Sidebar.Group for each parent. -->
		{#each data.navMain as group (group.title)}
			<Sidebar.Group>
				<Sidebar.GroupLabel>{group.title}</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each group.items as item (`${group.title}-${item.title}`)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton
									isActive={page.url.pathname === item.url}
									class={cn(
										"flex w-full scroll-mt-10 scroll-mb-40 justify-between",
										(item.url === "/components/filters" ||
											item.url ===
												"/components/row-actions-menu" ||
											item.url ===
												"/components/data-table-export" ||
											item.url ===
												"/components/data-table-faceted-filter") &&
											"pr-1"
									)}
								>
									{#snippet child({ props })}
										<a href={item.url} {...props}>
											{item.title}
											{#if (item.url === "/components/row-actions-menu" || item.url === "/components/data-table-export" || item.url === "/components/data-table-faceted-filter") && item.badge}
												<Badge
													size="sm"
													variant="amber"
													class="px-1.5 py-0.5"
												>
													{item.badge}
												</Badge>
											{:else if item.url === "/components/filters"}
												<Badge
													size="sm"
													variant="amber"
													class="text-amber-500 dark:text-amber-600"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="64"
														height="64"
														viewBox="0 0 24 24"
														fill="none"
														><path
															d="M20.6009 4.10156V6.30156C20.6009 7.10156 20.1009 8.10156 19.6009 8.60156L15.3009 12.4016C14.7009 12.9016 14.3009 13.9016 14.3009 14.7016V19.0016C14.3009 19.6016 13.9009 20.4016 13.4009 20.7016L12.0009 21.6016C10.7009 22.4016 8.90086 21.5016 8.90086 19.9016V14.6016C8.90086 13.9016 8.50086 13.0016 8.10086 12.5016L7.63086 12.0116C7.32086 11.6816 7.26086 11.1816 7.51086 10.7916L12.6309 2.57156C12.8109 2.28156 13.1309 2.10156 13.4809 2.10156H18.6009C19.7009 2.10156 20.6009 3.00156 20.6009 4.10156Z"
															fill="currentColor"
														></path><path
															d="M10.3504 3.63156L6.80039 9.32156C6.46039 9.87156 5.68039 9.95156 5.23039 9.48156L4.30039 8.50156C3.80039 8.00156 3.40039 7.10156 3.40039 6.50156V4.20156C3.40039 3.00156 4.30039 2.10156 5.40039 2.10156H9.50039C10.2804 2.10156 10.7604 2.96156 10.3504 3.63156Z"
															fill="currentColor"
														></path></svg
													>
												</Badge>
											{/if}
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
		<!-- </ScrollFadeEffect> -->
	</Sidebar.Content>
	<Sidebar.Footer>
		<SupportWork />
	</Sidebar.Footer>
</Sidebar.Root>
