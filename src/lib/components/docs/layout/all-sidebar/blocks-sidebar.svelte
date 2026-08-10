<script lang="ts">
	import { blocks } from "$lib/components/blocks/blocks";
	import BlocksIcon from "$lib/components/icons/blocks-icon.svelte";
	import SupportWork from "$lib/components/docs/base/main/support-work.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import type { ComponentProps } from "svelte";
	import SidebarCount from "./sidebar-count.svelte";
	import { toKebabCaseWithPrefix } from "$lib/utils";

	let {
		ref = $bindable(null),
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root class="bg-background pt-16" {...restProps} bind:ref>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>
				<span class="flex items-center gap-1.5">
					Blocks
					<SidebarCount count={blocks.length} />
				</span>
				<BlocksIcon class="ml-auto" />
			</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each blocks as block (block.name)}
						<Sidebar.MenuItem>
							{#if block.disabled}
								<Sidebar.MenuButton
									disabled
									class="cursor-not-allowed text-muted-foreground"
									title="Coming soon"
								>
									{block.name}
								</Sidebar.MenuButton>
							{:else}
								<Sidebar.MenuButton>
									{#snippet child({ props })}
										<a
											href={block.url}
											data-s-event={toKebabCaseWithPrefix(
												block.name,
												"blocks"
											)}
											{...props}
										>
											{block.name}
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							{/if}
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer>
		<SupportWork />
	</Sidebar.Footer>
</Sidebar.Root>
