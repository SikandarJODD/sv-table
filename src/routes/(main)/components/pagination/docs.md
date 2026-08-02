# Pagination

Two table pagination components: `pagination` for numbered links and `pagination-arrow` for compact arrow controls.

## Number pagination

Use `pagination` when users should jump between pages directly.

### Install

```txt
registry: https://sv-table.vercel.app/r/pagination.json
npm: npx shadcn-svelte@latest add https://sv-table.vercel.app/r/pagination.json
pnpm: pnpm dlx shadcn-svelte@latest add https://sv-table.vercel.app/r/pagination.json
```

### Usage

```svelte
<script lang="ts">
  import Pagination from "$lib/components/table/pagination";

  let currentPage = $state(3);
  const pageCount = 12;

  const canPreviousPage = $derived(currentPage > 1);
  const canNextPage = $derived(currentPage < pageCount);

  function onPrevious() {
    if (!canPreviousPage) return;
    currentPage -= 1;
  }

  function onNext() {
    if (!canNextPage) return;
    currentPage += 1;
  }

  function onGoToPage(page: number) {
    currentPage = page;
  }
</script>

<Pagination
  {currentPage}
  {pageCount}
  {canPreviousPage}
  {canNextPage}
  {onPrevious}
  {onNext}
  {onGoToPage}
/>
```

### Props

`currentPage`, `pageCount`, `canPreviousPage`, `canNextPage`, `onPrevious`, `onNext`, `onGoToPage`, `siblingCount`

## Arrow pagination

Use `pagination-arrow` when you want a compact footer with item range text and arrow buttons.

### Install

```txt
registry: https://sv-table.vercel.app/r/pagination-arrow.json
npm: npx shadcn-svelte@latest add https://sv-table.vercel.app/r/pagination-arrow.json
pnpm: pnpm dlx shadcn-svelte@latest add https://sv-table.vercel.app/r/pagination-arrow.json
packages: @lucide/svelte
```

### Usage

```svelte
<script lang="ts">
  import PaginationArrow from "$lib/components/table/pagination-arrow";

  let currentPage = $state(2);
  const pageCount = 8;
  const pageSize = 10;
  const totalItems = 73;

  const canPreviousPage = $derived(currentPage > 1);
  const canNextPage = $derived(currentPage < pageCount);

  function onPrevious() {
    if (!canPreviousPage) return;
    currentPage -= 1;
  }

  function onNext() {
    if (!canNextPage) return;
    currentPage += 1;
  }

  function onGoToPage(page: number) {
    currentPage = page;
  }
</script>

<PaginationArrow
  {currentPage}
  {pageCount}
  {canPreviousPage}
  {canNextPage}
  {onPrevious}
  {onNext}
  {onGoToPage}
  {pageSize}
  {totalItems}
/>
```

### Props

`currentPage`, `pageCount`, `canPreviousPage`, `canNextPage`, `onPrevious`, `onNext`, `onGoToPage`, `siblingCount`, `pageSize`, `totalItems`, `class`

## Examples

Coming soon.

## Guides & blogs

- [Design Better Pagination](https://coyleandrew.medium.com/design-better-pagination-a022a3b161e1)
- [Pagination UI Guide](https://www.eleken.co/blog-posts/pagination-ui)
