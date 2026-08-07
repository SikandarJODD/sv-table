<script lang="ts">
	import SearchXIcon from "@lucide/svelte/icons/search-x";
	import type { Snippet } from "svelte";

	import * as Empty from "$lib/components/ui/empty";
	import * as Table from "$lib/components/ui/table";
	import { cn } from "$lib/utils.js";

	type Props = {
		colspan: number;
		title?: string;
		description?: string;
		icon?: Snippet;
		actions?: Snippet;
		class?: string;
	};

	let {
		colspan,
		title = "No results found",
		description = "There are no rows to display.",
		icon,
		actions,
		class: className
	}: Props = $props();
</script>

<Table.Row class="hover:bg-transparent">
	<Table.Cell {colspan} class="p-0">
		<Empty.Root class={cn("min-h-52 rounded-none p-6", className)}>
			<Empty.Header>
				<Empty.Media variant="icon">
					{#if icon}
						{@render icon()}
					{:else}
						<SearchXIcon strokeWidth={1.4} />
					{/if}
				</Empty.Media>
				<Empty.Title>{title}</Empty.Title>
				{#if description}
					<Empty.Description>{description}</Empty.Description>
				{/if}
			</Empty.Header>

			{#if actions}
				<Empty.Content>
					{@render actions()}
				</Empty.Content>
			{/if}
		</Empty.Root>
	</Table.Cell>
</Table.Row>
