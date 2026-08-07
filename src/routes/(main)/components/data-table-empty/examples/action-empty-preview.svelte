<script lang="ts">
	import DataTableEmpty from "$table/data-table-empty";
	import { Button } from "$lib/components/ui/button";
	import * as Table from "$lib/components/ui/table";

	const rows = [
		{ name: "Maya Chen", status: "Active", team: "Design" },
		{ name: "Aarav Patel", status: "Active", team: "Engineering" }
	];

	let filtersApplied = $state(true);
</script>

<div class="w-full overflow-hidden rounded-lg border">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Name</Table.Head>
				<Table.Head>Status</Table.Head>
				<Table.Head>Team</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#if filtersApplied}
				<DataTableEmpty
					colspan={3}
					title="No matching rows"
					description="Try clearing the current filters."
				>
					{#snippet actions()}
						<Button
							variant="outline"
							size="sm"
							onclick={() => (filtersApplied = false)}
						>
							Clear filters
						</Button>
					{/snippet}
				</DataTableEmpty>
			{:else}
				{#each rows as row (row.name)}
					<Table.Row>
						<Table.Cell class="font-medium">{row.name}</Table.Cell>
						<Table.Cell>{row.status}</Table.Cell>
						<Table.Cell>{row.team}</Table.Cell>
					</Table.Row>
				{/each}
			{/if}
		</Table.Body>
	</Table.Root>
</div>
