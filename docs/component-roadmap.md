# Component Roadmap

Status komponen `@dystopia/soft-lib` dan rencana pengembangan berikutnya.

Terakhir diperbarui: 2026-08-22 (`alert` selesai + token `warning`/`success`)

---

## Sudah selesai (24 komponen)

Semua sudah punya `index.ts` sebagai public entry point.

### Form

- [x] `text-field`
- [x] `textarea`
- [x] `password-field`
- [x] `checkbox`
- [x] `radio`
- [x] `switch`
- [x] `slider`
- [x] `label`
- [x] `helper-text`

### Overlay

- [x] `popover`
- [x] `dropdown`
- [x] `tooltip`
- [x] `hover-card`
- [x] `dialog` — konsumen pertama `focus-trap` + `scroll-lock`. Enter/exit animation default (`components`-layer, lihat catatan di bawah), overridable lewat `classes`.

### Aksi & tampilan

- [x] `button`
- [x] `button-group`
- [x] `toggle`
- [x] `card`
- [x] `badge`
- [x] `skeleton`
- [x] `progress`
- [x] `collapsible`
- [x] `typography`
- [x] `alert` — box notifikasi statis, bukan overlay (tanpa portal/presence/primitive apa pun). Variant `default`/`danger`/`warning`/`success`, `role="alert"`.

### Utilitas (`src/lib/utils/`)

- [x] `cn.ts` — merge class
- [x] `floating.ts` — positioning via `@floating-ui/dom`
- [x] `portal.ts` — render ke luar tree
- [x] `presence.svelte.ts` — tunda unmount sampai animasi exit selesai
- [x] `focus-trap.ts` — action Tab/Shift+Tab cycling dalam node
- [x] `scroll-lock.ts` — ref-counted body scroll lock, kompensasi lebar scrollbar
- [x] `dismissable-layer.ts` — Esc + click-outside dengan stacking (cuma layer teratas yang react)
- [x] `roving-focus.ts` — navigasi panah + typeahead di kumpulan item
- [x] `id.ts` — `createIds` + `idFor`, generate id turunan dari `$props.id()`

---

## Blocker arsitektur — selesai

Primitive yang tadinya jadi prasyarat Tier 1 sudah dibuat semua, masing-masing dengan spec colocated (lihat `src/lib/utils/`).
`Popover` dan `Dropdown` sudah direfactor untuk pakai `dismissable-layer` (keduanya) dan `roving-focus` (`Dropdown`) — logika yang tadinya duplikat sekarang satu sumber.
Semua 5 primitive sekarang punya minimal satu consumer nyata lewat `dialog`.

- [x] `focus-trap` — dipakai `dialog`. Masih relevan buat: drawer, sheet
- [x] `scroll-lock` — dipakai `dialog`. Masih relevan buat: drawer
- [x] `dismissable-layer` — Esc + click-outside + stacking. Dipakai `popover`, `dropdown`, `dialog`.
- [x] `roving-focus` — navigasi panah + typeahead. Dipakai `dropdown`; tabs/select/combobox/menubar/radio group tinggal pakai.
- [x] `id` — `createIds`/`idFor` untuk `aria-labelledby` / `aria-controls`. Dipakai `dialog`; masih relevan buat: tabs, accordion

---

## Tier 1 — hampir semua aplikasi butuh

- [ ] `select` — lubang terbesar di form. Primitive siap: floating, roving-focus, id. Masih butuh: typeahead khusus form-value
- [ ] `toast` — belum ada jalur feedback async. **Perlu keputusan API terpisah** (lihat catatan di bawah)
- [ ] `tabs` — navigasi paling umum. Primitive siap: roving-focus, id
- [ ] `separator` — sepele, sering dipakai. Tanpa dependensi
- [ ] `avatar` — tanpa dependensi

## Tier 2

- [ ] `accordion` — `collapsible` sudah ada, tapi grouping + mode single/multiple belum
- [ ] `drawer` / `sheet` — berbagi primitive dengan dialog (focus-trap, scroll-lock, dismissable-layer sudah terbukti jalan di sana). Bisa contek pola centering-lewat-wrapper dari `dialog` juga.
- [ ] `combobox` / `autocomplete`
- [ ] `table`
- [ ] `pagination`
- [ ] `breadcrumb`
- [ ] `spinner`
- [ ] `empty-state`

## Tier 3 — mahal, tunda

- [ ] `calendar`
- [ ] `date-picker`
- [ ] `command` (command palette)
- [ ] `data-table` (sorting / filtering / selection)
- [ ] `carousel`
- [ ] `tree`
- [ ] `resizable`

---

## Urutan pengerjaan yang disarankan

1. ~~Audit + ekstrak primitive~~ — selesai. `dismissable-layer`, `focus-trap`, `scroll-lock`, `roving-focus`, `id` ada di `src/lib/utils/`.
2. ~~`dialog`~~ — selesai. Primitive tervalidasi lewat consumer nyata; pola default-animation + centering-lewat-wrapper siap dicontek komponen overlay berikutnya.
3. ~~Batch murah — `alert`~~ — selesai, plus token `warning`/`success` baru ditambah ke theme (lihat catatan di bawah). Sisa batch murah: `separator`, `avatar`, `spinner`. ← next
4. **`tabs`** lalu **`accordion`** — tinggal pakai `roving-focus` + `id` yang sudah ada.
5. **`select`** — paling berat di Tier 1.
6. **`toast`** — terakhir, karena polanya paling beda.

Di luar urutan ini: `drawer`/`sheet` (Tier 2) sekarang murah dikerjakan kapan saja karena semua primitive-nya sudah terbukti lewat `dialog` — naikkan prioritasnya kalau ada kebutuhan konkret.

---

## Catatan terbuka

### Token `warning`/`success` — baru ditambah, tersedia buat komponen lain

Sebelum `alert`, theme cuma punya `default` (netral) dan `danger` — gak ada `warning`/`success`. Ditambahin di `src/lib/index.css` khusus buat kebutuhan `alert`, dengan hue dijaga konsisten antara light/dark (kayak `danger`) dan lightness dipilih lewat perhitungan kontras OKLCH nyata (bukan agak-agak), target ≥4.5:1 buat body text:

- `--warning`/`--warning-border`/`--warning-foreground` — hue 75 (amber), 5.62:1 light / 6.35:1 dark
- `--success`/`--success-border`/`--success-foreground` — hue 145 (hijau), 5.59:1 light / 6.37:1 dark

Sudah dipakai `alert` (variant `warning`/`success`). Kalau nanti `badge`/`button` mau nambah variant senada, token-nya udah ada — tinggal pakai `border-warning-border`/`bg-warning`/`text-warning`, dst, gak perlu bikin token baru lagi.

### Jebakan `translate-x/y` + `transform` di Tailwind v4 — relevan buat komponen overlay lain

Tailwind v4 compile `-translate-x-1/2`/`-translate-y-1/2` jadi property `translate` yang **terpisah** dari `transform`, dan browser apply dua-duanya sekaligus (numpuk, bukan saling timpa). Kalau elemen yang sama nanti dianimasikan pakai `transform` (mis. `scale`), transform-nya jadi ketambahan offset dari `translate` yang tersisa dari centering.

`dialog` kena ini persis — centering pakai `-translate-x-1/2 -translate-y-1/2` bikin animasi enter/exit-nya terbang dari trigger, bukan mengembang dari tengah. Fix: pindahin centering ke wrapper (`flex items-center justify-center`), biar `transform` di elemen yang dianimasikan tetap bebas.

**Berlaku buat komponen manapun yang posisinya di-center pakai transform (drawer, sheet, command palette, dst) — jangan pakai `-translate-x/y-1/2` di elemen yang sama yang nanti dianimasikan.**

### Default animation lewat `components` layer, bukan utility class

`dialog` punya default enter/exit animation yang didefinisikan di `index.css` pakai `@layer components` + `data-slot` attribute selector, bukan `data-[state=open]:animate-*` langsung di class komponen. Alasannya: `tailwind-merge` cuma kenal 5 nilai `animate-*` bawaan Tailwind (`none|spin|ping|pulse|bounce`) — animasi custom (`animate-dialog-content-in`, dst) dianggap class gak berhubungan, jadi gak bisa di-dedupe/di-override lewat `cn()`. Naruh default di `components` layer bikin utility apa pun dari `classes` konsumen otomatis menang (Tailwind urutan layer: components sebelum utilities), tanpa perlu specificity hack.

Pola ini reusable buat komponen lain yang mau punya default animation yang overridable: token `--animate-*` + `@keyframes` di `@theme`, rule aktualnya di `@layer components` dikunci ke `data-slot`, guard `prefers-reduced-motion` di layer yang sama.

### `toast` butuh keputusan API tersendiri

Beda dari komponen lain: perlu provider / singleton store, jadi tidak murni subpath-only seperti sisanya.
Konsumen memanggilnya secara imperatif (`toast.success(...)`), bukan dengan me-render komponen.
Perlu dibahas dulu sebelum ditulis.

### Hal yang perlu dicek saat menambah komponen

- Folder baru di `src/lib/components/` otomatis publik lewat wildcard `exports` — jangan buat folder yang belum siap jadi API publik.
- Setiap komponen baru butuh spec colocated, bukan cuma halaman demo di `src/routes/`.
- Setiap story dicek axe dengan `test: 'error'` — pelanggaran a11y menggagalkan test run.
