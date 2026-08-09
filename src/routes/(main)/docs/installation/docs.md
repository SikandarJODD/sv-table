# Installation & Setup

Prepare a new SvelteKit project for reusable data table components. This setup installs the UI foundation and table engine before you add the components your project needs.

## Setup

### 1. Create a new SvelteKit project

Create a fresh SvelteKit app, then open the new project directory.

```sh
pnpm dlx sv create my-app
```

### 2. Add shadcn-svelte

Run the initializer from your SvelteKit project. It configures the component aliases, utilities, and styling used by the registry components.

```sh
pnpm dlx shadcn-svelte@latest init
```

### 3. Install TanStack Table

Add the headless table engine that manages table state, filtering, sorting, pagination, and row selection.

```sh
pnpm add @tanstack/svelte-table
```

See the [TanStack Table v9 overview](https://tanstack.com/table/v9/docs/overview) for its core concepts and APIs.

### 4. Add the table alias

Add the `$table` alias inside `svelte.config.ts` so table component imports stay short and consistent.

```ts
kit: {
	alias: {
		"$table": "src/lib/components/table"
	}
}
```

### 5. Install pagination

Start with the numbered pagination component. The installer also adds any shadcn-svelte dependencies it requires.

```sh
pnpm dlx shadcn-svelte@latest add https://sv-table.vercel.app/r/pagination.json
```

### 6. Choose the components you need

Add only what your table needs, such as filters, debounced search, column controls, row selection, or export.

## What's included

Browse the [components](https://sv-table.vercel.app/components) and [blocks](https://sv-table.vercel.app/blocks). Start with [Data Table Filters](https://sv-table.vercel.app/components/filters) for advanced filtering, then add only the pieces your project needs.
