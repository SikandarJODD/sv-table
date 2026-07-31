<script lang="ts">
	import { PMCommand } from "$lib/components/ui/pm-command";
	import { CodeSpan, H2, Paragraph } from "$markdown";
	import * as Item from "$lib/components/ui/item/index.js";
	import { Button } from "$lib/components/ui/button";

	interface Props {
		componentURL: string;
	}

	let { componentURL }: Props = $props();
</script>

<section class="space-y-4">
	<H2 id="installation">Installation</H2>

	<div class="max-w-3xl space-y-3">
		<Paragraph>
			Install the registry block first. The package ships with the UI
			components, core column types, helper utilities, and locale files.
		</Paragraph>
	</div>

	<PMCommand
		command="execute"
		args={["shadcn-svelte@latest", "add", componentURL]}
	/>
	<div class="flex w-full flex-col gap-6">
		<Item.Root variant="outline">
			<Item.Media variant="icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="64"
					height="64"
					viewBox="0 0 24 24"
					fill="none"
					><path
						d="M8 15.25C7.58579 15.25 7.25 15.5858 7.25 16C7.25 16.4142 7.58579 16.75 8 16.75H16C16.4142 16.75 16.75 16.4142 16.75 16C16.75 15.5858 16.4142 15.25 16 15.25H8Z"
						fill="currentColor"
					></path>
					<path
						d="M7.25 12C7.25 11.5858 7.58579 11.25 8 11.25H16C16.4142 11.25 16.75 11.5858 16.75 12C16.75 12.4142 16.4142 12.75 16 12.75H8C7.58579 12.75 7.25 12.4142 7.25 12Z"
						fill="currentColor"
					></path>
					<path
						d="M8 7.25C7.58579 7.25 7.25 7.58579 7.25 8C7.25 8.41421 7.58579 8.75 8 8.75H12C12.4142 8.75 12.75 8.41421 12.75 8C12.75 7.58579 12.4142 7.25 12 7.25H8Z"
						fill="currentColor"
					></path>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M14.9326 1.25H9.06739C8.11495 1.24999 7.35439 1.24999 6.74013 1.30018C6.11012 1.35165 5.56824 1.45963 5.07054 1.71322C4.27085 2.12068 3.62068 2.77085 3.21322 3.57054C2.95963 4.06824 2.85165 4.61012 2.80018 5.24013C2.74999 5.85439 2.74999 6.61494 2.75 7.56738V16.4326C2.74999 17.3851 2.74999 18.1456 2.80018 18.7599C2.85165 19.3899 2.95963 19.9318 3.21322 20.4295C3.62068 21.2291 4.27085 21.8793 5.07054 22.2868C5.56824 22.5404 6.11012 22.6483 6.74013 22.6998C7.3544 22.75 8.11495 22.75 9.06741 22.75H14.9325C15.885 22.75 16.6456 22.75 17.2599 22.6998C17.8899 22.6483 18.4318 22.5404 18.9295 22.2868C19.7292 21.8793 20.3793 21.2291 20.7868 20.4295C21.0404 19.9318 21.1483 19.3899 21.1998 18.7599C21.25 18.1456 21.25 17.3851 21.25 16.4327V7.56737C21.25 6.61496 21.25 5.85438 21.1998 5.24013C21.1483 4.61012 21.0404 4.06824 20.7868 3.57054C20.3793 2.77085 19.7292 2.12068 18.9295 1.71322C18.4318 1.45963 17.8899 1.35165 17.2599 1.30018C16.6456 1.24999 15.8851 1.24999 14.9326 1.25ZM5.75153 3.04973C6.00252 2.92184 6.32503 2.83909 6.86228 2.79519C7.40829 2.75058 8.10753 2.75 9.1 2.75H14.9C15.8925 2.75 16.5917 2.75058 17.1377 2.79519C17.675 2.83909 17.9975 2.92184 18.2485 3.04973C18.7659 3.31338 19.1866 3.73408 19.4503 4.25153C19.5782 4.50252 19.6609 4.82503 19.7048 5.36228C19.7494 5.90829 19.75 6.60753 19.75 7.6V16.4C19.75 17.3925 19.7494 18.0917 19.7048 18.6377C19.6609 19.175 19.5782 19.4975 19.4503 19.7485C19.1866 20.2659 18.7659 20.6866 18.2485 20.9503C17.9975 21.0782 17.675 21.1609 17.1377 21.2048C16.5917 21.2494 15.8925 21.25 14.9 21.25H9.1C8.10753 21.25 7.40829 21.2494 6.86228 21.2048C6.32503 21.1609 6.00252 21.0782 5.75153 20.9503C5.23408 20.6866 4.81338 20.2659 4.54973 19.7485C4.42184 19.4975 4.33909 19.175 4.29519 18.6377C4.25058 18.0917 4.25 17.3925 4.25 16.4V7.6C4.25 6.60753 4.25058 5.90829 4.29519 5.36228C4.33909 4.82503 4.42184 4.50252 4.54973 4.25153C4.81338 3.73408 5.23408 3.31338 5.75153 3.04973Z"
						fill="currentColor"
					></path></svg
				>
			</Item.Media>
			<Item.Content>
				<Item.Title>Visit Bazza UI Docs</Item.Title>
				<Item.Description>
					for more information visit Bazza UI Docs
				</Item.Description>
			</Item.Content>
			<Item.Actions>
				<Button size="sm" variant="outline">Visit Docs</Button>
			</Item.Actions>
		</Item.Root>
	</div>
</section>
