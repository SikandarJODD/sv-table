# Svelte dnd kit

[https://dndkit.com/svelte/quickstart/](quickstart)

---

### Create Sortable

[https://dndkit.com/svelte/primitives/create-sortable/](sortable guide)

### Sortable Example

File: HorizontalSortableItem.svelte

```svelte
<script lang="ts">
  import { createSortable } from "@dnd-kit/svelte/sortable";

  let { id, index }: { id: number; index: number } = $props();

  const sortable = createSortable({
    get id() {
      return id;
    },
    get index() {
      return index;
    }
  });
</script>

<div
  {@attach sortable.attach}
  class="item"
  data-shadow={sortable.isDragging ? "true" : undefined}
  style="aspect-ratio: 1; justify-content: center;"
>
  {id}
</div>
```

File: App.svelte

```svelte
<script lang="ts">
  import { DragDropProvider } from "@dnd-kit/svelte";
  import { move } from "@dnd-kit/helpers";
  import HorizontalSortableItem from "./HorizontalSortableItem.svelte";

  let items = $state(Array.from({ length: 10 }, (_, i) => i + 1));
  let snapshot: number[] = [];

  function onDragStart() {
    snapshot = items.slice();
  }

  function onDragOver(event: any) {
    items = move(items, event);
  }

  function onDragEnd(event: any) {
    if (event.canceled) items = snapshot;
  }
</script>

<DragDropProvider {onDragStart} {onDragOver} {onDragEnd}>
  <div
    style="display: inline-flex; flex-direction: row; align-items: stretch; height: 180px; gap: 18px; padding: 0 30px;"
  >
    {#each items as id, index (id)}
      <HorizontalSortableItem {id} {index} />
    {/each}
  </div>
</DragDropProvider>
```
