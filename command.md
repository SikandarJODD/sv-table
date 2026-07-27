# Route Generator Commands

Use these commands from the project root.

## 1. Preview a single route before creating it

```bash
pnpm create:route backlight --dry-run
```

Shows what files would be created without writing anything.

## 2. Create a single route with an explicit source

```bash
pnpm create:route dialog-doc --source ui/dialog --export Root
```

Creates one docs route and maps it to the component source in `src/lib/components/ui/dialog`.

## 3. Create multiple routes in one go

```bash
pnpm create:routes backlight=magic/backlight dialog-doc=ui/dialog navigation-menu-doc=ui/navigation-menu@Root
```

Creates multiple routes in one run. This is useful when adding several component docs pages together.

## 4. Overwrite an existing generated route

```bash
pnpm create:route dialog-doc --source ui/dialog --export Root --force
```

Recreates the route files if that route already exists.

## Notes

- Use `--dry-run` first if you want to confirm the output.
- Use `--force` only when you want to replace an existing generated route.
- If a component name is ambiguous, pass `--source` explicitly.