<script lang="ts">
	import { page } from "$app/state";
	import CopyPageDropdown from "$lib/components/docs/base/main/copy-page-dropdown.svelte";
	import Seo from "$lib/components/docs/base/main/seo.svelte";
	import { H1, H2, Paragraph, Steps, Step, Divider } from "$markdown";
	import { PMCommand } from "$lib/components/ui/pm-command";

	let getURLPath = (url: string) => {
		return url.split("?")[0].split("#")[0];
	};

	let llmsTxtUrl = $derived(`${getURLPath(page.url.href)}/llms.txt`);
</script>

<Seo
	title="Installation"
	description="Install SvelteKit, initialize shadcn-svelte, and start adding components with the Svelte Component Setup workflow."
	keywords={["sveltekit", "installation", "shadcn-svelte", "tailwind css", "docs"]}
/>

<div class="space-y-8">
	<section class="space-y-3">
		<div class="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-4">
			<H1 id="installation">Installation</H1>
			<CopyPageDropdown componentName="Installation" {llmsTxtUrl} />
		</div>
		<div class="mt-3 max-w-2xl">
			<Paragraph>
				Set up a new SvelteKit app first, then initialize shadcn-svelte so
				you can continue with the Tailwind CSS based component workflow.
			</Paragraph>
		</div>
	</section>

	<section>
		<Steps>
			<Step title="Install SvelteKit">
				<p class="mb-4">
					Create a fresh SvelteKit project as the base for your setup.
					Once the app is ready, you can continue with Tailwind CSS and
					component tooling.
				</p>
				<PMCommand command="execute" args={["sv", "create", "my-app"]} />
			</Step>

			<Step title="Initialize shadcn-svelte">
				<p class="mb-4">
					Run the shadcn-svelte initializer inside your SvelteKit app to
					set up the required project configuration.
				</p>
				<PMCommand command="execute" args={["shadcn-svelte@latest", "init"]} />
			</Step>
		</Steps>
	</section>

	<section class="space-y-4">
		<Divider />
		<H2 id="how-to-use-it">How to use it</H2>
		<PMCommand
			command="execute"
			args={["shadcn-svelte@latest", "add", "button"]}
		/>
	</section>
</div>
