<script lang="ts" generics="TData extends Record<string, any>">
	import CopyIcon from "@lucide/svelte/icons/copy";
	import EraserIcon from "@lucide/svelte/icons/eraser";
	import ScissorsIcon from "@lucide/svelte/icons/scissors";
	import Trash2Icon from "@lucide/svelte/icons/trash-2";

	import type { DataGridController } from "$lib/hooks/use-data-grid.svelte";

	let { grid }: { grid: DataGridController<TData> } = $props();

	function action(callback: () => void | Promise<void>) {
		grid.closeContextMenu();
		void callback();
	}
</script>

{#if grid.contextMenu.open}
	<div
		role="menu"
		tabindex="-1"
		aria-label="Cell actions"
		data-grid-popover
		class="fixed z-50 min-w-44 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
		style={`left:${grid.contextMenu.x}px;top:${grid.contextMenu.y}px;`}
		oncontextmenu={(event) => event.preventDefault()}
	>
		<button
			type="button"
			role="menuitem"
			class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent focus:bg-accent focus:outline-none"
			onclick={() => action(grid.copy)}
		>
			<CopyIcon class="size-4 text-muted-foreground" /> Copy
		</button>
		{#if !grid.readOnly}
			<button
				type="button"
				role="menuitem"
				class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent focus:bg-accent focus:outline-none"
				onclick={() => action(grid.cut)}
			>
				<ScissorsIcon class="size-4 text-muted-foreground" /> Cut
			</button>
			<button
				type="button"
				role="menuitem"
				class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent focus:bg-accent focus:outline-none"
				onclick={() => action(grid.clear)}
			>
				<EraserIcon class="size-4 text-muted-foreground" /> Clear cells
			</button>
			<div class="my-1 h-px bg-border"></div>
			<button
				type="button"
				role="menuitem"
				class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-accent focus:bg-accent focus:outline-none"
				onclick={() => action(grid.deleteSelectedRows)}
			>
				<Trash2Icon class="size-4" /> Delete rows
			</button>
		{/if}
	</div>
{/if}
