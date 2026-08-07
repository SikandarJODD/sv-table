<script lang="ts">
	import DataTableEmpty from "$table/data-table-empty";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import * as Table from "$lib/components/ui/table";

	const people = [
		{ name: "Maya Chen", email: "maya@example.com", role: "Designer" },
		{ name: "Aarav Patel", email: "aarav@example.com", role: "Engineer" },
		{ name: "Sofia Garcia", email: "sofia@example.com", role: "Manager" }
	];

	let query = $state("");

	const filteredPeople = $derived.by(() => {
		const search = query.trim().toLowerCase();

		if (!search) return people;

		return people.filter((person) =>
			[person.name, person.email, person.role].some((value) =>
				value.toLowerCase().includes(search)
			)
		);
	});
</script>

<div class="w-full space-y-3">
	<Input
		bind:value={query}
		type="search"
		placeholder="Search people..."
		aria-label="Search people"
		class="max-w-sm"
	/>

	<div class="w-full overflow-hidden rounded-lg border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Name</Table.Head>
					<Table.Head>Email</Table.Head>
					<Table.Head>Role</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each filteredPeople as person (person.email)}
					<Table.Row>
						<Table.Cell class="font-medium"
							>{person.name}</Table.Cell
						>
						<Table.Cell>{person.email}</Table.Cell>
						<Table.Cell>{person.role}</Table.Cell>
					</Table.Row>
				{:else}
					<DataTableEmpty
						colspan={3}
						title="No people found"
						description="No rows match your search."
					>
						{#snippet actions()}
							<Button
								variant="outline"
								size="sm"
								onclick={() => (query = "")}
							>
								Clear search
							</Button>
						{/snippet}
					</DataTableEmpty>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>
