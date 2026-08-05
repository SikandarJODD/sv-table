<script lang="ts">
	import { Checkbox } from "$lib/components/ui/checkbox";
	import type { ComponentProps } from "svelte";

	type Props = Omit<
		ComponentProps<typeof Checkbox>,
		"checked" | "onCheckedChange"
	> & {
		checked: boolean;
		onCheckedChange: (checked: boolean) => void;
	};

	let {
		checked,
		onCheckedChange,
		"aria-label": ariaLabel = "Select row",
		...restProps
	}: Props = $props();
</script>

<Checkbox {checked} {onCheckedChange} aria-label={ariaLabel} {...restProps} />
