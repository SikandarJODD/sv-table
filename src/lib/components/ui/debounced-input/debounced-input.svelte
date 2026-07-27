<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { watch } from 'runed';

	import { Input } from '$lib/components/ui/input';
	import { debounce } from '$lib/components/data-table/utils/debounce';

	type InputProps = ComponentProps<typeof Input>;
	type DebouncedValue = string | number | undefined;
	type InputType = Exclude<InputProps['type'], 'file'>;

	type Props = Omit<InputProps, 'type' | 'value' | 'files'> & {
		value?: DebouncedValue;
		type?: InputType;
		debounce?: number;
		onChange?: (value: DebouncedValue) => void;
		files?: never;
	};

	let {
		ref = $bindable(null),
		value = $bindable(),
		type = 'text',
		debounce: debounceMs = 500,
		onChange,
		...restProps
	}: Props = $props();

	let localValue: DebouncedValue = $state(value);
	let syncingFromValue = false;

	watch(
		() => value,
		(nextValue) => {
			if (nextValue === localValue) return;

			syncingFromValue = true;
			localValue = nextValue;
		}
	);

	watch(
		[() => localValue, () => debounceMs],
		([nextValue, nextDebounce]) => {
			if (syncingFromValue) {
				syncingFromValue = false;
				return;
			}

			const debouncedChange = debounce((resolvedValue: DebouncedValue) => {
				value = resolvedValue;
				onChange?.(resolvedValue);
			}, nextDebounce);

			debouncedChange(nextValue);

			return () => {
				debouncedChange.cancel();
			};
		},
		{ lazy: true }
	);
</script>

<Input bind:ref bind:value={localValue} {type} {...restProps} />
