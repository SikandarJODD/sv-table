<script lang="ts">
	type SidebarCountProps = {
		count: number;
	};

	let { count }: SidebarCountProps = $props();
</script>

<span class="text-[10px] text-ink/80 tabular-nums dark:text-emerald-500">
	{count}
</span>
