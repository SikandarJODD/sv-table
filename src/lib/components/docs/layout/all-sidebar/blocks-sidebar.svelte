<script lang="ts" module>
	const blocks = [
		"Basic Data table",
		"Datatable with Filters",
		"With Data Filters",
		"Resizable & Sortable Columns",
		"Pinnable Columns",
		"Draggable Columns",
		"Expand Sub Rows",
		"Paginated Table",
		"Numeric Pagination",
		"Complex Table"
	].map((title) => ({ title, url: "#" }));
</script>

<script lang="ts">
	import BlocksIcon from "$lib/components/icons/blocks.svelte";
	import SupportWork from "$lib/components/docs/base/main/support-work.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import type { ComponentProps } from "svelte";
	import SidebarCount from "./sidebar-count.svelte";

	let {
		ref = $bindable(null),
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root class="bg-background pt-14" {...restProps} bind:ref>
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
					{#each blocks as block (block.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href={block.url} {...props}>{block.title}</a>
								{/snippet}
							</Sidebar.MenuButton>
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
