<script lang="ts" module>
	import type { Snippet } from "svelte";
	import type { ButtonProps } from "$lib/components/ui/button";
	import type { HTMLAttributes } from "svelte/elements";
	import type { WithChildren, WithoutChildren } from "bits-ui";

	export type CopyButtonPropsWithoutHTML = WithChildren<
		Pick<ButtonProps, "size" | "variant"> & {
			ref?: HTMLButtonElement | null;
			text: string;
			icon?: Snippet<[]>;
			animationDuration?: number;
			onCopy?: (status: "success" | "failure" | undefined) => void;
		}
	>;

	export type CopyButtonProps = CopyButtonPropsWithoutHTML &
		WithoutChildren<HTMLAttributes<HTMLButtonElement>>;
</script>

<script lang="ts">
	import Button from "$lib/components/ui/extra/button.svelte";
	import { UseClipboard } from "$lib/hooks/use-clipboard.svelte";
	import { cn, toKebabCaseWithPrefix } from "$lib/utils.js";
	import { mergeProps } from "bits-ui";
	import CheckIcon from "@lucide/svelte/icons/check";
	import CopyIcon from "@lucide/svelte/icons/copy";
	import XIcon from "@lucide/svelte/icons/x";
	import { scale } from "svelte/transition";

	let {
		ref = $bindable(null),
		text,
		icon,
		animationDuration = 500,
		variant = "ghost",
		size = "icon",
		onCopy,
		class: className,
		tabindex = -1,
		children,
		...rest
	}: CopyButtonProps = $props();

	// this way if the user passes text then the button will be the default size
	// svelte-ignore state_referenced_locally
	if (size === "icon" && children) {
		size = "default";
	}

	const clipboard = new UseClipboard();
	let componentName = $derived.by(() => {
		// Get "row-checkbox" from a command ending in "/row-checkbox.json".
		const fileName = text.split("/").at(-1);
		return fileName?.endsWith(".json") ? fileName.slice(0, -5) : undefined;
	});
	let componentEvent = $derived(
		componentName
			? toKebabCaseWithPrefix(componentName, "component")
			: undefined
	);

	const merged = $derived(
		mergeProps(rest, {
			onclick: async () => {
				const status = await clipboard.copy(text);

				onCopy?.(status);
			}
		})
	);
</script>

<Button
	bind:ref
	{variant}
	{size}
	{tabindex}
	class={cn("", className)}
	type="button"
	name="copy"
	{...merged as /* eslint-disable-line @typescript-eslint/no-explicit-any */ any}
	data-s-event={componentEvent}
>
	{#if clipboard.status === "success"}
		<div in:scale={{ duration: animationDuration, start: 0.85 }}>
			<CheckIcon tabindex={-1} class="size-3.5! text-emerald-600" />
			<span class="sr-only">Copied</span>
		</div>
	{:else if clipboard.status === "failure"}
		<div in:scale={{ duration: animationDuration, start: 0.85 }}>
			<XIcon tabindex={-1} />
			<span class="sr-only">Failed to copy</span>
		</div>
	{:else}
		<div in:scale={{ duration: animationDuration, start: 0.85 }}>
			{#if icon}
				{@render icon()}
			{:else}
				<CopyIcon class="size-4" tabindex={-1} />
			{/if}
			<span class="sr-only">Copy</span>
		</div>
	{/if}
	{@render children?.()}
</Button>
