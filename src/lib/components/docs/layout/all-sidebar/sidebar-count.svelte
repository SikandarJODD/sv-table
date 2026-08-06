<script lang="ts">
	type SidebarCountProps = {
		count: number;
	};

	let { count }: SidebarCountProps = $props();
</script>

<span
	class="border-sidebar-border bg-sidebar-accent text-sidebar-foreground/70 inline-flex h-5 min-w-5 items-center justify-center rounded-full border px-1.5 text-[10px] leading-none font-semibold tabular-nums"
>
	{count}
</span>
