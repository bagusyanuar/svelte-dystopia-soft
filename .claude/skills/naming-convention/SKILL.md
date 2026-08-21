---
name: naming-convention
description: File and folder naming convention for this library (kebab-case folders, PascalCase components + their colocated spec/story files, kebab-case everything else). Load before creating any new file or folder anywhere in src/lib.
---

# Naming convention

## Rules

- **Folders**: always `kebab-case`. Example: `src/lib/components/date-picker/`, `src/lib/utils/`.
- **Component files** (`.svelte`, and any `.svelte.ts` that defines/backs a component): `PascalCase`. Example: `Button.svelte`, `DatePicker.svelte`.
- **Files colocated with a component** (types, variants, spec, story) inherit the component's PascalCase name — don't convert them to kebab-case, since they're identified by which component they belong to, not by general file-naming rules:
  - `Button.types.ts`
  - `Button.variants.ts` (only if the component has `cva` variants — see [component-variants](../component-variants/SKILL.md))
  - `Button.svelte.spec.ts`
  - `Button.stories.svelte`
- **Everything else** (utils, helpers, non-component `.ts` files, plain `.spec.ts` for non-component logic): `kebab-case`. Example: `format-date.ts`, `format-date.spec.ts`.
- **Component `Props` types**: always a dedicated colocated `ComponentName.types.ts` file (see [svelte5-best-practices](../svelte5-best-practices/SKILL.md)) — never inline in the `.svelte` file. This is a fixed rule, not a judgment call based on how "complex" the props are — consistency matters more than saving one file for a simple component. Only put a type in `src/lib/types/` (kebab-case filename) when it's genuinely shared across multiple components (e.g. a `Size` union used by `Button`, `Input`, and `Badge`).

## Colocation

Component + its spec + its story live **together in the same folder**, not in a separate top-level `stories/` or `tests/` directory:

```
src/lib/
  components/
    button/
      index.ts              <- per-component barrel
      Button.svelte
      Button.types.ts
      Button.variants.ts
      Button.svelte.spec.ts
      Button.stories.svelte
    date-picker/
      index.ts
      DatePicker.svelte
      DatePicker.types.ts
      DatePicker.svelte.spec.ts
      DatePicker.stories.svelte
  utils/
    cn.ts
    format-date.ts
    format-date.spec.ts
  types/
    size.ts               <- only shared/cross-component types live here
  index.css               <- theme entry; there is no src/lib/index.ts
```

Storybook's `stories` glob in [.storybook/main.ts](../../../.storybook/main.ts) (`../src/**/*.stories.@(js|ts|svelte)`) already scans recursively, so colocated stories are picked up automatically — no config change needed when adding a new component folder.

## Per-component barrel

Every component folder gets an `index.ts` that re-exports the component, its `Props` type, and its variants (if any):

```ts
// components/text-field/index.ts
export { default as TextField } from './TextField.svelte';
export type { TextFieldProps } from './TextField.types.js';
export { textFieldVariants, type TextFieldVariantProps } from './TextField.variants.js';
```

That folder `index.ts` **is** the component's public entry point — there is no root barrel and no `src/lib/index.ts`. The `exports` map in [package.json](../../../package.json) maps the folder straight through with a wildcard:

```json
"./components/*": {
	"types": "./dist/components/*/index.d.ts",
	"svelte": "./dist/components/*/index.js"
}
```

so consumers import it as `@dystopia/soft-lib/components/text-field`. **A new component folder needs no `package.json` change** — dropping an `index.ts` into `src/lib/components/<name>/` publishes it. Which also means: don't create a folder there unless it's meant to be public.

Three rules that are easy to get wrong:

- **Use explicit named re-exports, never `export *`.** `export *` leaks whatever a component file happens to export and makes the public surface accidental — see the public-API rule in [CLAUDE.md](../../../CLAUDE.md).
- **Inside the library, write `/index.js` explicitly** when one module imports another folder's barrel. `moduleResolution: NodeNext` does not resolve a directory to its `index` file — `'../text-field'` fails, `'../text-field/index.js'` works. Same reason relative imports need the `.js` extension at all. (Consumers are unaffected: the `exports` wildcard resolves the bare subpath for them.)
- **`src/lib/utils/` uses a flat wildcard** (`"./utils/*"` → `./dist/utils/*.js`), so utils are single files with no folder or barrel: `@dystopia/soft-lib/utils/cn`.

### Don't "clean up" the `.js` extensions

Relative imports in `src/lib` end in `.js` even though the files are `.ts`. That is deliberate and was tested — do not switch `moduleResolution` to `bundler` to drop them. Measured result of extensionless imports:

- `npm run check`, `svelte-package`, and `publint` **all still pass** — nothing local catches it.
- `svelte-package` copies the extensionless specifier into `dist/` verbatim (unlike a `.ts` extension, which it does rewrite to `.js`).
- The published package then fails for consumers: `ERR_MODULE_NOT_FOUND` under Node ESM, and `TS2307: Cannot find module './TextField.types'` for any consumer on `moduleResolution: NodeNext`.

Writing `.js` costs nothing and keeps `dist/` a 1:1 mirror of the source. Making extensionless work would require a post-`svelte-package` codemod that re-adds the extensions — rejected as not worth the maintenance.

## Quick reference

| What                             | Case                           | Example                      |
| -------------------------------- | ------------------------------ | ---------------------------- |
| Folder                           | kebab-case                     | `date-picker/`               |
| Component file                   | PascalCase                     | `DatePicker.svelte`          |
| Component `Props` type file      | PascalCase (matches component) | `DatePicker.types.ts`        |
| Component `cva` variants file    | PascalCase (matches component) | `Button.variants.ts`         |
| Component spec                   | PascalCase (matches component) | `DatePicker.svelte.spec.ts`  |
| Component story                  | PascalCase (matches component) | `DatePicker.stories.svelte`  |
| Util / helper file               | kebab-case                     | `format-date.ts`             |
| Shared/cross-component type file | kebab-case                     | `size.ts`                    |
| Per-component barrel             | lowercase                      | `index.ts`                   |

## What to avoid

- Don't put components in a flat `src/lib` root — each component gets its own kebab-case folder.
- Don't create a separate top-level `src/stories/` or `src/lib/tests/` directory — that pattern was removed from this project; everything colocates with its component.
- Don't kebab-case a component file (`date-picker.svelte`) or PascalCase a util file (`FormatDate.ts`) — case signals the file's role at a glance, so don't mix the two systems.
