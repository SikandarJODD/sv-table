<script lang="ts" module>
	import { Badge, type BadgeVariant } from "$lib/components/ui/spell/badge";

	import type { Person } from "./fetch-data";

	export { balanceCell, locationCell, nameCell, statusCell };

	const statusVariants = {
		Active: "green",
		Pending: "yellow",
		Inactive: "slate"
	} as const satisfies Record<Person["status"], BadgeVariant>;
</script>

{#snippet nameCell({ name }: { name: string })}
	<div class="truncate font-medium">{name}</div>
{/snippet}

{#snippet locationCell({ flag, location }: { flag: string; location: string })}
	<div class="truncate">
		<span class="text-lg leading-none">{flag}</span>
		{location}
	</div>
{/snippet}

{#snippet statusCell({ status }: { status: Person["status"] })}
	<Badge variant={statusVariants[status]}>{status}</Badge>
{/snippet}

{#snippet balanceCell({ balance }: { balance: number })}
	<div class="text-right tabular-nums">
		{new Intl.NumberFormat("en-US", {
			currency: "USD",
			style: "currency"
		}).format(balance)}
	</div>
{/snippet}
