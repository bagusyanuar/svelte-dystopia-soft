# Component Roadmap

Status komponen `@dystopia/soft-lib` dan rencana pengembangan berikutnya.

Terakhir diperbarui: 2026-08-24 (`data-table` selesai)

---

## Sudah selesai (40 komponen)

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
- [x] `select` — native `<select>`, bukan custom listbox. Chevron up-down icon (dekoratif, `pointer-events-none`) overlay di kanan, `appearance-none` buat matiin native chrome. Sengaja gak pakai `floating`/`roving-focus`/`id` — native select udah dapet keyboard nav, typeahead, dan popup listbox gratis dari browser, jadi primitive itu gak relevan buat komponen ini (beda dari asumsi awal di Tier 1). Lihat catatan "Kenapa `select` native, bukan custom listbox" di bawah.
- [x] `tabs` — compound component (`Tabs`/`TabsList`/`TabsTrigger`/`TabsContent`), state (`value`, bindable) di-share lewat Svelte context (`tabs-context.ts`, internal, gak diexport). Pakai `roving-focus` (automatic activation — panah gerakin fokus sekaligus milih tab, beda dari `dropdown` yang fokus/pilih dua langkah terpisah) dan `id` (`idFor` buat pasangan `aria-controls`/`aria-labelledby` per tab-panel). Tab disabled otomatis ke-skip dari roving set (query selector `:not(:disabled)`, sama pola kayak `dropdown`). Panel non-aktif gak dirender sama sekali (`{#if selected}`), bukan disembunyiin lewat CSS.
- [x] `combobox` — di luar giliran (2026-08-23, Tier 2, diprioritasin atas permintaan). Port dari implementasi existing di project lain (`ubh-opex-frontend`), full feature parity (single/multi-select dengan chip, grouping, skeleton loading, error+retry, clearable, prefix, keywords, highlight match) — bukan v1 yang di-trim. Logic-nya (state class, filter, keyboard map, debounce) diport hampir apa adanya; plumbing-nya diadaptasi penuh ke primitive lib ini. Poin penting:
  - **Async tetap konsumen-kontrol penuh** — komponen cuma debounce (`searchDebounce` prop) sebelum manggil `onSearchChange`. Gak ada Promise/race-guard di dalam komponen — fetch/cache/race itu tanggung jawab konsumen (`search` bindable dipakai sebagai query key ke data layer mereka sendiri, `manualFilter` buat skip local-filter kalau data udah difilter server-side). Ini keputusan sadar, nolak alternatif "built-in Promise + race-guard token" yang sempet dibahas duluan.
  - **`floating.ts` dapet extension baru** (opt-in, non-breaking): `matchReferenceWidth`/`maxHeight` yang push middleware `size()` dari `@floating-ui/dom` — dipakai buat popup combobox match-width ke trigger dan clamp tinggi ke viewport. Consumer lain (`Popover`/`Dropdown`/`Tooltip`/`HoverCard`) gak kepengaruh karena defaultnya `undefined`.
  - **Gak ada default animation** — beda dari `dialog`/`toast`/`drawer`, combobox nyamain `dropdown`/`popover` (gak ada entry baru di `@layer components`). `data-slot='combobox-content'` + `data-state` tetep ada buat consumer hook animation sendiri lewat `classes.content`, `createPresence` tetep nunda unmount kalau mereka pasang animasi.
  - **Virtual focus (`aria-activedescendant`) sengaja gak masuk `roving-focus.ts`** — primitive itu mindahin fokus DOM beneran (dipake `dropdown`/`tabs`), sedangkan combobox fokusnya harus tetep di `<input>` terus (fokus ke option cuma virtual). Logic index/highlight-nya lokal di `combobox-state.svelte.ts` aja, konsisten sama disiplin "jangan generalize primitive sebelum ada consumer kedua yang beneran butuh".
  - **Komponen generic pertama di lib ini** — `<script generics="T extends ComboboxValue">`, beda dari `select`/`dropdown` yang untyped value. `ComboboxValue = string | number`.
  - Loading indicator di search-row reuse komponen `Spinner` yang udah ada (`label=""` biar gak dobel announcement) — cross-import pertama antar folder komponen publik di lib ini.
  - Fix a11y dibanding source aslinya: source-nya hardcode `aria-label` bahasa Inggris ("Remove {label}", "Clear selection") — pelanggaran langsung skill `accessibility`. Semua string user-facing dikonsolidasi ke satu prop `labels` (pola sama kayak `PasswordField.labels`), termasuk `removeChip` sebagai function `(label) => string` biar tetep bisa di-interpolate pas di-localize.
  - **`onEndReached`** — nyusul (2026-08-23, atas permintaan, sebelum source aslinya gak punya ini sama sekali). Infinite-scroll hook buat mode async: komponen cuma nge-signal (scroll-threshold di listbox, 48px dari bawah, di-guard biar gak fire berkali-kali selagi masih di halaman yang sama), gak fetch/merge/track page sendiri — konsisten sama filosofi `onSearchChange`. Guard-nya (`endReachedFired`) di-reset via `$effect` yang nonton `options`/`loading`, jadi re-arm otomatis begitu halaman baru landing (options berubah) atau `loading` balik ke `false` (termasuk kasus consumer yang gak pernah nyalain `loading` buat pagination-nya). Sample penggunaan real (single query dan paginated) pakai `@tanstack/svelte-query` ditulis sebagai doc-comment di `Combobox.stories.svelte` (bukan story yang beneran jalan — sengaja gak nambah `@tanstack/svelte-query` sebagai dependency cuma buat demo).

### Overlay

- [x] `popover`
- [x] `dropdown`
- [x] `tooltip`
- [x] `hover-card`
- [x] `dialog` — konsumen pertama `focus-trap` + `scroll-lock`. Enter/exit animation default (`components`-layer, lihat catatan di bawah), overridable lewat `classes`.
- [x] `breadcrumb` — compound 7-part, tanpa primitive baru. `Breadcrumb` (`<nav aria-label="breadcrumb">`), `BreadcrumbList` (`<ol>`), `BreadcrumbItem` (`<li>`), `BreadcrumbLink` (`<a>`, pakai pola `child` snippet buat router-link composability — sama pola kayak `Button`), `BreadcrumbPage` (`<span aria-current="page">`, bukan link — representasi halaman sekarang), `BreadcrumbSeparator` (`<li role="presentation" aria-hidden="true">`, chevron default, override lewat `children`). Separator dibungkus `<li>` — bukan teks lepas di antara item — biar `<ol>` tetep valid HTML (cuma boleh `<li>` sebagai direct child).
- [x] `BreadcrumbEllipsis` — tambahan nyusul (2026-08-23), buat kasus responsive/collapsed breadcrumb. Bukan komponen baru dari nol — cuma bungkus `Popover` yang udah ada (reuse penuh: floating, dismissable-layer, portal, presence), trigger-nya di-restyle jadi tombol ikon kecil ("⋯") lewat override `classes.trigger`/`classes.content` (tailwind-merge dedupe otomatis nge-replace `h-10`/`border`/`px-control-x` bawaan `Popover` tanpa perlu ubah `Popover` sendiri). Konten popover-nya headless total — konsumen isi sendiri list `BreadcrumbLink` yang collapsed, gak ada struktur wajib. Gak butuh compound part sendiri (bukan `<li>` — sejajar sama `BreadcrumbLink`/`BreadcrumbPage`, ditaro di dalam `BreadcrumbItem` sama kayak keduanya).
- [x] `drawer` — panel edge-anchored (`side`: `right` default/`left`/`top`/`bottom`), reuse primitive yang sama kayak `dialog` (`focus-trap`, `scroll-lock`, `dismissable-layer`, `portal`, `createPresence`, `createIds`). Beda dari `dialog`: gak butuh wrapper terpisah buat `portal`+`focus-trap` — posisinya lewat `inset-*` (bukan transform buat centering), jadi dua action itu aman langsung di elemen content yang sama. Overlay-nya reuse animation `dialog-overlay` yang udah ada (`data-slot='dialog-overlay'`, gak bikin token baru) karena perannya identik (scrim dim). Content dapet keyframe baru per sisi (4 arah × in/out = 8) di `index.css`, dikunci ke `data-slot='drawer-content'` + `data-side`. Radius & border cuma di sisi yang "ke dalam" (misal `side=right` → `rounded-l-lg border-l` doang, 3 sisi lain flush ke tepi viewport). Wrapper `children` dikasih `flex-1 min-h-0` biar pola "header tetap, footer nempel bawah" ala konsumen (`flex h-full flex-col justify-between` di children mereka) kepakai — sempet ketauan salah pas screenshot-testing manual: percobaan pertama pake `flex-1` di wrapper konsumen gak ngefek karena parent-nya bukan flex container, baru bener pas ganti `h-full`.

### Aksi & tampilan

- [x] `button`
- [x] `button-group`
- [x] `toggle`
- [x] `card`
- [x] `badge`
- [x] `skeleton`
- [x] `progress`
- [x] `collapsible`
- [x] `accordion` — grouping di atas `collapsible`'s trigger/content markup, `type="single"` (default, satu item kebuka, klik item aktif nutup lagi) atau `type="multiple"` (`value` jadi `string[]`, saling independen), `value` bindable, tipe di-diskriminasi lewat `type` (`string` buat single, `string[]` buat multiple) jadi konsumen gak bisa salah pasang. State di-share ke `AccordionItem` lewat Svelte context internal (`accordion-context.ts`, sama pola kayak `tabs-context.ts`, gak diexport). Item disabled gak toggle (native `disabled` attribute udah cukup, gak perlu guard manual). Root `overflow-hidden` biar hover-bg trigger item pertama/terakhir gak nembus keluar sudut `rounded-lg`.
- [x] `typography`
- [x] `spinner` — tanpa dependensi. `role="status"` + `aria-label` (bukan visually-hidden text di dalam — role `status` cuma nge-compute accessible name dari `aria-label`/`aria-labelledby`, "name from content" gak berlaku buat role ini, sempet salah asumsi pas nulis test pertama kali dan test-nya gagal karena itu). Default label "Loading" (fallback `??`, sama pola kayak `labels` di `PasswordField`), `label=""` buat suppress kalau parent (mis. button `aria-busy`) udah announce sendiri. Ikon `animate-spin` inherit `currentColor`, sengaja gak dikasih warna default biar otomatis ngikutin warna teks parent (sama kayak spinner inline yang udah ada di `Button`) — konsumen kasih warna lewat `class`/`classes.icon` kalau dipakai berdiri sendiri.
- [x] `alert` — box notifikasi statis, bukan overlay (tanpa portal/presence/primitive apa pun). Variant `default`/`danger`/`warning`/`success`, `role="alert"`.
- [x] `toast` — API imperatif (`toast.message/success/warning/danger(title, options)`) + komponen `<Toaster />` yang dipasang sekali di root. Store singleton module-level (`toast-store.svelte.ts`), viewport portalled, posisi 6-corner (default `bottom-right`), max 3 visible dengan sisanya nunggu giliran (bukan dibuang), auto-dismiss 5 detik dengan pause-on-hover, pakai `portal` + `createPresence` yang sudah ada. Lihat catatan "Keputusan API `toast`" di bawah untuk detail.
- [x] `separator` — tanpa dependensi. `<div role="separator">` (bukan `<hr>`, biar satu komponen nutup horizontal & vertical — HTML gak punya elemen native buat separator vertical). Default `decorative={true}` (gak ada `role`/`aria-orientation` sama sekali, murni visual); `decorative={false}` baru expose `role="separator"` + `aria-orientation` buat AT, sesuai WAI-ARIA (separator dekoratif seharusnya gak masuk accessibility tree).
- [x] `avatar` — tanpa dependensi, single component (bukan compound `Avatar`/`AvatarImage`/`AvatarFallback` ala Radix) — image/fallback di sini bukan bagian yang independently composable, jadi gak butuh full compound treatment (lihat skill `headless-composition`). `children` snippet dobel fungsi jadi konten fallback (inisial/ikon), ditampilin selama gambar belum ke-load, gagal, atau `src` kosong. Status loading dilacak internal (`loading`/`loaded`/`error`) via `onload`/`onerror` di `<img>`; `$effect` reset status pas `src` prop berubah (dijustifikasi sebagai sinkronisasi ke lifecycle async gambar, bukan derivasi nilai murni — lihat skill `svelte5-best-practices`). Gak ada size variant/`cva` — cuma default `size-10`, size lain via override `class` (`cn()` udah nge-dedupe), gak ada named role spacing yang cocok buat dijadiin scale formal.

### Data display

- [x] `table` — selesai (2026-08-23), Tier 2. Compound 8-part (`Table`/`TableHeader`/`TableBody`/`TableFooter`/`TableRow`/`TableHead`/`TableCell`/`TableCaption`), murni presentational — gak ada `$state`, gak ada context share antar-part (beda dari `Tabs`/`Accordion` yang emang butuh context karena state-nya lintas-part; di sini tiap part independen, konsumen loop data sendiri lewat `{#each}`), gak ada primitive. Prasyarat buat `data-table` (Tier 3) — part-part ini bakal langsung dipakai ulang di sana lewat `flexRender`.
  - `class` di root `Table` jatuh ke wrapper scroll (`<div class="overflow-x-auto">`), bukan elemen `<table>` — pola yang sama kayak `Select` (`class` ke wrapper, `classes.select` ke elemen native). Buat `Table`, elemen native-nya dapet `classes.table`.
  - `TableRow` punya prop `selected` (boolean, murni presentational — cuma toggle `data-selected` attribute + background) buat disambungin ke selection state konsumen sendiri nanti (mis. dari `row.getIsSelected()` punya TanStack Table). Gak ada primitive/state internal apa pun buat ini.
  - `TableHead` default `scope="col"`, overridable (`scope="row"` buat row header) karena `scope` ada di destructure `restProps`, bukan di-hardcode tanpa jalan keluar.
  - Padding sel (`TableHead`/`TableCell`) pake `px-compact py-2` — persis kombo yang sama kayak `DropdownItem` (role "dense rows" cocok buat cell tabel, `py-2` dibiarin literal karena gak ada token yang match peran "padding vertikal", sama disiplin kayak keputusan `dropdown` kemarin).
  - Sengaja **gak** pakai arbitrary Tailwind selector (`[&_tr]`, `:has([role=checkbox])`) yang lazim di implementasi Table ala shadcn — border taro langsung di tiap `TableRow`/`TableHeader`/`TableFooter`, dan gak ada preemptive styling buat checkbox column `data-table` yang belum ada. Konsisten sama disiplin "jangan desain buat kebutuhan hipotetis" — nanti ditambah kalau `data-table` beneran butuh.
- [x] `pagination` — selesai (2026-08-23), Tier 2, di luar giliran (atas permintaan, sebelum `pagination` giliran normalnya setelah `table`). **Semi-headless, beda dari `table` yang full headless** — keputusan sadar (dibahas dulu sebelum mulai): variasi konten pagination rendah (nomor + "…" + arrow doang, gak kayak variasi cell `table` yang liar), dan "bagian susah"-nya (algoritma ellipsis) justru persis hal yang bakal dipaksa diulang konsumen kalau full headless — jadi di-bake defaultnya, bukan di-headless-in.
  - **`src/lib/utils/pagination-range.ts`** — pure function `getPaginationRange({ currentPage, totalPages, siblingCount, boundaryCount })`, return `(number | 'ellipsis')[]`. Gak jalan lewat conditional-math ala MUI (`usePagination`, terkenal padat/susah diverifikasi bener di edge case) — bikin "wanted" `Set` dulu (boundary pages + pages di sekitar current), terus walk 1..N sekali sambil nyisipin `'ellipsis'` tiap ada gap. Lebih gampang diverifikasi bener di edge case (`totalPages` kecil, current di ujung). Ada spec sendiri (`pagination-range.spec.ts`, pola sama kayak `id.spec.ts` — pure logic, bukan `.svelte.spec.ts`).
  - **Compound 7-part**: `Pagination` (root `<nav>`, orchestrator — manggil `getPaginationRange` internal terus render default `PaginationList`/`PaginationItem`/`PaginationLink`/`PaginationEllipsis` otomatis), `PaginationList` (`<ul>`), `PaginationItem` (`<li>`), `PaginationLink` (tombol nomor halaman, `active` prop → `aria-current="page"` + `data-active`, pola `child` snippet buat router-link composability kayak `BreadcrumbLink`), `PaginationEllipsis` (`aria-hidden`, "…" doang — gak ada sr-only text di dalamnya karena percuma, wrapper udah `aria-hidden`, sama disiplin kayak `BreadcrumbSeparator`), `PaginationPrevious`/`PaginationNext` (tombol chevron+teks, accessible name dari visible text langsung — gak perlu `aria-label` terpisah).
  - **Pertama kalinya root component nge-import & auto-render sibling compound part-nya sendiri** — beda dari `Tabs`/`Breadcrumb`/`Table` yang semua part-nya dirakit manual sama konsumen. Tapi semua part tetep diexport publik di `index.ts` — escape hatch buat yang mau assembly manual/custom (mis. custom icon per halaman) tetep ada.
  - Escape hatch tambahan: prop `item` (snippet override per nomor halaman, pola sama kayak `item` snippet combobox) — cuma berlaku ke nomor halaman, gak ke ellipsis/previous/next.
  - `currentPage` bindable + `onPageChange` callback — pola sama persis kayak `value`/`onValueChange` combobox.
  - `labels` terstruktur (`nav`/`previous`/`next`/`page` function) — gak ada hardcode English tanpa override, termasuk `nav` yang notabene `Breadcrumb` sendiri hardcode `aria-label="breadcrumb"` tanpa override (`Pagination` sengaja lebih ketat ngikutin skill `accessibility`).
- [x] `empty-state` — selesai (2026-08-23), Tier 2, tuntas. Single component (bukan compound) — sama kelasnya kayak `alert`, variance layout-nya rendah (icon-title-description-action, satu bentuk yang dipakai hampir semua app), gak ada alasan buat full compound treatment. Struktur & prop shape literally nyontek `alert` (`icon`/`title`/`description` snippet + `children` buat action, `classes` terstruktur per-part) — bedanya: layout `flex-col items-center text-center` (bukan horizontal kayak alert), gak ada `variant`/border/background default (biar gak nested-double-border kalau ditaro di dalam `Card`/`Table`/container lain yang udah punya border sendiri — liat story "Inside a table"), icon lebih besar (`size-10`, ikon ilustrasi bukan ikon kecil notifikasi), `role="status"` (bukan `role="alert"` — live region polite, buat kasus umum "hasil search/filter jadi kosong" yang wajar di-announce ke AT tapi gak urgent, beda dari alert yang assertive).
- [x] `data-table` — selesai (2026-08-24), Tier 3. Sesuai keputusan arsitektur yang udah disepakati sebelumnya (lihat riwayat di bagian Tier 3 di bawah): konsumen manggil `createSvelteTable()` sendiri, komponen di sini cuma thin renderer di atas part `table` yang udah ada, pake `FlexRender` dari `@tanstack/svelte-table` (`peerDependencies`, bukan `dependencies` biasa). Compound 2-part: `DataTable` (root — render `Table`/`TableHeader`/`TableBody`/`TableRow`/`TableHead`/`TableCell` dari header group & row model instance TanStack, `caption` snippet opsional, `empty` snippet override buat state kosong — default-nya reuse `EmptyState` yang udah ada) dan `DataTableColumnHeader` (tombol sort per kolom, cuma dirender kalau `column.getCanSort()` true, chevron icon nunjukin arah asc/desc/unsorted, `aria-sort` di-set di `TableHead` induknya, bukan di tombolnya sendiri). Row selection (`row.getIsSelected()`) dipassing ke `TableRow`'s `selected` prop yang emang udah disiapin dari `table` (lihat catatan `table` di atas) — gak ada state/primitive baru. `TFeatures extends TableFeatures, TData extends RowData` generic, pola sama disiplin generic pertama `combobox` (`ComboboxValue`). Filtering sengaja gak dibakein UI (didokumentasiin polanya doang), sesuai keputusan awal.

### Date & time

- [x] `calendar` — selesai (2026-08-23), Tier 3, komponen pertama yang butuh dependency baru. Pakai **`@internationalized/date`** (bukan native `Date`) — masuk `dependencies` biasa (bukan `peerDependencies` kayak `@tanstack/svelte-table`, karena dipakai internal buat date math, bukan instance yang consumer construct sendiri). `value` bindable bertipe `CalendarDate` (immutable, timezone-safe), bukan native `Date` — konsumen convert sendiri lewat `.toDate(timeZone)` kalau butuh.
  - **`src/lib/utils/calendar-grid.ts`** — pure function `getCalendarGrid({ date, locale })`, return matrix minggu (`CalendarCell[][]`), pola sama persis `pagination-range.ts`: delegasiin kalkulasi berat (leap year, week boundary lintas bulan/locale) ke `startOfMonth`/`endOfMonth`/`startOfWeek`/`endOfWeek` dari `@internationalized/date`, terus tinggal walk day-by-day chunking ke baris 7. Ada spec sendiri (`calendar-grid.spec.ts`, pure logic, termasuk kasus leap year dan locale week-start beda).
  - **Semi-headless kayak `pagination`, bukan full-headless kayak `table`** — alasan sama: variasi konten grid tanggal rendah, dan "bagian susah"-nya (date math) justru persis yang bakal dipaksa diulang konsumen kalau full headless.
  - Compound minimal 2-part: `Calendar` (root — header nav prev/next/label + weekday row + grid, auto-render semua, gak dipecah jadi sub-part kayak `PaginationPrevious`/`PaginationNext` karena header nav bukan sesuatu yang independently reusable di luar konteks kalender ini — beda dari `PaginationLink` yang literally tombol nomor halaman standalone) dan `CalendarDay` (tombol sel tanggal, diexport + ada `.variants.ts` sendiri, dipakai default tapi bisa di-override penuh lewat `day` snippet di root — pola escape-hatch sama persis `Pagination`'s `item` snippet, termasuk keterbatasan yang sama: snippet override gak dapet click-wiring gratis, consumer pegang kendali penuh).
  - **`type: 'single' | 'range'` discriminated union**, pola sama `Accordion`'s `type: 'single'|'multiple'` — `value` jadi `CalendarDate | undefined` atau `{ start, end }`. Dipilih di awal (dibahas sebelum mulai) atas permintaan, bukan default single-only.
  - **Keyboard grid nav 2D dibikin lokal di `Calendar.svelte`, sengaja gak lewat `roving-focus.ts`** — primitive itu cuma linear 1D (`focusAdjacent(delta: 1|-1)`, gak ngerti konsep baris/kolom), konsisten disiplin "jangan generalize primitive sebelum consumer kedua bener-bener butuh" (sama kayak keputusan combobox soal virtual-focus). Arrow Left/Right (±1 hari), Up/Down (±7 hari), Home/End (awal/akhir minggu via `startOfWeek`/`endOfWeek`), PageUp/PageDown (±1 bulan) — subset APG Date Picker Grid pattern (Shift+PageUp/Down buat lompat tahun dan Ctrl+Home/End sengaja gak diikutin, dianggap enhancement opsional, sama semangat kayak `accordion` skip arrow-nav antar header).
  - **Sel tanggal disabled (di luar `minValue`/`maxValue` atau `isDateDisabled`) pakai `aria-disabled`, bukan native `disabled` attribute** — beda dari kebiasaan lib ini (checkbox/button pakai native disabled). Alasan: native `disabled` bikin elemen gak bisa di-`focus()` sama sekali, padahal ARIA composite grid pattern minta sel di luar rentang tetap keyboard-reachable (arrow key tetap bisa lewatin, cuma gak bisa diaktifin) — kalau native disabled dipakai, arrow-key navigation bakal macet begitu nyampe sel disabled. Dicek eksplisit di test (`Calendar.svelte.spec.ts`: `hasAttribute('disabled')` harus `false`).
  - **Nama hari (day-of-month) doang bukan accessible name yang cukup** — satu grid pasti ada sel bulan-sebelum/sesudah yang angkanya numpuk sama bulan aktif (mis. 29 Feb dan 29 Mar di baris yang sama). Tiap `CalendarDay` dikasih `aria-label` full-date (`DateFormatter` `dateStyle: 'full'`, mis. "Friday, March 15, 2024") biar accessible name-nya unik dan jelas konteks bulannya — teks visible tetep angka doang.
  - Heading bulan/tahun (`aria-live="polite"`) dobel-fungsi sebagai `aria-labelledby` target buat `role="grid"` dan buat announce ganti bulan ke AT.
  - `defaultMonth` prop (opsional) — kontrol bulan awal yang ditampilin pas gak ada `value` (atau `value.start` di mode range), independen dari tanggal hari ini.
- [x] `date-picker` — selesai (2026-08-23), Tier 3. **Single component, bukan compound** — pola sama `Combobox` (bukan `Pagination`/`Table`), karena trigger+popup itu satu unit kohesif yang gak independently composable.
  - **Trigger `<button>`, bukan `<input readonly>`** (keputusan disepakati sebelum mulai, atas permintaan) — semantik lebih jelas buat AT (gak ada ambiguitas readonly-input yang emang debatable di WAI-ARIA APG), dan `aria-haspopup`/`aria-expanded` + keyboard activation (Enter/Space) udah gratis dari native button. `aria-haspopup="grid"` (bukan `"dialog"`) karena konten popup-nya emang `role="grid"` (`Calendar`), bukan dialog beneran — popup-nya non-modal, gak pakai `focus-trap` (beda dari `Dialog`/`Drawer`), cuma `dismissable-layer` (Esc + outside-click), pola sama kayak `Combobox`/`Popover`/`Dropdown`.
  - **Read-only di v1** — gak ada mode diketik manual/parsing freeform date string (keputusan disepakati sebelum mulai: parsing tanggal lintas locale/format itu rabbit hole mahal, gak sepadan buat v1). Nilai ditampilin lewat `DateFormatter` (`dateStyle: 'medium'`), bukan `.toString()` mentah.
  - Reuse `Calendar` penuh (cross-import antar folder komponen publik, pola sama `BreadcrumbEllipsis`→`Popover`/`Combobox`→`Spinner`) — `DatePicker` sendiri gak punya date-math apa pun, cuma passthrough props + intercept `onValueChange` buat nutup popup pas seleksi kelar.
  - **Close-on-select beda per mode**: single langsung nutup begitu satu tanggal dipilih; range tetep kebuka sampai `start` dan `end` lengkap (dua klik), baru auto-close — dan fokus balik ke trigger di kedua kasus (`closeAndFocusTrigger`, pola sama `Combobox`).
  - **Jebakan yang ketemu & difix pas development**: awalnya `handleTriggerKeydown` niru pola `Combobox` yang nangani Enter/Space buat buka popup — ternyata bug, karena trigger di sini beneran `<button>` native (beda dari trigger `Combobox` yang `<div role="combobox">`). Native button udah nyintesis `click` event sendiri pas Enter/Space ditekan, jadi kalau keydown handler juga eksplisit set `open = true`, `onclick={toggleOpen}` yang jalan sesudahnya bakal langsung nutup lagi (toggle dari true balik ke false) — popup keliatan "kedip" doang. Fix: `handleTriggerKeydown` cuma nangani `ArrowDown` (yang emang gak ada native behavior-nya di button), Enter/Space dibiarin ke native click.
  - `name` prop render hidden input(s) buat native form submission — single mode satu `<input type="hidden">` isi ISO string (`CalendarDate.toString()`), range mode dua input `${name}-start`/`${name}-end`, pola mirip `Combobox`'s hidden inputs tapi lebih simpel (gak perlu handle array multi-value).
  - `labels`/`locale`/`minValue`/`maxValue`/`isDateDisabled`/`defaultMonth` full passthrough ke `Calendar` di dalam popup.

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

- [x] `focus-trap` — dipakai `dialog`, `drawer`.
- [x] `scroll-lock` — dipakai `dialog`, `drawer`.
- [x] `dismissable-layer` — Esc + click-outside + stacking. Dipakai `popover`, `dropdown`, `dialog`, `drawer`.
- [x] `roving-focus` — navigasi panah + typeahead. Dipakai `dropdown`, `tabs`; combobox/menubar/radio group tinggal pakai. (`select` ternyata gak butuh — native `<select>` udah punya keyboard nav sendiri, lihat catatan `select` di atas.)
- [x] `id` — `createIds`/`idFor` untuk `aria-labelledby` / `aria-controls`. Dipakai `dialog`, `tabs`, `accordion`.

---

## Tier 1 — hampir semua aplikasi butuh

Semua selesai.

## Tier 2

Semua selesai.

- [x] `combobox` / `autocomplete` — selesai (2026-08-23), di luar giliran. Lihat catatan detail di daftar komponen selesai (bagian Form) di atas.
- [x] `table` — selesai (2026-08-23). Lihat catatan detail di daftar komponen selesai (bagian Data display) di atas.
- [x] `pagination` — selesai (2026-08-23). Lihat catatan detail di daftar komponen selesai (bagian Data display) di atas.
- [x] `empty-state` — selesai (2026-08-23). Lihat catatan detail di daftar komponen selesai (bagian Data display) di atas.

## Tier 3 — mahal, tunda

- [x] `calendar` — selesai (2026-08-23). Lihat catatan detail di daftar komponen selesai (bagian Date & time) di atas.
- [x] `date-picker` — selesai (2026-08-23). Lihat catatan detail di daftar komponen selesai (bagian Date & time) di atas.
- [ ] `command` (command palette) — ditunda ke versi selanjutnya (2026-08-23, atas permintaan), gak dikerjain di Tier 3 ini. Lihat bagian "Ditunda ke versi selanjutnya" di bawah.
- [x] `data-table` (sorting / filtering / selection) — selesai (2026-08-24). Lihat catatan detail di daftar komponen selesai (bagian Data display) di atas.

### Ditunda ke versi selanjutnya

Komponen berikut sengaja dikeluarkan dari scope Tier 3 sekarang (2026-08-23, atas permintaan) — masuk daftar tunggu buat versi library selanjutnya, bukan dibatalkan:

- [ ] `command` (command palette)
- [ ] `carousel`
- [ ] `tree`
- [ ] `resizable`

---

## Urutan pengerjaan yang disarankan

1. ~~Audit + ekstrak primitive~~ — selesai. `dismissable-layer`, `focus-trap`, `scroll-lock`, `roving-focus`, `id` ada di `src/lib/utils/`.
2. ~~`dialog`~~ — selesai. Primitive tervalidasi lewat consumer nyata; pola default-animation + centering-lewat-wrapper siap dicontek komponen overlay berikutnya.
3. ~~Batch murah — `alert`~~ — selesai, plus token `warning`/`success` baru ditambah ke theme (lihat catatan di bawah). Sisa batch murah: `separator`, `avatar`, `spinner`. ← next
4. ~~`toast`~~ — selesai duluan dari urutan awal (di luar giliran, atas permintaan) — polanya beda dari komponen lain (store singleton + API imperatif), lihat catatan di bawah.
5. ~~`select`~~ — selesai (2026-08-23), di luar giliran (dikerjakan sebelum `tabs` atas permintaan). Ternyata jauh lebih murah dari estimasi awal — native `<select>`, bukan custom listbox, jadi gak kena beban `floating`/`roving-focus`/`id`.
6. ~~`tabs`~~ — selesai (2026-08-23). Pakai `roving-focus` + `id` persis sesuai rencana.
7. ~~`separator`~~ — selesai (2026-08-23), di luar giliran (batch murah, sebelum `accordion`). Tanpa primitive, sesuai rencana.
8. ~~`avatar`~~ — selesai (2026-08-23), di luar giliran (batch murah, atas permintaan). Tanpa primitive, sesuai rencana. Tier 1 sekarang tuntas semua.
9. ~~`accordion`~~ — selesai (2026-08-23). Pakai `id` (`idFor` per-item, `aria-controls`/`aria-labelledby`-style association) — `roving-focus` sengaja gak dipakai, arrow-key nav antar header itu enhancement opsional di APG, bukan wajib (Enter/Space via native `<button>` udah cukup).
10. ~~`spinner`~~ — selesai (2026-08-23), di luar giliran (batch murah, atas permintaan). Tanpa primitive.
11. ~~`drawer`~~ — selesai (2026-08-23), atas permintaan. Semua primitive tervalidasi lewat `dialog`, sesuai rencana. Bug ketemu pas testing manual: overlay `dialog-overlay-out` (150ms) kelar duluan sebelum content `drawer-content-out-*` (200ms), tanpa `animation-fill-mode: forwards` overlay-nya snap balik opaque sebelum akhirnya unmount — keliatan kayak flicker. Fix: tambah `forwards` ke semua token `--animate-*` di `index.css` (dialog, drawer, toast — bukan cuma drawer, biar gak kejadian lagi kalau ada durasi mismatch lain nanti). Lihat catatan "animation-fill-mode" di bawah.
12. ~~`breadcrumb`~~ — selesai (2026-08-23), di luar giliran (batch murah, atas permintaan). Compound 6-part (`Breadcrumb`/`BreadcrumbList`/`BreadcrumbItem`/`BreadcrumbLink`/`BreadcrumbPage`/`BreadcrumbSeparator`), tanpa primitive. `BreadcrumbLink` pakai pola `child` snippet (asChild-equivalent) buat router-link composability.
13. ~~`combobox`~~ — selesai (2026-08-23), di luar giliran (Tier 2, diprioritasin atas permintaan, di-port dari implementasi existing di project lain). Lihat catatan detail di daftar komponen selesai (bagian Form) di atas.
14. ~~`table`~~ — selesai (2026-08-23), sesuai urutan Tier 2. Lihat catatan detail di daftar komponen selesai (bagian Data display) di atas.
15. ~~`pagination`~~ — selesai (2026-08-23), di luar giliran (atas permintaan, biasanya `empty-state` duluan sesuai urutan Tier 2). Lihat catatan detail di daftar komponen selesai (bagian Data display) di atas.
16. ~~`empty-state`~~ — selesai (2026-08-23). Lihat catatan detail di daftar komponen selesai (bagian Data display) di atas. **Tier 2 tuntas semua.**
17. ~~`calendar`~~ + ~~`date-picker`~~ — selesai (2026-08-23), di luar giliran Tier 3 (diprioritasin atas permintaan sebelum `data-table`/`command`/dst). Dependency baru `@internationalized/date` ditambah khusus buat ini. Lihat catatan detail di daftar komponen selesai (bagian Date & time) di atas.
18. ~~`data-table`~~ — selesai (2026-08-24), sesuai urutan Tier 3. Lihat catatan detail di daftar komponen selesai (bagian Data display) di atas. **Tier 3 tuntas** kecuali `command`/`carousel`/`tree`/`resizable` yang ditunda ke versi selanjutnya (2026-08-23, atas permintaan) — lihat bagian "Ditunda ke versi selanjutnya" di Tier 3.

Di luar urutan ini: `drawer`/`sheet` (Tier 2) sekarang murah dikerjakan kapan saja karena semua primitive-nya sudah terbukti lewat `dialog` — naikkan prioritasnya kalau ada kebutuhan konkret.

---

## Rencana refactor: migrasi visual ke gaya Linear

Status: **selesai semua** (2026-08-23) — step 1 (tokenisasi), step 2 (revisi skill), step 3 (refactor 25 komponen). Detail per komponen di bawah.

**Tujuan.** Geser bahasa visual library dari "SaaS Soft Minimalist" (skill `design-theme` saat ini) ke arah gaya Linear app: density lebih tinggi, spacing lebih ketat, shadow nyaris flat dengan border sebagai pemisah utama, dark-first, typography lebih tajam.

**Warna primary TIDAK ikut berubah.** Warna brand (`--primary`, `--primary-hover`, `--ring`) tetap warna client, bukan ungu ala Linear — yang diadopsi cuma pola/struktur (density, spacing, shadow, border, typography), bukan hue-nya.

### Kenapa mahal — dan di mana letak mahalnya

Layer warna sudah tersentralisasi lewat semantic token di `index.css` (satu titik ganti, otomatis nyebar). Layer spacing/radius/shadow/typography **belum** ditokenisasi dengan cara yang sama — tiap komponen menulis literal Tailwind class sendiri (`p-4`, `rounded-md`, `shadow-sm`, `gap-3`, dst) di file `.svelte`-nya masing-masing dan di `cva` variant-nya. Refactor ini karena itu menyentuh semua **25 komponen**, bukan satu file.

Biaya per komponen:

- Audit + edit manual class density/spacing/shadow/radius — gak ada satu titik ganti sampai step tokenisasi (di bawah) selesai.
- `cva` variant (size/variant prop) ikut kena karena spacing nempel di situ.
- Habis density berubah, hit-target elemen kecil (`button`, `checkbox`, `switch`, `radio`, `toggle`) harus dicek ulang terhadap skill `accessibility` — jangan turun di bawah minimum tap area.
- Storybook axe test (`test: 'error'`) jalan ulang tiap komponen buat mastiin gak ada regresi a11y dari perubahan visual.
- Ini breaking change _visual_ (bukan breaking API/export) buat consumer yang sudah pakai versi lama — perlu diberi tahu lewat changelog/versioning, bukan cuma patch diam-diam.

### Urutan yang disarankan

1. ~~**Tokenisasi dulu**~~ — selesai (2026-08-23). Lihat catatan "Density scale token" di bawah untuk detail apa yang ditambah dan kenapa radius/shadow ternyata gak butuh token baru.
2. ~~**Revisi skill `design-theme`**~~ — selesai (2026-08-23). Nama diganti "SaaS Compact Minimalist UI" (dari "Soft Minimalist"), diikutin di [CLAUDE.md](../CLAUDE.md). Aturan baru: radius default `rounded-md` buat kontrol/`rounded-lg` buat surface besar (dulu `rounded-lg` blanket), shadow cuma buat elemen floating dicap `shadow-sm` (dulu boleh sampai `shadow-md`, dan boleh dipasang di elemen resting), padding wajib lewat skala bernama step 1 (`p-compact`/`p-surface`/`gap-cozy` dst, bukan `p-4`/`p-6` reflex), line-height UI text `leading-snug`/`leading-tight` (dulu default relaxed). Skill ada catatan "Migration status" eksplisit: aturan baru cuma wajib buat komponen yang baru dibuat/diedit — komponen lama gak perlu disentuh di luar step 3.
3. ~~**Refactor komponen satu per satu**~~ — selesai (2026-08-23), semua 25 komponen. Detail per komponen di bawah.
   - [x] `button` — selesai (2026-08-23). `rounded-lg` → `rounded-md`, `gap-2` → `gap-tight` (spinner/icon-to-label gap), size `md` horizontal padding `px-4` → `px-control-x` (nilai sama, sekarang lewat token). Size `sm`/`lg` (`px-3`/`px-6`) sengaja dibiarin literal — gak ada named role buat itu di skill, dan tinggi (`h-8`/`h-10`/`h-12`) gak disentuh karena skill gak ngatur scale tinggi/hit-target, itu ranah `accessibility` skill. Vitest (26 test, 4 file) tetap hijau.
   - [x] `badge` — selesai (2026-08-23). `rounded-full` → `rounded-md` (skill: pill cuma buat count-badge/status-dot yang genuinely bulat — badge di sini dipakai generik buat tag teks kayak "New"/"Active", bukan counter; status dot-nya sendiri di story punya `rounded-full` terpisah, gak kesentuh). `gap-1` → `gap-tight` (dot/icon-ke-label gap, 0.25rem → 0.375rem). `px-2.5`/`py-0.5` dibiarin literal — gak ada named spacing role buat padding sekecil itu. Spec `lets a consumer class override an internal one` diupdate: override diuji pakai `rounded-full` (dulu `rounded-md`, jadi trivial pas itu jadi default baru) biar tetep nguji dedupe class yang beneran konflik. Vitest (9 test, 2 file) tetap hijau.
   - [x] `text-field` — selesai (2026-08-23). `rounded-lg` → `rounded-md`, `gap-2` → `gap-tight` (prefix/input/suffix gap). Size `lg` horizontal padding `px-4` → `px-control-x` (nilai sama, 1rem) — beda dari `button` yang kena di size `md`, karena di sini `lg` yang kebetulan senilai token; `sm`/`md` (`px-3`) dibiarin literal. `password-field` ikut kebawa gratis karena wrap `TextField`, gak ada variants file sendiri. Vitest (28 test, 4 file) tetap hijau.
   - [x] `textarea` — selesai (2026-08-23). `rounded-lg` → `rounded-md`. Padding (`p-2`/`p-3`/`p-4`) dan gap textarea-ke-counter (`gap-1`) **sengaja gak diganti** — beda dari `button`/`text-field`, di sini gak ada named role yang beneran cocok: `p-compact` perannya "list/menu/popover row", bukan padding body form control, dan `gap-tight` perannya "icon-ke-label", bukan textarea-ke-counter. Ganti gara-gara nilainya kebetulan sama tanpa peran yang cocok = penyalahgunaan token, jadi dibiarin literal. Ini nunjukkin ada lubang di skala saat ini: belum ada role "form control full padding" — dicatat, bukan dipaksa ditambal sekarang (skill: token baru cuma ditambah kalau ada role yang genuinely gak cocok, bukan spekulatif). Vitest (19 test, 2 file) tetap hijau.
   - [x] `password-field` — selesai (2026-08-23), gak ada perubahan. Sudah kebawa gratis waktu `text-field` direfactor (lihat catatan di sana), dan toggle button visibilitas-nya sendiri udah `rounded-md` dari awal, gak ada padding/gap literal buat diaudit.
   - [x] `label` — selesai (2026-08-23). `gap-1` → `gap-tight` (gap teks label ke marker `*` required — bukan icon-to-label literal, tapi keluarga yang sama: elemen kecil nempel di sebelah teks, jadi dipake). Ditambah `leading-snug` — skill baru nyebut eksplisit "labels" sebagai contoh UI text yang kena aturan line-height ketat. Gak ada radius/shadow/padding buat diaudit (komponen ini cuma `<label>` inline, gak ada surface). Vitest (11 test, 2 file) tetap hijau.
   - [x] `helper-text` — selesai (2026-08-23). Ditambah `leading-snug` — caption pendek di bawah form field, masuk kategori "UI text/labels" sama kayak `label`, bukan "longer-form body copy". Gak ada radius/shadow/padding/gap buat diaudit (cuma `<p>` inline). Vitest (10 test, 2 file) tetap hijau.
   - [x] `checkbox` — selesai (2026-08-23), gak ada perubahan. Udah `rounded-md` dari awal, gak ada shadow, gak ada padding/gap literal yang match named role manapun. Ukuran kotak (`size-4/5/6`) sengaja gak disentuh — itu hit-target, ranah `accessibility` skill, bukan density skill (dicek ulang skill `accessibility` sebelum nyimpulkan ini — gak ada angka minimum tap area spesifik di sana, tapi shrink ukuran kontrol tetep di luar scope density refactor).
   - [x] `radio` — selesai (2026-08-23), gak ada perubahan. `rounded-full` di sini (shell + dot indicator) bukan pilihan style pill kayak `badge` kemarin — itu bentuk wajib radio button secara native/semantik, jadi di luar cakupan aturan radius kontrol. Gak ada shadow/gap/padding literal yang relevan. Ukuran (`size-4/5/6`) sama kayak `checkbox`, hit-target territory, gak disentuh.
   - [x] `switch` — selesai (2026-08-23), gak ada perubahan class, tapi ada satu keputusan yang perlu dicatat. Track + thumb sama-sama `rounded-full` — bentuk wajib toggle switch, sama kayak `radio`, di luar cakupan aturan radius. Sizes hit-target territory, gak disentuh. **Thumb-nya pakai `shadow-sm`** — sengaja dibiarin meski skill bilang "resting/in-flow element gak boleh shadow": thumb ini knob affordance (kayak Linear/iOS/Material toggle), beda kategori dari card/list-item yang diatur rule itu, dan nilainya udah di plafon (`shadow-sm`, gak pernah lebih) jadi gak melanggar cap-nya juga.
   - [x] `button-group` — selesai (2026-08-23), gak ada perubahan. `rounded-*-none` dst cuma strip sudut spesifik anak `Button` — gak hardcode nilai radius, otomatis ngikutin radius Button sekarang. `-ml-px`/`-mt-px` itu trik border-collapse 1px, bukan spacing role. Gak ada shadow.
   - [x] `card` — selesai (2026-08-23). `Card` sendiri udah compliant dari awal (`rounded-lg` emang nilai yang bener buat surface besar per skill, gak ada shadow — border-only, pas). `CardHeader`/`CardContent`/`CardFooter`: `p-6` → `p-surface` (match persis, 1.5rem, role "card/dialog surface padding"). `CardFooter`: `gap-2` → `gap-cozy` (match persis, 0.5rem, role "default inter-element gap" — footer isinya button-button sejajar). `CardTitle` ditambah `leading-tight` (heading), `CardDescription` ditambah `leading-snug` (caption pendek, bukan long-form prose). `CardHeader`'s `gap-1.5` (title-ke-description) **dibiarin literal** — nilainya kebetulan sama `gap-tight` (0.375rem) tapi perannya beda (vertical heading stack, bukan icon-to-label), jadi gak dipaksa ganti, sama disiplin kayak keputusan `textarea`. Urutan CSS `p-surface`/`pt-0` dicek di compiled output, override tetap bener. Vitest (18 test, 2 file) tetap hijau.
   - [x] `collapsible` — selesai (2026-08-23). Container luar (`rounded-lg border`) **dibiarin** — udah bener buat surface. Trigger button-nya juga **dibiarin `rounded-lg`** (bukan diturunin ke `rounded-md` kayak kontrol lain) karena harus senada sama radius container: container gak punya `overflow-hidden`, jadi hover background trigger bakal nembus keluar sudut container yang melengkung kalau radiusnya beda — ini kasus dependency antar-komponen, bukan pengecualian sembarangan. Sisanya kena: trigger `gap-2` → `gap-tight` (label-ke-chevron), `px-4` → `px-control-x`, `py-3` → `py-compact` (row klik, role "dense rows" cocok), ditambah `leading-snug` (label pendek). Content wrapper: `px-4` → `px-control-x` (align sama trigger), `pb-3` → `pb-compact`; teks isinya **gak** ditambah `leading-snug` karena `children` bebas dari consumer, bisa berupa paragraf panjang, bukan cuma label pendek. Vitest (14 test, 2 file) tetap hijau, build compile bersih.
   - [x] `dialog` — selesai (2026-08-23). Komponen overlay pertama yang direfactor — ini yang beneran nguji aturan shadow baru. Trigger button (bentuknya identik `Button` variant `outline`, jadi kena set perubahan yang sama): `rounded-lg` → `rounded-md`, `gap-2` → `gap-tight`, `px-4` → `px-control-x`, ditambah `leading-snug`. Content panel (elemen floating, satu-satunya yang boleh shadow per skill): `rounded-lg` **dibiarin** (udah bener buat surface besar), `shadow-md` → `shadow-sm` (skill eksplisit larang `shadow-md` ke atas walau buat overlay), `p-6` → `p-surface` (role-nya literally nyebut "dialog" di skill). Title ditambah `leading-tight` (heading), description ditambah `leading-snug`. Close button (icon-only, `size-8`, posisinya `top-4 right-4` — cukup jauh dari sudut container jadi gak ada risiko clipping kayak `collapsible`): `rounded-lg` → `rounded-md`. `mt-1` (title-ke-description) dan `mt-4` (header-ke-body) dibiarin literal, gak ada role yang cocok. Vitest (29 test, 2 file) tetap hijau, build compile bersih.
   - [x] `dropdown` — selesai (2026-08-23). Trigger sama persis kasusnya kayak `dialog` kemarin (bentuknya identik): `rounded-lg` → `rounded-md`, `gap-2` → `gap-tight`, `px-4` → `px-control-x`, ditambah `leading-snug`. Content menu (floating): `shadow-md` → `shadow-sm`, radius `rounded-lg` dibiarin (surface), `p-1` dibiarin literal (gak ada role yang cocok). `DropdownItem` udah `rounded-md` dari awal (gak berubah): `gap-2` → `gap-tight`, `px-3` → `px-compact` (role-nya literally nyebut "menu items"), `py-2` **dibiarin** — gak ada token yang match nilai 0.5rem buat padding vertikal (`--spacing-cozy` nilainya sama tapi perannya gap, bukan padding). Spec trigger-override diupdate ke `rounded-full` (dulu `rounded-md`, jadi trivial pas itu jadi default baru), sama pola kayak fix `badge` kemarin. Vitest (23 test, 2 file) tetap hijau, build compile bersih.
   - [x] `hover-card` — selesai (2026-08-23). Trigger cuma `<span class="inline-flex">` pembungkus `children` konsumen, gak ada yang diaudit. Content panel (floating): `shadow-md` → `shadow-sm`, radius `rounded-lg` dibiarin (surface). `p-4` **dibiarin literal** — beda dari `dialog`/`card` yang `p-6`-nya match persis `p-surface`, di sini nilainya (1rem) gak match token manapun: `p-compact` perannya pas ("popover content") tapi nilainya beda (0.75rem), `px-control-x` nilainya sama (1rem) tapi perannya buat button/input bukan padding kartu penuh. Value gak match role = dibiarin, konsisten sama keputusan `textarea`. Vitest (17 test, 2 file) tetap hijau.
   - [x] `popover` — selesai (2026-08-23). Trigger sama persis kasusnya kayak `dialog`/`dropdown`: `rounded-lg` → `rounded-md`, `gap-2` → `gap-tight`, `px-4` → `px-control-x`, ditambah `leading-snug`. Content panel sama persis kasusnya kayak `hover-card`: `shadow-md` → `shadow-sm`, radius `rounded-lg` dibiarin, `p-4` dibiarin literal (alasan sama — gak ada token yang match value-nya). Spec trigger-override diupdate ke `rounded-full`, pola sama kayak `badge`/`dropdown`. Vitest (17 test, 2 file) tetap hijau, build compile bersih.
   - [x] `progress` — selesai (2026-08-23), gak ada perubahan. `rounded-full` (track + fill) bentuk konvensional progress bar, bukan pilihan style, sama alasannya kayak `radio`/`switch`. Gak ada padding/gap/shadow. Tinggi (`h-1.5/2/3`) ketebalan visual, bukan hit-target atau spacing role.
   - [x] `skeleton` — selesai (2026-08-23), gak ada perubahan. Udah `rounded-md` dari awal, gak ada padding/gap/shadow buat diaudit — komponen ini cuma satu `<div>` placeholder.
   - [x] `slider` — selesai (2026-08-23), gak ada perubahan. `rounded-full` (track + thumb) bentuk konvensional, sama kategori `radio`/`switch`/`progress`. `shadow-sm` di thumb sama persis alasannya kayak thumb `switch` (knob affordance, udah di plafon), konsisten dibiarin. Gak ada padding/gap.
   - [x] `toast` — selesai (2026-08-23). `ToastItem` (floating, boleh shadow): `shadow-md` → `shadow-sm`, `rounded-lg` dibiarin (surface), `p-4` dibiarin literal (alasan sama kayak `hover-card`/`popover`). `gap-3` → `gap-loose` (match persis 0.75rem — gap antara blok teks sama tombol close, dianggap masuk kategori "elemen distinct dalam satu row", bukan icon-to-label). Title + description ditambah `leading-snug` (notifikasi pendek, bukan long-form). Close button: `rounded-lg` → `rounded-md` (posisinya flex child di dalam `p-4`, jauh dari sudut, gak ada risiko clipping kayak `collapsible`). `Toaster` (viewport): `gap-2` → `gap-cozy` (match persis, stack antar toast = "default inter-element gap"), `p-4` (inset dari tepi layar) dibiarin — bukan padding surface, gak ada role yang cocok. Vitest (20 test, 2 file) tetap hijau, build compile bersih.
   - [x] `toggle` — selesai (2026-08-23). Bentuknya identik `button` (base + 3 size sama persis): `rounded-lg` → `rounded-md`, `gap-2` → `gap-tight`, size `md` `px-4` → `px-control-x`; `sm`/`lg` dibiarin literal, sama kayak `button`. Spec override diupdate ke `rounded-full` (pola sama kayak `badge`/`dropdown`/`popover`). Vitest (18 test, 2 file) tetap hijau.
   - [x] `tooltip` — selesai (2026-08-23). Trigger cuma `<span>` pembungkus, gak diaudit. Content (floating): `shadow-md` → `shadow-sm`. Radius **udah `rounded-md` dari awal, dibiarin** — beda dari `dialog`/`dropdown`/`popover`/`hover-card` yang surface-nya `rounded-lg`, tooltip itu bubble kecil bukan panel besar, jadi masuk kategori "kontrol/elemen kecil" yang skill emang minta `rounded-md`. `px-2`/`py-1` dibiarin literal — kekecilan, gak ada token yang match. Vitest (19 test, 2 file) tetap hijau.
   - [x] `typography` — selesai (2026-08-23). Gak ada radius/shadow/padding/gap (murni text styling). `h1`-`h4` ditambah `leading-tight` (heading). `small` ditambah `leading-snug` (caption pendek, kayak `label`/`helper-text`). `body` dan `muted` **dibiarin** — ini justru komponen yang eksplisit disebut skill sebagai pengecualian "prose content", tetep di line-height default Tailwind buat ukuran fontnya. Vitest (9 test, 2 file) tetap hijau.
   - [x] `alert` — selesai (2026-08-23). Bentuknya paralel sama `toast` (resting version-nya): `gap-3` → `gap-loose` (icon-ke-content-block, sama kategori "elemen distinct dalam row" kayak keputusan `toast`), title + description ditambah `leading-snug`. Radius (`rounded-lg`, surface) dan `p-4` dibiarin — alasan sama kayak `toast`/`hover-card`/`popover`. Vitest (20 test, 2 file) tetap hijau.

   **Step 3 selesai — semua 25 komponen udah dimigrasi ke gaya Linear.** Full suite dicek ulang di akhir: `npm run test:unit` (57 file, 416 test) dan `--project storybook` (25 story, 142 axe check) semua hijau, gak ada regresi a11y dari perubahan radius/shadow/spacing/line-height di seluruh library.

4. Tiap komponen yang direfactor: update spec/story kalau ada assertion yang terikat ke class lama, re-run axe check.

Belum ada estimasi waktu/token pasti — sifatnya mekanis dan berulang per komponen, bukan kompleks secara logika.

### Density scale token — apa yang ditambah di step 1

Ditambah ke [src/lib/index.css](../src/lib/index.css): blok `@theme` baru berisi skala spacing bernama (`--spacing-control-x/-y`, `--spacing-compact`, `--spacing-surface`, `--spacing-tight/-cozy/-loose`), dipin ke nilai yang sudah paling umum dipakai di `src/lib/components` (disurvei lewat grep) — jadi nambah blok ini **gak mengubah tampilan apa pun** hari ini. (`tight`/`cozy`/`loose`, bukan `--spacing-gap-*` — biar utility yang dihasilkan gak jadi `gap-gap`.)

Ternyata radius dan shadow gak butuh token baru sama sekali: `rounded-lg`/`shadow-sm`/`shadow-md` di komponen sudah resolve ke variabel theme Tailwind sendiri (`--radius-lg`, `--shadow-sm`, `--shadow-md`) — itu sudah jadi satu titik ganti out of the box. Nanti pas mau ubah, tinggal override langsung di `@theme`, gak perlu prep apa pun.

Bedanya sama radius/shadow: token spacing di atas **belum dipakai komponen manapun**. Tailwind `--spacing-*` di namespace theme menghasilkan utility asli (`px-control-x`, `p-compact`, `gap-cozy`, dst), tapi sampai tiap komponen dipindah dari literal (`px-4`, `p-3`, `gap-2`) ke utility semantik ini di step 3, token-nya belum ngaruh apa-apa. Setelah dipindah, ganti density berikutnya baru beneran jadi satu baris di `index.css`, bukan 25 file lagi.

---

## Catatan terbuka

### `animation-fill-mode: forwards` — wajib di semua exit animation `data-slot`

Ketemu pas testing manual `drawer` (2026-08-23): overlay-nya pakai animation `dialog-overlay-out` (150ms, di-reuse dari `dialog`), sementara content-nya pakai `drawer-content-out-*` (200ms). `createPresence` cuma nunggu animasi **content** kelar buat unmount block (lihat `presence.svelte.ts` — `node.getAnimations()` cuma dipanggil di node yang di-track, overlay gak di-track terpisah). Tanpa `animation-fill-mode: forwards`, begitu animasi overlay-nya kelar duluan di 150ms, elemen itu **snap balik ke state sebelum animasi** (opacity 1, full keliatan lagi) karena gak ada apa pun yang nahan di keyframe akhir — ada jeda ~50ms overlay tiba-tiba full opaque lagi sebelum akhirnya ke-unmount bareng content di 200ms. Efeknya keliatan kayak flicker pas exit.

`dialog` sendiri gak pernah kena bug ini karena overlay & content-nya durasinya sama-sama 150ms — dua animasi kelar bersamaan, jadi jeda revert-nya gak sempat ke-paint. Begitu `drawer` bikin overlay & content punya durasi beda, bug-nya baru kelihatan.

Fix: tambah `forwards` ke **semua** token `--animate-*` di `index.css` (dialog overlay/content, drawer per-sisi, toast) — bukan cuma yang kepake drawer, karena kelas bug ini bisa muncul lagi kapan aja ada dua animasi terkait (overlay + content) dengan durasi beda, sekarang atau nanti. Kalau bikin animasi `data-slot` baru buat komponen lain, selalu sertain `forwards` di token `--animate-*`-nya dari awal — jangan nunggu ketauan lewat bug report.

### Kenapa `select` native, bukan custom listbox

Deskripsi awal di Tier 1 nyebut `select` bakal butuh `floating`/`roving-focus`/`id` (asumsi custom combobox-style listbox kayak `Dropdown`). Keputusan aktual (2026-08-23): pakai `<select>` native langsung, cuma dibungkus wrapper buat naruh chevron up-down icon (dekoratif, `pointer-events-none`, posisi `absolute` di kanan) — bukan custom popup.

Alasan: native select dapet keyboard nav, typeahead, dan popup listbox gratis dari browser dan platform assistive tech, sesuai prinsip skill `accessibility` ("prefer a native element whenever one exists"). Konsumen supply `<option>`/`<optgroup>` sendiri lewat `children` snippet — sama kayak native `<select>` biasa, cuma di-style ulang (`appearance-none` + token density/radius sama kayak `TextField`).

**Trade-off yang diterima**: gak ada custom item rendering (icon per-option, dll) — itu ranah `combobox`/`autocomplete` di Tier 2, bukan `select`. Kalau nanti ada kebutuhan konkret buat combobox-style select (search-as-you-type, custom option markup), itu komponen terpisah yang baru akan pakai `floating`/`roving-focus`/`id`, bukan revisi `select` ini.

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

### Keputusan API `toast`

Beda dari komponen lain: perlu provider/singleton store, jadi tidak murni subpath-only seperti sisanya. Keputusan yang diambil (2026-08-23):

- **API imperatif + komponen siap-pakai** — `<Toaster />` dipasang sekali di root app (mis. `+layout.svelte` konsumen), lalu `toast.message/success/warning/danger(title, options?)` dipanggil dari mana saja (event handler, `catch` block, dll). Store singleton module-level (`toast-store.svelte.ts`, pakai `$state` bukan Svelte store klasik) nge-drive keduanya. Alternatif yang ditolak: store-only tanpa UI siap-pakai (headless total) — ditolak karena tiap konsumen harus bikin ulang stacking/animasi/a11y dari nol, beda dari pola alert/dialog yang udah ada.
- **Posisi default `bottom-right`**, configurable lewat prop `position` (6 corner).
- **Auto-dismiss 5 detik, max 3 toast visible, pause-on-hover.** Toast di atas batas `max` nunggu (gak langsung dibuang) — baru render begitu ada slot kosong, dan timer-nya baru mulai jalan begitu dia visible (bukan dari saat di-queue).
- Variant toast pakai token yang sama kayak `alert` (`default`/`danger`/`warning`/`success`) — gak ada token baru.
- Reuse primitive yang sudah ada: `portal` (viewport keluar tree) dan `createPresence` (tunda unmount sampai exit animation kelar), pola sama kayak `dialog`/`popover`. Default animation lewat `@layer components` + `data-slot='toast'`, pola sama kayak dialog (lihat catatan animation di atas).
- Timer per-toast dijadwalin sinkron di top-level script komponen (bukan di dalam `$effect` tanpa dependency), dibersihkan lewat `onDestroy` — kalau dipindah ke `$effect` malah bikin race di test browser (lihat catatan testing di bawah).

### Testing timer real-time itu gak reliable di browser test project ini

`Toaster`/toast punya auto-dismiss dan pause-on-hover yang butuh nunggu waktu betulan buat diuji. Nunggu pakai `setTimeout` biasa (`await new Promise(r => setTimeout(r, ms))`) plus `expect.element(...).not.toBeInTheDocument()` kena flaky parah — kadang lancar ~2 detik, kadang macet belasan detik sampai timeout, gak konsisten walau durasinya udah dibesarin jauh di atas overhead test-infra (lihat juga catatan fix `HoverCard` hover-travel buat kelas masalah yang mirip, soal round-trip pointer). Coordinate-based `userEvent.hover()` juga gak reliable buat toast karena project test browser ini gak load stylesheet apa pun (sama kayak alasan test overlay-click `Dialog` dispatch event langsung, bukan klik koordinat) — layout box toast di test env gak sama kayak di app beneran, jadi hover bisa nembak enter lalu langsung leave lagi.

Fix-nya: pakai `vi.useFakeTimers()` + `await vi.advanceTimersByTimeAsync(ms)` buat kontrol waktu, dan `element.dispatchEvent(new PointerEvent(...))` langsung ke node buat simulasi hover/leave (bukan `userEvent.hover()`). Hasilnya deterministic dan cepat (~140ms buat 15 test, vs belasan detik + kadang gagal). **Pola ini reusable buat komponen lain yang nanti punya delay/timer real-time** (mis. `HoverCard` kalau testnya mau dirapiin ulang, atau `drawer`/`sheet` kalau punya auto-close).

### Hal yang perlu dicek saat menambah komponen

- Folder baru di `src/lib/components/` otomatis publik lewat wildcard `exports` — jangan buat folder yang belum siap jadi API publik.
- Setiap komponen baru butuh spec colocated, bukan cuma halaman demo di `src/routes/`.
- Setiap story dicek axe dengan `test: 'error'` — pelanggaran a11y menggagalkan test run.
