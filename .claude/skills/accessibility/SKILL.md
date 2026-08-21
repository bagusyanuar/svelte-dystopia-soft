---
name: accessibility
description: Accessibility rules for this component library — labeling and accessible names, ARIA state vs. name, keyboard and focus behavior, contrast floors, and how the axe checks are wired into the Storybook test run. Load before creating or editing any component in src/lib, adding ARIA attributes, or handling focus/keyboard behavior.
---

# Accessibility

Accessibility bugs in a component library are unusually expensive: they ship into every consumer app, they are invisible to the person who wrote the component, and the consumer usually can't fix them without forking. Treat them like correctness bugs, not polish.

## How it's enforced

`@storybook/addon-a11y` runs axe against **every story** as part of the Vitest `storybook` project, at `test: 'error'` ([.storybook/preview.ts](../../../.storybook/preview.ts)) — a violation fails the test run, it isn't a warning.

```sh
npx vitest run --project storybook   # a11y checks only
npm run test:unit                    # all projects, including the above
```

**Verify the checks actually run before trusting them.** This suite was silently dead for a long time: every story file failed to import with `does not provide an export named 'elementRoles'`, so zero a11y checks executed while the addon sat in `main.ts` looking installed. The cause was CJS dependencies of `@testing-library/*` being served raw to the browser runner; the fix is the `optimizeDeps.include` block in the `storybook` project in [vite.config.ts](../../../vite.config.ts). If story tests ever start failing at import with a `does not provide an export named …` or `exports is not defined` error, add the offending package's **parent** to that list rather than chasing each transitive CJS leaf.

A green run means "axe found nothing", which is a floor, not a pass — see [What axe cannot catch](#what-axe-cannot-catch).

## Accessible names

- Every interactive element needs an accessible name. Icon-only controls have no text, so they need `aria-label` — the icon `<svg>` itself gets `aria-hidden="true"` so it contributes nothing.
- **Never hardcode an English `aria-label` in a shipped component.** A consumer building a non-English app cannot override what they cannot reach. Expose the strings through a single structured prop, following `PasswordField`:

  ```ts
  labels?: { show?: string; hide?: string };
  ```

  One structured prop, not one prop per string — same rule as `classes` in [headless-composition](../headless-composition/SKILL.md).

- Decorative markup must not reach the accessibility tree. `Label`'s required marker is `<span aria-hidden="true">*</span>` because the input's own `required` already announces the requirement; without `aria-hidden` a screen reader says "Email star, required".

## Name vs. state — don't say the same thing twice

A toggle button can express its state in one of two ways, **never both**:

| Pattern                   | Name                   | State                 |
| ------------------------- | ---------------------- | --------------------- |
| Name describes the action | flips: "Show" → "Hide" | no `aria-pressed`     |
| Name is static            | "Show password"        | `aria-pressed={bool}` |

`PasswordField` uses the first. Adding `aria-pressed` on top made screen readers announce "Hide password, toggle button, **pressed**" — the name says what clicking will do, the state says what it already is, and the two read as contradictory. axe does not flag this; it is not a rule violation, just a confusing announcement.

## Forms

- A field is only labelled if something points at it. `Label` forwards `for`, the field forwards `id` — that association is the component's whole reason to exist, so it gets a harness test (see the Testing section in [CLAUDE.md](../../../CLAUDE.md)).
- Validation state goes on the input as `aria-invalid`, not just a red border. `TextField` sets it from `invalid`.
- A `<button>` inside a form **must** declare `type="button"` unless it submits. The HTML default is `submit`, so an icon toggle silently submits the form. `PasswordField` has a regression test for exactly this.
- `disabled` must reach the real control, not only the wrapper's styling — a visually-dimmed control that is still focusable and clickable is worse than no disabled state.

## Contrast

Colour rules live in [design-theme](../design-theme/SKILL.md); the accessibility-relevant floors:

- Body text needs **4.5:1**, so `foreground-faint` is for placeholders and decorative icons only.
- Accent stops were picked by measured contrast, not by eye — `teal-500` fails white text at 2.42:1.
- Both themes are checked: the Storybook **Theme** toolbar toggle flips `data-theme`, and a token that passes in light can fail in dark.

## Suppressing a rule

Sometimes axe is wrong for a specific story. WCAG 1.4.3 exempts text that is part of an _inactive_ control, but axe cannot detect that on a `<label>`, which has no programmatic disabled state — so `Label`'s `Disabled` story legitimately fails `color-contrast`.

Turn the rule off for **that one story**, and say why:

```svelte
<Story
	name="Disabled"
	args={{ disabled: true }}
	parameters={{ a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } } }}
>
```

Never disable a rule globally in `preview.ts`, and never drop `test: 'error'` back to `'todo'` to make a run go green — that silences every component at once, which is how the suite came to be dead in the first place. If a real component (not a disabled state) trips `color-contrast`, fix the colour.

## What axe cannot catch

Automated checks find roughly a third of real issues. These need a person, and are the ones worth thinking about when adding a component:

- **Keyboard reachability and order** — every interactive element reachable by Tab, in visual order.
- **Focus visibility** — `focus-visible:ring-2 focus-visible:ring-ring` on anything focusable; never remove an outline without replacing it.
- **Focus management** — for anything that opens (dialog, menu, popover): focus moves in, is trapped while open, `Escape` closes, and focus returns to the trigger.
- **Roving focus / arrow keys** — for composite widgets (menu, tabs, listbox), Tab enters the group once and arrows move within it.
- **Announcement quality** — the name/state conflict above; whether a live region says something useful.

Before finishing a component: Tab through it, operate it with the keyboard only, and check both themes.

## Adding a widget with real interaction

`Button`, `TextField`, `Label` and friends are simple because they lean on native elements. Anything with open/close state, a popup, or arrow-key navigation should follow the matching **WAI-ARIA Authoring Practices** pattern rather than being improvised — get the roles, the required ARIA attributes, and the keyboard map from there first, then build. Prefer a native element whenever one exists; the accessibility is free and better tested than anything hand-rolled.
