# Reusable Table Components — Build Order

## Tier 1 — used in almost every example (build first)

- [+] TablePagination — prev / next / page numbers
- [+] PageSizeSelector — "rows per page: 10/20/50" dropdown
- [+] DataTableColumnHeader — sortable header (asc/desc/none icon + hide-column dropdown)
- [+] DebouncedSearchInput — global search box, debounced
- [ ] TableSkeleton — skeleton rows while data loads
- [ ] TableEmptyState — "no results found" placeholder row

## Tier 2 — used across a whole category (build next)

- [ ] DataTableFacetedFilter — multi-select dropdown filter with counts
- [+] DataTableViewOptions — column visibility toggle dropdown
- [+] RowCheckbox — individual row selection checkbox
- [+] SelectAllCheckbox — header checkbox with indeterminate state
- [+] BulkActionsBar — toolbar shown when rows are selected
- [ ] DataTableToolbar — wraps search + faceted filters + view options + reset button
- [ ] RowActionsMenu — "⋮" dropdown (Edit / Delete / View / Duplicate)
- [ ] StatusBadge — colored badge for status/category cell values

## Tier 3 — situational (build when you reach that category)

- [ ] DateRangeFilter — from/to date picker filter
- [ ] NumberRangeFilter — min/max range filter
- [ ] ConfirmDialog — generic "are you sure?" for destructive actions
- [ ] EditableCell — click-to-edit cell with save/cancel
- [ ] ExportButton — CSV/Excel export trigger
- [ ] DragHandle — grip icon for row/column reordering
- [ ] FilterChips — removable badges for active filters
- [ ] TableErrorState — "something went wrong" + retry button

## Suggested build order

1. All of Tier 1 (used even in your first "basic table" example)
2. DataTableToolbar + DataTableFacetedFilter + RowCheckbox/SelectAllCheckbox + BulkActionsBar
   (unlocks Filtering + Row Selection categories at once)
3. Remaining Tier 2 components
4. Tier 3 components, as you reach each specific example
