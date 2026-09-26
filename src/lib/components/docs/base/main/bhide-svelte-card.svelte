<script lang="ts">
	import * as Avatar from "$lib/components/ui/avatar/index.js";
</script>

<a
	class="group flex items-center gap-3 rounded-lg border border-border/70 bg-muted/30 p-2 transition-colors hover:bg-muted/70"
	href="https://bhide.dev/?utm_source=sv-chanhdai&utm_medium=referral&utm_campaign=docs-sidebar"
	target="_blank"
	rel="noreferrer"
>
	<Avatar.Root class="size-10 p-0.5">
		<Avatar.Image
			src="https://github.com/SikandarJODD.png"
			alt="Bhide Svelte"
		/>
		<Avatar.Fallback>BS</Avatar.Fallback>
	</Avatar.Root>

	<div class="min-w-0">
		<p class="truncate text-sm font-medium text-foreground">Bhide Svelte</p>
		<p class="truncate text-xs text-muted-foreground">
			I Love Svelte, Animations, Art.
		</p>
	</div>
</a>
