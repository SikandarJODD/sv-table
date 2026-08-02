# TanStack Svelte Table v9 + SvelteKit — Example Roadmap

## 0. Foundations (v9-specific, do these first)

- [ ] Install & project setup (`@tanstack/svelte-table` v9 + SvelteKit)
- [ ] Basic table with explicit feature registration (`createTable`, `tableFeatures`, `_rowModels`)
- [ ] Rendering cells with `FlexRender`
- [ ] Rendering a Svelte component in a cell (`renderComponent`)
- [ ] Rendering a Svelte snippet in a cell (`renderSnippet`)
- [ ] Understanding table state & atoms (`table.state.x` vs `table.atoms.x.get()`)
- [ ] Controlling state with an external atom (`createAtom`, `useSelector`)
- [ ] Setting `initialState` (default sort/visibility/pagination on load)

## 1. Sorting

- [ ] Single-column sort
- [ ] Multi-column sort (shift-click)
- [ ] Custom sort function (`sortFns`)
- [ ] Disable sorting on specific column
- [ ] Sortable header component with asc/desc/none icon states
- [ ] Sort with external atom (persist across navigation)

## 2. Filtering

- [ ] Global search filter
- [ ] Per-column text filter
- [ ] Faceted filter (multi-select dropdown w/ counts)
- [ ] Range filter (min/max numbers, date range)
- [ ] Debounced filter input
- [ ] Custom filter function (`filterFns`)
- [ ] Combined global + column filters

## 3. Pagination

- [ ] Client-side pagination
- [ ] Manual/server-side pagination
- [ ] Page size selector
- [ ] Simple prev/next controls
- [ ] Numbered pagination with ellipsis
- [ ] Pagination state via external atom (synced to URL)

## 4. Row Selection

- [ ] Single row select (radio-style)
- [ ] Multi-row select with checkboxes
- [ ] Select-all header checkbox (indeterminate state)
- [ ] Bulk action bar for selected rows (delete/export/tag)
- [ ] Row selection persisted across pagination

## 5. Column Features

- [ ] Column visibility toggle (show/hide dropdown)
- [ ] Column reordering (drag-and-drop)
- [ ] Column resizing
- [ ] Column pinning (sticky left/right)
- [ ] Grouped/nested column headers
- [ ] Column-level custom meta (e.g. align, width, format type)

## 6. Row Features

- [ ] Expandable rows (detail panel)
- [ ] Row grouping with aggregation (sum/avg/count)
- [ ] Nested sub-table inside an expanded row
- [ ] Row reordering (drag-and-drop)
- [ ] Row actions dropdown (edit/delete/view)
- [ ] Conditional row styling (e.g. highlight based on status)

## 7. Editing / Mutations

- [ ] Inline cell editing (click to edit)
- [ ] Editable row with save/cancel buttons
- [ ] Add new row
- [ ] Delete row with confirmation dialog
- [ ] Field validation on edit
- [ ] Optimistic update + rollback on error

## 8. Data Fetching (SvelteKit-specific)

- [ ] Server-side data via `load` function
- [ ] Loading skeleton while data streams in
- [ ] Debounced search hitting a `+server.ts` API route
- [ ] Server-side sorting/filtering/pagination combined
- [ ] Infinite scroll / "load more"
- [ ] Form actions for row mutations (`use:enhance`)

## 9. Performance

- [ ] Row virtualization for large datasets (TanStack Virtual)
- [ ] Memoized column definitions
- [ ] Tree-shaking check: only import features you use (v9 bundle-size demo)
- [ ] Large dataset stress test (10k+ rows)

## 10. Theming & Responsiveness

- [ ] shadcn-svelte `<Table />` styling integration
- [ ] Dark mode support
- [ ] Responsive table → card view on mobile
- [ ] Sticky header + sticky footer with column totals

## 11. Advanced / Combined

- [ ] "Kitchen sink" table: sort + filter + pagination + selection + visibility together
- [ ] Editable spreadsheet-style grid
- [ ] Tree/hierarchical data table
- [ ] Export to CSV/Excel
- [ ] URL-synced state (sort/filter/page reflected in query params)
- [ ] Multiple independent tables on one page
- [ ] Table inside a form (e.g. with Superforms)

## 12. Real-World Patterns

- [ ] Admin user management table
- [ ] E-commerce product/inventory table
- [ ] Transaction/payments table (the classic shadcn demo, rebuilt in v9)
- [ ] Task/project tracker table (Kanban-adjacent)
- [ ] Analytics dashboard table with charts in cells
