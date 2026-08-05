<script lang="ts">
	import { Checkbox } from "$lib/components/ui/checkbox";
	import type { ComponentProps } from "svelte";

	type Props = Omit<
		ComponentProps<typeof Checkbox>,
		"checked" | "indeterminate" | "onCheckedChange"
	> & {
		checked: boolean;
		indeterminate?: boolean;
		onCheckedChange: (checked: boolean) => void;
	};

	let {
		checked,
		indeterminate = false,
		onCheckedChange,
		"aria-label": ariaLabel = "Select all rows",
		...restProps
	}: Props = $props();
</script>

<Checkbox
	{checked}
	{indeterminate}
	{onCheckedChange}
	aria-label={ariaLabel}
	{...restProps}
/>
