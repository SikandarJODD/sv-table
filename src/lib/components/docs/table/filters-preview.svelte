<script lang="ts">
	import BadgeCheckIcon from "@lucide/svelte/icons/badge-check";
	import CalendarDaysIcon from "@lucide/svelte/icons/calendar-days";
	import HashIcon from "@lucide/svelte/icons/hash";
	import Heading1Icon from "@lucide/svelte/icons/heading-1";
	import TagsIcon from "@lucide/svelte/icons/tags";
	import { format } from "date-fns";

	import { DataTableFilter } from "$lib/components/data-table/components";
	import { createColumnConfigHelper } from "$lib/components/data-table/core/filters";
	import type {
		Column,
		FilterModel
	} from "$lib/components/data-table/core/types";
	import {
		dateFilterFn,
		multiOptionFilterFn,
		numberFilterFn,
		optionFilterFn,
		textFilterFn
	} from "$lib/components/data-table/utils/filter-fns";
	import type { Locale } from "$lib/components/data-table/utils/i18n";
	import { createFilters } from "$lib/hooks";
	import { Badge } from "$lib/components/ui/spell/badge";
	import { Button } from "$lib/components/ui/button";
	import * as Table from "$lib/components/ui/table";

	type IssueStatus = "backlog" | "todo" | "in-progress" | "done";
	type IssueLabel = "api" | "billing" | "design" | "docs" | "ops";

	type Issue = {
		id: string;
		title: string;
		status: IssueStatus;
		estimate: number;
		dueDate: Date;
		labels: IssueLabel[];
	};

	const statusOptions = [
		{ label: "Backlog", value: "backlog" },
		{ label: "Todo", value: "todo" },
		{ label: "In Progress", value: "in-progress" },
		{ label: "Done", value: "done" }
	];

	const labelOptions = [
		{ label: "API", value: "api" },
		{ label: "Billing", value: "billing" },
		{ label: "Design", value: "design" },
		{ label: "Docs", value: "docs" },
		{ label: "Ops", value: "ops" }
	];

	const issues: Issue[] = [
		{
			id: "ISS-101",
			title: "Ship localized filter toolbar",
			status: "in-progress",
			estimate: 8,
			dueDate: new Date("2026-08-04"),
			labels: ["docs", "design"]
		},
		{
			id: "ISS-102",
			title: "Backfill server-side status counts",
			status: "backlog",
			estimate: 13,
			dueDate: new Date("2026-08-12"),
			labels: ["api", "ops"]
		},
		{
			id: "ISS-103",
			title: "Document column builder patterns",
			status: "todo",
			estimate: 5,
			dueDate: new Date("2026-08-02"),
			labels: ["docs"]
		},
		{
			id: "ISS-104",
			title: "Finish billing audit filters",
			status: "done",
			estimate: 3,
			dueDate: new Date("2026-07-30"),
			labels: ["billing", "ops"]
		},
		{
			id: "ISS-105",
			title: "Tune tag filtering for onboarding",
			status: "in-progress",
			estimate: 11,
			dueDate: new Date("2026-08-09"),
			labels: ["api", "design"]
		}
	];

	const localeOptions: Array<{ label: string; value: Locale }> = [
		{ label: "English", value: "en" },
		{ label: "简体中文", value: "zh_CN" }
	];

	const dtf = createColumnConfigHelper<Issue>();

	const columnsConfig = [
		dtf
			.text()
			.id("title")
			.accessor((row) => row.title)
			.displayName("Title")
			.icon(Heading1Icon)
			.build(),
		dtf
			.option()
			.id("status")
			.accessor((row) => row.status)
			.displayName("Status")
			.icon(BadgeCheckIcon)
			.options(statusOptions)
			.build(),
		dtf
			.number()
			.id("estimate")
			.accessor((row) => row.estimate)
			.displayName("Estimate")
			.icon(HashIcon)
			.min(1)
			.max(24)
			.build(),
		dtf
			.date()
			.id("dueDate")
			.accessor((row) => row.dueDate)
			.displayName("Due date")
			.icon(CalendarDaysIcon)
			.build(),
		dtf
			.multiOption()
			.id("labels")
			.accessor((row) => row.labels)
			.displayName("Labels")
			.icon(TagsIcon)
			.options(labelOptions)
			.build()
	] as const;

	const filterController = createFilters({
		strategy: "client",
		data: issues,
		columnsConfig
	});

	const columnsById = new Map(
		filterController.columns.map((column) => [column.id, column] as const)
	);

	let locale = $state<Locale>("en");

	const filteredIssues = $derived.by(() =>
		issues.filter((issue) =>
			filterController.filters.every((filter) =>
				matchesFilter(issue, filter)
			)
		)
	);

	function matchesFilter(issue: Issue, filter: FilterModel) {
		const column = columnsById.get(filter.columnId) as
			| Column<Issue>
			| undefined;

		if (!column) return true;

		const value = column.accessor(issue) as unknown;

		switch (filter.type) {
			case "text":
				return textFilterFn(
					String(value ?? ""),
					filter as FilterModel<"text">
				);
			case "number":
				return numberFilterFn(
					Number(value ?? 0),
					filter as FilterModel<"number">
				);
			case "date":
				return dateFilterFn(
					value as Date,
					filter as FilterModel<"date">
				);
			case "option":
				return optionFilterFn(
					String(value ?? ""),
					filter as FilterModel<"option">
				);
			case "multiOption":
				return multiOptionFilterFn(
					Array.isArray(value) ? (value as string[]) : [],
					filter as FilterModel<"multiOption">
				);
			default:
				return true;
		}
	}

	function getStatusVariant(status: IssueStatus) {
		switch (status) {
			case "done":
				return "emerald";
			case "in-progress":
				return "sky";
			case "todo":
				return "amber";
			default:
				return "secondary";
		}
	}
</script>

<div class="flex w-full flex-col gap-2">
	<DataTableFilter
		columns={filterController.columns}
		filters={filterController.filters}
		actions={filterController.actions}
		strategy={filterController.strategy}
		{locale}
	/>

	<div class="rounded-lg border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Title</Table.Head>
					<Table.Head>Status</Table.Head>
					<Table.Head>Estimate</Table.Head>
					<Table.Head>Due date</Table.Head>
					<Table.Head>Labels</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if filteredIssues.length === 0}
					<Table.Row>
						<Table.Cell
							colspan={5}
							class="py-10 text-center text-sm text-muted-foreground"
						>
							No matching issues. Change or clear the filters to
							see rows again.
						</Table.Cell>
					</Table.Row>
				{:else}
					{#each filteredIssues as issue (issue.id)}
						<Table.Row>
							<Table.Cell class="font-medium"
								>{issue.title}</Table.Cell
							>
							<Table.Cell>
								<Badge variant={getStatusVariant(issue.status)}>
									{statusOptions.find(
										(option) =>
											option.value === issue.status
									)?.label}
								</Badge>
							</Table.Cell>
							<Table.Cell class="tabular-nums"
								>{issue.estimate}h</Table.Cell
							>
							<Table.Cell
								>{format(
									issue.dueDate,
									"MMM d, yyyy"
								)}</Table.Cell
							>
							<Table.Cell>
								<div class="flex flex-wrap gap-1.5">
									{#each issue.labels as label (label)}
										<Badge variant="secondary">
											{labelOptions.find(
												(option) =>
													option.value === label
											)?.label}
										</Badge>
									{/each}
								</div>
							</Table.Cell>
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
</div>
