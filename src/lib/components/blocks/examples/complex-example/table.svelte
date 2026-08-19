<script lang="ts">
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import ChevronUpIcon from "@lucide/svelte/icons/chevron-up";
	import { FlexRender, type SvelteTable } from "@tanstack/svelte-table";

	import * as Table from "$lib/components/ui/table";
	import { cn } from "$lib/utils";

	import type { Person } from "./fetch-data";
	import { features } from "./table-features";

	let { table }: { table: SvelteTable<typeof features, Person> } = $props();

	const rows = $derived(table.getRowModel().rows);
</script>

<div class="w-full overflow-x-auto rounded-lg border">
	<Table.Root
		class="table-fixed"
		style={`min-width: ${table.getTotalSize()}px;`}
	>
		<Table.Header>
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<Table.Row class="hover:bg-transparent">
					{#each headerGroup.headers as header (header.id)}
						<Table.Head
							aria-sort={header.column.getIsSorted() === "asc"
								? "ascending"
								: header.column.getIsSorted() === "desc"
									? "descending"
									: "none"}
							class={cn(
								"h-11",
								header.column.id === "balance" && "text-right"
							)}
							style={`width: ${header.getSize()}px;`}
						>
							{#if !header.isPlaceholder}
								{#if header.column.getCanSort()}
									<button
										type="button"
										class={cn(
											"flex h-full w-full cursor-pointer items-center justify-between gap-2 text-left select-none",
											header.column.id === "balance" &&
												"justify-end"
										)}
										onclick={header.column.getToggleSortingHandler()}
									>
										<span class="truncate"
											><FlexRender {header} /></span
										>
										{#if header.column.getIsSorted() === "asc"}
											<ChevronUpIcon
												aria-hidden="true"
												class="size-4 shrink-0 opacity-60"
											/>
										{:else if header.column.getIsSorted() === "desc"}
											<ChevronDownIcon
												aria-hidden="true"
												class="size-4 shrink-0 opacity-60"
											/>
										{/if}
									</button>
								{:else}
									<FlexRender {header} />
								{/if}
							{/if}
						</Table.Head>
					{/each}
				</Table.Row>
			{/each}
		</Table.Header>

		<Table.Body>
			{#each rows as row (row.id)}
				<Table.Row
					data-state={row.getIsSelected() ? "selected" : undefined}
				>
					{#each row.getVisibleCells() as cell (cell.id)}
						<Table.Cell
							class={cn(
								"truncate whitespace-nowrap",
								cell.column.id === "balance" && "text-right"
							)}
						>
							<FlexRender {cell} />
						</Table.Cell>
					{/each}
				</Table.Row>
			{/each}

			{#if rows.length === 0}
				<Table.Row>
					<Table.Cell
						class="h-24 text-center"
						colspan={table.getVisibleLeafColumns().length}
					>
						No results.
					</Table.Cell>
				</Table.Row>
			{/if}
		</Table.Body>
	</Table.Root>
</div>
