<script lang="ts">
	import SearchIcon from "@lucide/svelte/icons/search";
	import { onMount } from "svelte";
	import { watch } from "runed";

	import { Button } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Input } from "$lib/components/ui/input";
	import { Kbd, KbdGroup } from "$lib/components/ui/kbd";

	let { enableSearch = false }: { enableSearch?: boolean } = $props();
	let open = $state(false);
	let query = $state("");
	let inputRef = $state<HTMLInputElement | null>(null);
	const isMac =
		typeof navigator !== "undefined" &&
		/Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
	const mod = isMac ? "⌘" : "Ctrl";

	const groups = $derived([
		{
			title: "Navigation",
			items: [
				[["↑", "↓", "←", "→"], "Navigate cells"],
				[["Shift", "Arrow"], "Extend selection"],
				[["Tab"], "Move to next cell"],
				[["Enter", "F2"], "Edit focused cell"]
			]
		},
		{
			title: "Clipboard and selection",
			items: [
				[[mod, "A"], "Select all cells"],
				[[mod, "C"], "Copy"],
				[[mod, "X"], "Cut"],
				[[mod, "V"], "Paste"],
				[["Delete"], "Clear selected cells"],
				[["Esc"], "Clear selection"]
			]
		},
		...(enableSearch
			? [{ title: "Search", items: [[[mod, "F"], "Search cells"]] }]
			: [])
	]);
	const filtered = $derived(
		groups
			.map((group) => ({
				...group,
				items: group.items.filter((item) =>
					String(item[1]).toLowerCase().includes(query.toLowerCase())
				)
			}))
			.filter((group) => group.items.length)
	);

	watch(
		() => open,
		(value) => {
			if (value) requestAnimationFrame(() => inputRef?.focus());
			else query = "";
		}
	);

	onMount(() => {
		const keydown = (event: KeyboardEvent) => {
			if (event.key === "/" && !event.metaKey && !event.ctrlKey) {
				const target = event.target as HTMLElement;
				if (target.matches("input,textarea,[contenteditable=true]"))
					return;
				event.preventDefault();
				open = true;
			}
		};
		window.addEventListener("keydown", keydown);
		return () => window.removeEventListener("keydown", keydown);
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="sm"
				>Keyboard shortcuts <Kbd>/</Kbd></Button
			>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content class="max-w-2xl" data-grid-popover>
		<Dialog.Header>
			<Dialog.Title>Keyboard shortcuts</Dialog.Title>
			<Dialog.Description
				>Navigate and edit the data grid without leaving the keyboard.</Dialog.Description
			>
		</Dialog.Header>
		<div class="relative">
			<SearchIcon
				class="absolute top-2.5 left-3 size-4 text-muted-foreground"
			/>
			<Input
				bind:ref={inputRef}
				bind:value={query}
				class="pl-9"
				placeholder="Filter shortcuts..."
			/>
		</div>
		<div
			class="grid max-h-[55vh] gap-5 overflow-y-auto py-2 sm:grid-cols-2"
		>
			{#each filtered as group (group.title)}
				<section>
					<h3 class="mb-2 text-sm font-medium">{group.title}</h3>
					<div class="space-y-2">
						{#each group.items as item (String(item[1]))}
							<div
								class="flex items-center justify-between gap-3 text-sm"
							>
								<span class="text-muted-foreground"
									>{item[1]}</span
								>
								<KbdGroup>
									{#each item[0] as key (key)}<Kbd>{key}</Kbd
										>{/each}
								</KbdGroup>
							</div>
						{/each}
					</div>
				</section>
			{/each}
		</div>
	</Dialog.Content>
</Dialog.Root>
