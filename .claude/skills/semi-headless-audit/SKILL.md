---
name: semi-headless-audit
description: Audit protocol and checklist for verifying that a component in src/lib is truly semi-headless — covers attribute forwarding, classes sub-part styling, DOM ref exposure, data-* state attributes, snippet payload forwarding, and test harnesses. Load when auditing, reviewing, or refactoring component props and customization capabilities.
---

# Semi-headless audit protocol

Komponen di library ini dibangun dengan filosofi **"Out-of-the-box Beautiful, Zero-Friction Customization"**:
1. Membawa styling dan markup default yang matang dan berestetika tinggi (mengikuti [design-theme](../design-theme/SKILL.md) dan [component-variants](../component-variants/SKILL.md)).
2. Memberikan kontrol penuh (*escape hatches*) kepada konsumen untuk mengubah styling, atribut HTML, status visual, DOM ref, dan struktur sub-part tanpa perlu melakukan *fork* pada komponen.

Skill ini menyediakan **protokol audit 6-pilar** untuk mengevaluasi apakah sebuah komponen sudah memenuhi standar semi-headless, mengidentifikasi celah hierarki props, dan memberikan panduan perbaikannya.

---

## The 6-Pillar Audit Checklist

Saat mengaudit sebuah komponen (`ComponentName.svelte`, `ComponentName.types.ts`, `ComponentName.variants.ts`), uji komponen terhadap 6 pilar berikut:

### 1. Attribute Forwarding (`...restProps` & Types)

- [ ] **Native HTML Extension:** Tipe props meng-extend interface HTML bawaan Svelte (`HTMLAttributes<HTMLDivElement>`, `HTMLButtonAttributes`, `HTMLInputAttributes`, dsb.) dengan `Omit<..., 'children'>`.
- [ ] **Rest Spread:** Prop yang tidak didestruktur (`...restProps`) diteruskan ke elemen root atau elemen interaktif utama yang semestinya.
- [ ] **Unrecognized Attributes:** Atribut seperti `aria-*`, `data-*`, `id`, `title`, `tabindex`, dan native event handlers tidak hilang atau terabaikan.
- [ ] **Dual-Element Components:** Pada komponen wrapper-container (misal: `AccordionItem` yang memiliki outer `<div>` dan inner `<button>`), evaluasi apakah elemen interaktif di dalam juga membutuhkan atribut kustom (misal via `triggerProps`, `inputProps`, atau prop khusus).

### 2. Class Merging & Sub-part Styling (`classes`)

- [ ] **Root `class`:** Menerima `class: className` dan selalu digabung menggunakan `cn(defaults, className)` dengan posisi `className` di paling akhir agar override konsumen selalu menang.
- [ ] **Anti-Pattern Prop Explosion:** Tidak menggunakan flat class props terpisah untuk tiap sub-bagian (contoh salah: `triggerClass`, `contentClass`, `iconClass`, `panelClass` ❌).
- [ ] **Structured `classes` Prop:** Sub-bagian internal yang dependen/dekoratif dikelompokkan ke dalam satu prop terstruktur:
  ```ts
  classes?: {
    trigger?: string;
    content?: string;
    indicator?: string;
    panel?: string;
    input?: string;
  };
  ```
- [ ] **Internal Merging:** Setiap elemen sub-bagian menggabungkan class default internal dengan `classes?.[part]` menggunakan `cn()`:
  ```svelte
  class={cn('base-classes...', classes?.trigger)}
  ```

### 3. State via Data-Attributes (`data-*`)

- [ ] **Visual/Interactive State Exposure:** Komponen yang memiliki status visual (terbuka/tertutup, aktif, terpilih, disabled, checked, invalid, orientasi) **wajib** mengeksposnya sebagai atribut `data-*`:
  - `data-state={open ? 'open' : 'closed'}`
  - `data-disabled={disabled ? '' : undefined}`
  - `data-selected={selected ? '' : undefined}`
  - `data-invalid={invalid ? '' : undefined}`
  - `data-orientation={orientation}`
- [ ] **Root/Wrapper Placement (Kritis):** Data-attributes tidak hanya ditaruh di tombol trigger internal, tetapi **harus ada di wrapper/container terluar komponen**. Ini memungkinkan konsumen menata seluruh baris/kartu menggunakan CSS selector berbasis state:
  ```css
  /* Konsumen dapat dengan mudah melakukan styling berbasis state */
  .my-item[data-state="open"] { ... }
  ```
- [ ] **No Internal Class Coupling:** Konsumen tidak boleh dipaksa menarget class CSS internal library (`.bg-surface-subtle`, dll.) untuk mendeteksi perubahan state.

### 4. DOM Element References (`ref`)

- [ ] **Primary Element Ref:** Menyediakan prop `ref?: HTMLElement | null` dengan nilai default `$bindable(null)`:
  ```ts
  let { ref = $bindable(null), ...restProps }: ComponentProps = $props();
  ```
  ```svelte
  <div bind:this={ref} ...>
  ```
- [ ] **Secondary Element Ref:** Jika komponen membungkus elemen interaktif di dalamnya (misal wrapper `<div>` yang membungkus `<button>` atau `<input>`), sediakan ref spesifik untuk kontrol tersebut (misal `triggerRef?: HTMLButtonElement | null = $bindable(null)` atau `inputRef?: HTMLInputElement | null = $bindable(null)`). Ini penting untuk focus management, auto-scroll, dan animasi.

### 5. Snippet Inversion of Control & State Payload

- [ ] **State Payload:** Snippet kustom selain `children` (seperti `trigger`, `prefix`, `suffix`, `indicator`) meneruskan state internal komponen ke konsumen:
  ```ts
  trigger: Snippet<[{ open: boolean }]>;
  indicator?: Snippet<[{ open: boolean }]>;
  children?: Snippet<[{ open: boolean }]>;
  ```
- [ ] **Backward Compatibility:** Di Svelte 5, snippet yang diketik `Snippet<[{ open: boolean }]>` tetap kompatibel jika konsumen menulis `{#snippet trigger()}...{/snippet}` tanpa parameter.
- [ ] **Replaceable/Omit-able Decorative Parts:** Bagian dekoratif seperti icon chevron, close button, atau badge bawaan harus dapat diganti menggunakan snippet opsional (`indicator?: Snippet<...>`):
  ```svelte
  {#if indicator}
    {@render indicator({ open })}
  {:else}
    <svg class={cn('...', classes?.indicator)}>...</svg>
  {/if}
  ```

### 6. The `child` Snippet Pattern (asChild Equivalent)

- [ ] **Targeted Usage:** Pola `child` (`Snippet<[{ props: Record<string, unknown> }]>`) hanya diterapkan pada komponen yang memang plausibel butuh mengganti tag HTML dasarnya (misalnya `Button` yang ingin dirender sebagai tag `<a>` atau SvelteKit router `<Link>`).
- [ ] **No Over-Engineering:** Jangan menambahkan pola `child` ke setiap komponen secara membabi-buta jika tidak ada use-case nyata untuk mengganti elemen dasarnya (hindari *AI-slop over-genericizing*).

---

## Standar Format Laporan Audit

Saat diminta mengaudit komponen, sajikan laporan dengan struktur berikut:

```markdown
### Ringkasan Audit Semi-Headless: [ComponentName]

| Pilar | Kriteria | Status | Catatan |
|---|---|---|---|
| 1. Attributes | `...restProps` & HTML types | ✅ Pass / ⚠️ Partial / ❌ Fail | ... |
| 2. Classes | `class` override & `classes` sub-parts | ✅ Pass / ⚠️ Partial / ❌ Fail | ... |
| 3. Data-Attributes | `data-state`, `data-disabled` di wrapper | ✅ Pass / ⚠️ Partial / ❌ Fail | ... |
| 4. DOM Refs | Bindable `ref` / `triggerRef` | ✅ Pass / ⚠️ Partial / ❌ Fail | ... |
| 5. Snippets | State payload & replaceable parts | ✅ Pass / ⚠️ Partial / ❌ Fail | ... |
| 6. Element Swap | `child` pattern (jika relevan) | ✅ N/A / Pass | ... |

#### Temuan & Celah Keterbatasan
- Rincian kekurangan spesifik beserta file dan nomor barisnya.

#### Rekomendasi Solusi & Kode Perbaikan
- Perubahan interface `.types.ts`.
- Perubahan markup `.svelte`.
- Rencana penambahan test di `.spec.ts`.
```

---

## Standar Testing untuk Semi-Headless

Setiap perbaikan fitur semi-headless harus diverifikasi dengan unit test di `ComponentName.svelte.spec.ts`:

1. **Test Class Override & Classes Sub-parts:**
   Pastikan class konsumen menimpa class default dan masuk ke sub-part yang ditargetkan.
2. **Test State Data-Attributes:**
   Pastikan `data-state="open" | "closed"` dan `data-disabled` muncul di wrapper dan berubah saat ditoggle.
3. **Test DOM Element Ref Binding:**
   Gunakan harness dengan `bind:ref={myRef}` dan assert bahwa `myRef` bukan `null` setelah mount.
4. **Test Snippet State Payload:**
   Pastikan `{ open }` (atau state lainnya) diterima oleh snippet `trigger` dan `children`.
