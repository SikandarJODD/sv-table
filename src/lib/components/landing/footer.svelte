<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { github_repo } from "$lib/config/repo";
	import { seo_config } from "$lib/config/seo";
	import { Github, X as XLogo } from "$lib/svg";
	import { MoonIcon, SunIcon } from "@lucide/svelte";
	import { mode, toggleMode } from "mode-watcher";

	type FooterLink = {
		label: string;
		href: string;
		external?: boolean;
	};

	const productLinks: FooterLink[] = [
		{ label: "Home", href: "/" },
		{ label: "Blocks", href: "/blocks" },
		{ label: "Changelog", href: "/changelog" }
	];
	const socialLinks = [
		{
			id: "x",
			label: "X",
			href: "https://x.com/Sikandar_Bhide"
		},
		{
			id: "github",
			label: "GitHub",
			href: github_repo.url
		}
	] as const;

	const currentYear = new Date().getFullYear();
</script>

<footer class="relative">
	<div class="relative border-t border-border/50">
			<p
				class="flex items-center justify-center py-3 text-center text-xs text-muted-foreground sm:text-xs"
			>
				&copy; {currentYear}
				{seo_config.title}. Built by
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
