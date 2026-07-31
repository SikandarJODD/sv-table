<script lang="ts" module>
	import { components, type BadgeType } from "$lib/registry/components";

	type NavItem = {
		title: string;
		url: string;
		badge?: BadgeType;
	};

	// Build navigation from registry
	const data = {
		navMain: [
			{
				title: "Getting Started",
				url: "#",
				items: [
					{
						title: "Introduction",
						url: "/docs"
					},
					{
						title: "Installation",
						url: "/docs/installation"
					}
				] as NavItem[]
			},
			{
				title: "Components",
				url: "#",
				items: components.map((c) => ({
					title: c.name,
					url: c.href,
					badge: c.badge
				})) as NavItem[]
			}
			// {
			// 	title: "Filter Examples",
			// 	url: "#",
			// 	items: [
			// 		{
			// 			title: "Basic Example",
			// 			url: "#"
			// 		},
			// 		{
			// 			title: "Sorting & Filtering",
			// 			url: "#"
			// 		},
			// 		{
			// 			title: "Pagination",
			// 			url: "#"
			// 		}
			// 	] as NavItem[]
			// }
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
										item.url === "/components/filters" &&
											"pr-1"
									)}
								>
									{#snippet child({ props })}
										<a href={item.url} {...props}>
											{item.title}
											{#if item.url === "/components/filters"}
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
											{:else if item.badge}
												<Badge
													variant={item.badge ===
													"New"
														? "emerald"
														: item.badge ===
															  "Updated"
															? "cyan"
															: "yellow"}
													size="sm"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="64"
														height="64"
														viewBox="0 0 24 24"
														fill="none"
														><path
															fill-rule="evenodd"
															clip-rule="evenodd"
															d="M7.33569 3.38268C7.93132 1.87244 10.0687 1.87244 10.6643 3.38268L11.7363 6.10082C11.7657 6.17532 11.8247 6.23429 11.8992 6.26367L14.6173 7.33569C16.1276 7.93132 16.1276 10.0687 14.6173 10.6643L11.8992 11.7363C11.8247 11.7657 11.7657 11.8247 11.7363 11.8992L10.6643 14.6173C10.0687 16.1276 7.93132 16.1276 7.33569 14.6173L6.26367 11.8992C6.23429 11.8247 6.17532 11.7657 6.10082 11.7363L3.38268 10.6643C1.87244 10.0687 1.87244 7.93132 3.38268 7.33569L6.10082 6.26367C6.17532 6.23429 6.23429 6.17532 6.26367 6.10082L7.33569 3.38268ZM9.26891 3.93301C9.17267 3.68899 8.82733 3.689 8.73109 3.93301L7.65907 6.65115C7.47722 7.11224 7.11224 7.47722 6.65116 7.65907L3.93301 8.73109C3.68899 8.82733 3.689 9.17267 3.93301 9.26891L6.65115 10.3409C7.11224 10.5228 7.47722 10.8878 7.65907 11.3488L8.73109 14.067C8.82733 14.311 9.17267 14.311 9.26891 14.067L10.3409 11.3488C10.5228 10.8878 10.8878 10.5228 11.3488 10.3409L14.067 9.26891C14.311 9.17267 14.311 8.82733 14.067 8.73109L11.3488 7.65907C10.8878 7.47722 10.5228 7.11224 10.3409 6.65116L9.26891 3.93301ZM15.7908 13.073C16.2235 11.9757 17.7765 11.9757 18.2092 13.073L18.9779 15.0221L20.927 15.7908C22.0243 16.2235 22.0243 17.7765 20.927 18.2092L18.9779 18.9779L18.2092 20.927C17.7765 22.0243 16.2235 22.0243 15.7908 20.927L15.0221 18.9779L13.073 18.2092C11.9757 17.7765 11.9757 16.2235 13.073 15.7908L15.0221 15.0221L15.7908 13.073ZM17 14.0953L16.3856 15.6533C16.2534 15.9883 15.9883 16.2534 15.6533 16.3856L14.0953 17L15.6533 17.6144C15.9883 17.7466 16.2534 18.0117 16.3856 18.3467L17 19.9047L17.6144 18.3467C17.7466 18.0117 18.0117 17.7466 18.3467 17.6144L19.9047 17L18.3467 16.3856C18.0117 16.2534 17.7466 15.9883 17.6144 15.6533L17 14.0953Z"
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
