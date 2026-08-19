<script lang="ts">
	import SearchIcon from "@lucide/svelte/icons/search";
	import { blocks } from "$lib/components/blocks/blocks";
	import BlocksIcon from "$lib/components/icons/blocks-icon.svelte";
	import Badge from "$lib/components/ui/spell/badge/badge.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Command from "$lib/components/ui/command/index.js";
	import * as Kbd from "$lib/components/ui/kbd/index.js";
	import { components, docsPages } from "$lib/registry/components";
	import { type Component } from "$lib/registry/components";

	let {
		iconOnly = false,
		enableShortcut = true
	}: { iconOnly?: boolean; enableShortcut?: boolean } = $props();
	let open = $state(false);

	function handleKeydown(e: KeyboardEvent) {
		if (enableShortcut && e.key === "k" && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = !open;
		}
	}

	// For Now we would use Magic UI - Components, Later on we would update it
	let docs: Component[] = docsPages;
</script>

<svelte:document onkeydown={handleKeydown} />

<div
	class={iconOnly
		? "text-sm text-muted-foreground"
		: "mr-2 text-sm text-muted-foreground"}
>
	<Button
		variant="ghost"
		size={iconOnly ? "icon-sm" : "sm"}
		class={iconOnly
			? "bg-secondary dark:bg-muted/60"
			: "flex justify-between bg-secondary px-1.5 md:min-w-46 md:pr-1 dark:bg-muted/60"}
		aria-label={iconOnly ? "Search" : undefined}
		onclick={() => (open = true)}
	>
		{#if iconOnly}
			<SearchIcon aria-hidden="true" />
		{:else}
			<span class="hidden pl-1 md:block"> Search... </span>

			<Kbd.Group class="hidden gap-1 md:flex">
				<Kbd.Root>Ctrl</Kbd.Root>
				<Kbd.Root>K</Kbd.Root>
			</Kbd.Group>
			<SearchIcon class="md:hidden" aria-hidden="true" />
		{/if}
	</Button>
</div>

<Command.Dialog bind:open>
	<Command.Input placeholder="Search components, documentation..." />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
		<Command.Group heading="Documentation">
			{#each docs as doc (doc.id)}
				<Command.LinkItem
					value={doc.id}
					onclick={() => (open = false)}
					href={doc.href}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						role="img"
						color="currentColor"
					>
						<path
							d="M17.5055 2.01874C12.8289 2.83455 12 7.5 12 7.5V22C12 22 12.8867 17.1272 18.0004 16.5588C18.5493 16.4978 19 16.0576 19 15.5058V3.39309C19 2.5654 18.3216 1.87638 17.5055 2.01874Z"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>
						<path
							d="M5.33333 5.00001C7.79379 4.99657 10.1685 5.88709 12 7.5V22C10.1685 20.3871 7.79379 19.4966 5.33333 19.5C3.77132 19.5 2.99032 19.5 2.64526 19.2792C2.4381 19.1466 2.35346 19.0619 2.22086 18.8547C2 18.5097 2 17.8941 2 16.6629V8.40322C2 6.97543 2 6.26154 2.54874 5.68286C3.09748 5.10418 3.65923 5.07432 4.78272 5.0146C4.965 5.00491 5.14858 5.00001 5.33333 5.00001Z"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>
						<path
							d="M12 22.001C13.8315 20.3881 16.2062 19.4976 18.6667 19.501C20.2287 19.501 21.0097 19.501 21.3547 19.2802C21.5619 19.1476 21.6465 19.0629 21.7791 18.8558C22 18.5107 22 17.8951 22 16.6639V8.40424C22 6.97645 22 6.26256 21.4513 5.68388C20.9025 5.1052 20.1235 5.05972 19 5"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>
					</svg>
					{doc.name}</Command.LinkItem
				>
			{/each}
		</Command.Group>
		<Command.Group heading="Components">
			{#each components as component (component.id)}
				<Command.LinkItem
					value={component.id}
					onclick={() => (open = false)}
					href={component.href}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						role="img"
						color="currentColor"
					>
						<circle
							opacity="0.2"
							cx="12"
							cy="12"
							r="10"
							fill="currentColor"
						></circle>
						<circle
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linejoin="round"
						></circle>
					</svg>
					{component.name}
				</Command.LinkItem>
			{/each}
		</Command.Group>
		<Command.Group heading="Blocks">
			{#each blocks as block (block.name)}
				<Command.LinkItem
					value={block.name}
					onclick={() => (open = false)}
					href={block.url}
				>
					<BlocksIcon />
					{block.name}
				</Command.LinkItem>
			{/each}
		</Command.Group>
		<!-- <Command.Group heading="Spell UI">
			{#each spellComponents as component (component.id)}
				<Command.LinkItem
					value={component.id + "spell"}
					onclick={() => (open = false)}
					href={component.href}
					class="justify-between gap-3"
				>
					<span class="flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							role="img"
							color="currentColor"
						>
							<circle opacity="0.2" cx="12" cy="12" r="10" fill="currentColor"
							></circle>
							<circle
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linejoin="round"
							></circle>
						</svg>
						<span>{component.name}</span>
					</span>
					<Badge variant="secondary" class="rounded-full">Spell</Badge>
				</Command.LinkItem>
			{/each}
		</Command.Group> -->
		<!-- <Command.Group heading="Fancy Components">
			{#each fancyComponents as component (component.id)}
				<Command.LinkItem
					value={component.id + "fancy"}
					onclick={() => (open = false)}
					href={component.href}
					class="justify-between gap-3"
				>
					<span class="flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							role="img"
							color="currentColor"
						>
							<circle opacity="0.2" cx="12" cy="12" r="10" fill="currentColor"
							></circle>
							<path
								d="M8.5 12.5L11 15L16 9"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							></path>
							<circle
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linejoin="round"
							></circle>
						</svg>
						<span>{component.name}</span>
					</span>
					<Badge variant="fuchsia" class="rounded-full">Fancy</Badge>
				</Command.LinkItem>
			{/each}
		</Command.Group> -->
	</Command.List>
</Command.Dialog>
