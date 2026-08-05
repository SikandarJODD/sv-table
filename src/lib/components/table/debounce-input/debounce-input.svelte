<script lang="ts">
	import SearchIcon from "@lucide/svelte/icons/search";
	import XIcon from "@lucide/svelte/icons/x";
	import { Debounced, watch } from "runed";

	import * as InputGroup from "$lib/components/ui/input-group/index.js";

	type Props = {
		value?: string;
		onChange?: (value: string) => void;
		class?: string;
		placeholder?: string;
		debounce?: number;
	};

	let {
		value = $bindable(""),
		onChange,
		class: className,
		placeholder = "Search...",
		debounce = 500
	}: Props = $props();

	let inputValue = $state(value);
	const debouncedValue = new Debounced(
		() => inputValue,
		() => debounce
	);

	watch(
		() => value,
		(nextValue) => {
			if (nextValue === inputValue) return;

			inputValue = nextValue;
			debouncedValue.setImmediately(nextValue);
		},
		{ lazy: true }
	);

	watch(
		() => debouncedValue.current,
		(nextValue) => {
			if (nextValue === value) return;

			value = nextValue;
			onChange?.(nextValue);
		},
		{ lazy: true }
	);

	function clearValue() {
		inputValue = "";
	}
</script>

<InputGroup.Root class={className}>
	<InputGroup.Addon align="inline-start">
		<SearchIcon aria-hidden="true" />
	</InputGroup.Addon>

	<InputGroup.Input bind:value={inputValue} {placeholder} />

	{#if inputValue}
		<InputGroup.Addon align="inline-end">
			<InputGroup.Button aria-label="Clear search" onclick={clearValue}>
				<XIcon aria-hidden="true" />
			</InputGroup.Button>
		</InputGroup.Addon>
	{/if}
</InputGroup.Root>
