# Create Component Guide

Use this checklist whenever adding a new component.

## 1. Create the source component

```text
src/lib/components/<group>/<component>/
  <component>.svelte
  index.ts
```

- `<component>.svelte`: component implementation.
- `index.ts`: exports for docs/examples/imports.

## 2. Create the docs route

```text
src/routes/(main)/components/<slug>/
  +page.svelte
  +page.ts
  data.ts
  docs.md
  llms.txt/
    +server.ts
  examples/
    preview.svelte
    demo-example.svelte
```

- `+page.svelte`: renders `ComponentDocPage` with `data`.
- `+page.ts`: `export const prerender = true`.
- `data.ts`: meta, SEO, preview, examples, install block, props.
- `docs.md`: short docs shown on the page and served to LLMs.
- `llms.txt/+server.ts`: returns `docs.md` as plain text.
- `examples/preview.svelte`: main preview shown at the top.
- `examples/demo-example.svelte`: usage example with raw source.

## 3. Update docs navigation

Add the component to `src/lib/registry/components.ts`.

- `id`: route id
- `name`: display name
- `href`: `/components/<slug>`
- `desc`: short description
- `badge`: optional

## 4. Update registry

Add a new item to `registry.json`.

- `name`: component slug
- `type`: registry type
- `title`: display title
- `description`: short summary
- `registryDependencies`: dependencies if any
- `files`: source files included in the registry entry

## 5. Optional shortcut

Use the generator first, then fill in the real content:

```bash
pnpm create:route <slug> --source ui/<component>
```

Use `magic/<component>` or another source path when needed.
