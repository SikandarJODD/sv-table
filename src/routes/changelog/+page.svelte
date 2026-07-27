<script>
	import { changelog } from "$lib/changelog/changelog";
</script>

<section class="font-figtree min-h-[calc(100vh-4rem)] px-4 py-12 sm:py-16">
	<div class="mx-auto w-full max-w-2xl">
		<header class="mb-10">
			<p
				class="mb-2 text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase"
			>
				Updates
			</p>
			<h1 class="text-2xl font-semibold tracking-normal sm:text-3xl">
				Changelog
			</h1>
		</header>

		<div class="space-y-12">
			{#each changelog as entry}
				{@const Entry = entry.component}
				<Entry />
			{/each}
		</div>
	</div>
</section>
