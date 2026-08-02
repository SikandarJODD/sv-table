<script lang="ts">
	import { H2, UnorderedList, ListItem, Link } from "$markdown";
	import { guides } from "../data";
</script>

<section class="space-y-2">
	<H2 id="guides-and-blogs">Guides &amp; blogs</H2>
	<UnorderedList class="mt-0">
		{#each guides as guide (guide.href)}
			<ListItem>
				<Link
					href={guide.href}
					target="_blank"
					rel="noopener noreferrer"
				>
					{guide.label}
				</Link>
			</ListItem>
		{/each}
	</UnorderedList>
</section>
