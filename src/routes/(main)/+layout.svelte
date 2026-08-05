<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import Toc from "$lib/components/docs/base/toc/toc.svelte";
	import DocsNavigation from "$lib/components/docs/layout/navigation/docs-navigation.svelte";
	import { UseToc } from "$lib/hooks/use-toc.svelte";
	import { getPrevNext } from "$lib/registry/components";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import AppSidebar from "$lib/components/docs/layout/all-sidebar/app-sidebar.svelte";
	import ContributeCard from "$lib/components/docs/base/main/contribute-card.svelte";

	let { children } = $props();

	let toc = new UseToc();

	let navigation = $derived.by(() => {
		let { prev, next } = getPrevNext(page.url.pathname || "/docs");
		return {
			previous: prev
				? { title: prev.name, href: prev.href, desc: prev.desc }
				: null,
			next: next
				? { title: next.name, href: next.href, desc: next.desc }
				: null
		};
	});

	function isTypingTarget(target: EventTarget | null) {
		if (!(target instanceof HTMLElement)) return false;
		if (target.isContentEditable) return true;

		const interactiveSelector =
			"input, textarea, select, [contenteditable='true']";
		return target.closest(interactiveSelector) !== null;
	}

	function navigateTo(link: { href: string } | null) {
		if (!link) return;
		void goto(link.href);
	}

	function handleArrowNavigation(event: KeyboardEvent) {
		if (event.defaultPrevented) return;
		if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)
			return;
		if (isTypingTarget(event.target)) return;

		if (event.key === "ArrowLeft" && navigation.previous) {
			event.preventDefault();
			navigateTo(navigation.previous);
		}

		if (event.key === "ArrowRight" && navigation.next) {
			event.preventDefault();
			navigateTo(navigation.next);
		}
	}
</script>

<svelte:window onkeydown={handleArrowNavigation} />

<Sidebar.Provider>
	<AppSidebar />
	<div
		class="mx-auto flex w-full max-w-7xl items-start gap-x-8 px-4 py-6 sm:px-6 lg:gap-x-16 lg:pr-4 lg:pl-10"
	>
		<main class="w-full sm:max-w-4xl" bind:this={toc.ref}>
			<!-- Main area -->
			{@render children()}

			<!-- Prev/Next Navigation -->
			<DocsNavigation
				previous={navigation.previous}
				next={navigation.next}
			/>
		</main>

		<aside class="sticky top-21 hidden w-56 shrink-0 xl:block">
			<div class="flex max-h-[calc(100vh-7rem)] min-h-0 flex-col">
				<div>
					<h2 class="mb-2 text-sm font-medium">On this page</h2>
				</div>
				<div class="min-h-0 flex-1 overflow-y-auto pr-2">
					<Toc toc={toc.current}></Toc>
				</div>
				<ContributeCard class="mt-auto" />
			</div>
		</aside>
	</div>
</Sidebar.Provider>
