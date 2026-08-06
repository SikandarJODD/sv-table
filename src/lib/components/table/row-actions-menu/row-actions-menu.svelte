<script lang="ts" module>
	import type { Component } from "svelte";

	export type RowActionState<T> = boolean | ((row: T) => boolean);

	export type RowAction<T> = {
		id: string;
		label: string;
		onSelect: (row: T) => void;
		icon?: Component;
		shortcut?: string;
		variant?: "default" | "destructive";
		disabled?: RowActionState<T>;
		hidden?: RowActionState<T>;
		separatorBefore?: boolean;
	};
</script>

<script lang="ts" generics="T">
	import EllipsisIcon from "@lucide/svelte/icons/ellipsis";

	import { mergeProps } from "bits-ui";

	import { Button } from "$lib/components/ui/button";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { cn } from "$lib/utils.js";

	type Props = {
		row: T;
		actions: RowAction<any>[];
		label?: string;
		menuLabel?: string;
		disabled?: boolean;
		align?: "start" | "center" | "end";
		sideOffset?: number;
		class?: string;
		contentClass?: string;
		open?: boolean;
	};

	let {
		row,
		actions,
		label = "Open row actions",
		menuLabel,
		disabled = false,
		align = "end",
		sideOffset = 4,
		class: className,
		contentClass,
		open = $bindable(false)
	}: Props = $props();

	function resolveState(state: RowActionState<T> | undefined) {
		return typeof state === "function" ? state(row) : (state ?? false);
	}

	let visibleActions = $derived(
		actions.filter((action) => !resolveState(action.hidden))
	);
</script>

<span data-slot="row-actions-menu" class="inline-flex">
	<DropdownMenu.Root bind:open>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				{@const triggerProps = mergeProps(props, {
					onclick: (event: MouseEvent) => event.stopPropagation()
				})}
				<Button
					{...triggerProps}
					variant="ghost"
					size="icon-sm"
					class={cn("size-8", className)}
					disabled={disabled || visibleActions.length === 0}
					aria-label={label}
					title={label}
				>
					<EllipsisIcon />
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>

		<DropdownMenu.Content
			{align}
			{sideOffset}
			class={cn("w-44", contentClass)}
		>
			{#if menuLabel}
				<DropdownMenu.Label>{menuLabel}</DropdownMenu.Label>
				<DropdownMenu.Separator />
			{/if}

			{#each visibleActions as action, index (action.id)}
				{#if action.separatorBefore && index > 0}
					<DropdownMenu.Separator />
				{/if}

				<DropdownMenu.Item
					variant={action.variant ?? "default"}
					disabled={resolveState(action.disabled)}
					onSelect={() => action.onSelect(row)}
					class="cursor-pointer"
				>
					{#if action.icon}
						{@const Icon = action.icon}
						<Icon />
					{/if}
					<span>{action.label}</span>
					{#if action.shortcut}
						<DropdownMenu.Shortcut>
							{action.shortcut}
						</DropdownMenu.Shortcut>
					{/if}
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</span>
