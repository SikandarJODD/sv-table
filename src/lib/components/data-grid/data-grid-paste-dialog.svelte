<script lang="ts" generics="TData extends Record<string, any>">
	import { Button } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog";
	import type { DataGridController } from "$lib/hooks/use-data-grid.svelte";

	let { grid }: { grid: DataGridController<TData> } = $props();
	let expand = $state(true);
</script>

<Dialog.Root
	open={grid.pasteDialog.open}
	onOpenChange={(open) => !open && grid.closePasteDialog()}
>
	<Dialog.Content data-grid-popover>
		<Dialog.Header>
			<Dialog.Title>Add more rows?</Dialog.Title>
			<Dialog.Description>
				The clipboard needs <strong
					>{grid.pasteDialog.rowsNeeded}</strong
				>
				additional row{grid.pasteDialog.rowsNeeded === 1 ? "" : "s"}.
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-3 py-2">
			<label
				class="flex cursor-pointer items-start gap-3 rounded-md border p-3"
			>
				<input
					type="radio"
					name="paste-mode"
					value={true}
					bind:group={expand}
				/>
				<span
					><strong>Add rows</strong><br /><span
						class="text-sm text-muted-foreground"
						>Paste all clipboard values.</span
					></span
				>
			</label>
			<label
				class="flex cursor-pointer items-start gap-3 rounded-md border p-3"
			>
				<input
					type="radio"
					name="paste-mode"
					value={false}
					bind:group={expand}
				/>
				<span
					><strong>Keep current rows</strong><br /><span
						class="text-sm text-muted-foreground"
						>Paste only values that fit.</span
					></span
				>
			</label>
		</div>
		<Dialog.Footer>
			<Button variant="outline" onclick={grid.closePasteDialog}
				>Cancel</Button
			>
			<Button onclick={() => void grid.continuePaste(expand)}
				>Continue</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
