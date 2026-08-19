<script>
	import { FaviconLink } from "$markdown";
</script>

<footer class="relative">
	<div class="relative border-t border-border/50">
		<p
			class="flex items-center justify-center gap-1 py-3 text-center text-xs text-muted-foreground sm:text-sm"
		>
			Built with ❤️ by
			<!-- <a
				class="ml-2 inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-muted-foreground"
				href="https://bhide.dev"
				rel="noreferrer"
				target="_blank"
			>
				<img
					alt="Bhide Svelte avatar"
					class="size-5 rounded-full border border-border/80 object-cover"
					height="20"
					src="https://avatars.githubusercontent.com/u/93428946?v=4"
					width="20"
				/>
				Bhide Svelte
			</a> -->
			<FaviconLink
				class="rounded-sm bg-amber-100/60 pr-1 text-sm text-amber-500 hover:text-amber-600 dark:bg-amber-900/40"
				href="https://bhide.dev"
				imageClass="size-4.5 rounded-full dark:border-amber-600 object-cover"
				alt="Bhide Svelte avatar"
				rel="noreferrer"
				target="_blank">Bhide Svelte</FaviconLink
			>
		</p>
	</div>
</footer>
