<script lang="ts">
	import { seo_config } from "$lib/config/seo";

	const currentYear = new Date().getFullYear();
</script>

<footer class="relative">
	<div class="relative border-t border-border/50">
		<p
			class="s flex items-center justify-center py-3 text-center text-xs text-muted-foreground sm:text-xs"
		>
			Built with ❤️ by
			<a
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
			</a>
		</p>
	</div>
</footer>
