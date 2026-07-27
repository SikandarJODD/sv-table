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

	const resourceLinks: FooterLink[] = [
		{ label: "Docs", href: "/docs" },
		{
			label: "GitHub",
			href: "https://github.com/SikandarJODD/sv-efferd",
			external: true
		},
		{
			label: "X / Twitter",
			href: "https://x.com/Sikandar_Bhide",
			external: true
		}
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

<div>
	<footer class="relative">
		<div class="relative mx-auto max-w-6xl">
			<div class="grid gap-10 py-12 lg:grid-cols-5">
				<div class="col-span-4 flex flex-col gap-6">
					<div class="space-y-3">
						<a
							aria-label="Svelte Efferd home"
							class="inline-flex w-fit rounded-md font-mono text-xl font-semibold tracking-tight transition-colors hover:text-foreground/80"
							href="/"
						>
							{seo_config.title}
						</a>
						<p class="max-w-sm text-sm text-muted-foreground">
							Less effort. More effect.
						</p>
					</div>

					<div class="flex flex-wrap items-center gap-2">
						<Button
							onclick={toggleMode}
							variant="outline"
							size="icon-sm"
						>
							{#if mode.current === "dark"}
								<SunIcon class="size-4" />
							{:else}
								<MoonIcon class="size-4" />
							{/if}
						</Button>

						{#each socialLinks as social (social.id)}
							<Button
								aria-label={social.label}
								href={social.href}
								rel="noreferrer"
								size="icon-sm"
								target="_blank"
								variant="ghost"
							>
								{#if social.id === "x"}
									<XLogo class="size-4" />
								{:else}
									<Github class="size-4" />
								{/if}
							</Button>
						{/each}
					</div>
				</div>

				<div class="space-y-4">
					<h2
						class="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase"
					>
						Product
					</h2>

					<nav class="flex flex-col gap-3">
						{#each productLinks as link (link.label)}
							<a
								class="w-fit text-sm text-muted-foreground transition-colors hover:text-foreground"
								href={link.href}
							>
								{link.label}
							</a>
						{/each}
					</nav>
				</div>
			</div>
		</div>
		<div class="relative border-t border-border/50">
			<div class="relative">
				<p
					class="flex items-center justify-center py-3 text-center text-xs text-muted-foreground sm:text-xs"
				>
					&copy; {currentYear}
					{seo_config.title}. Built by
					<a
						class="ml-2 inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-muted-foreground"
						href={github_repo.url}
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
		</div>
	</footer>
</div>
