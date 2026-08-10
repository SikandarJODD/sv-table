<script lang="ts">
	import { ArrowRight } from "@lucide/svelte";
	import { Button } from "$lib/components/ui/button";
	import { Blocks } from "../icons";
</script>

<section
	class="mx-auto flex min-h-[calc(100vh-11rem)] w-full max-w-6xl items-center overflow-hidden px-4 py-10 sm:py-16 md:min-h-[calc(100vh-6.5rem)] md:px-6 md:py-24"
>
	<!-- <div aria-hidden="true" class="absolute inset-0 size-full overflow-hidden">
		<div
			class="absolute inset-0 isolate -z-10 bg-[radial-gradient(20%_80%_at_20%_0%,color-mix(in_oklab,var(--foreground)_10%,transparent),transparent)]"
		></div>
	</div> -->

	<div
		class="relative z-10 flex w-full max-w-3xl flex-col items-start justify-center gap-5 sm:gap-6"
	>
		<a
			class="group flex w-fit animate-in items-center gap-3 rounded-full border bg-card p-1 shadow-xs transition-all delay-500 duration-500 ease-out fill-mode-backwards slide-in-from-bottom-10 fade-in"
			href="/blocks"
		>
			<div class="rounded-full border bg-card px-2 py-0.5 shadow-sm">
				<p class="font-mono text-xs">New</p>
			</div>

			<span class="text-xs">11 new blocks</span>
			<span class="block h-5 border-l"></span>

			<div class="pr-1">
				<ArrowRight
					class="size-3 -translate-x-0.5 duration-150 ease-out group-hover:translate-x-0.5"
				/>
			</div>
		</a>

		<h1
			class="max-w-2xl animate-in text-4xl leading-tight font-medium text-balance text-foreground delay-100 duration-500 ease-out fill-mode-backwards slide-in-from-bottom-10 fade-in md:text-5xl lg:text-6xl"
		>
			Svelte Datatables Components & Examples
		</h1>

		<p
			class="max-w-2xl animate-in text-sm leading-7 text-muted-foreground delay-200 duration-500 ease-out fill-mode-backwards slide-in-from-bottom-10 fade-in sm:text-base md:text-lg"
		>
			Explore filter components, documentation, and practical examples
			built with TanStack Table v9 for Svelte.
		</p>

		<div
			class="mt-3 flex w-fit animate-in flex-wrap items-center gap-3 delay-300 duration-500 ease-out fill-mode-backwards slide-in-from-bottom-10 fade-in"
		>
			<Button
				variant="blue"
				class="rounded-full px-4"
				href="/docs"
				size="lg"
			>
				Get Started
				<ArrowRight class="size-4" />
			</Button>
			<Button
				class="rounded-full px-4 shadow-none"
				href="/docs/introduction"
				variant="outline"
				size="lg"
			>
				<Blocks class="size-4" />
				View Components
			</Button>
		</div>
	</div>
</section>
