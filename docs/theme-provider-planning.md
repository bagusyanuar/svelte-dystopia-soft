# Perencanaan Implementasi: ThemeProvider & Dynamic Color Theming

Dokumen perencanaan dan panduan arsitektur untuk penambahan fitur **`ThemeProvider`** dan kustomisasi warna bebas (**Primary** & **Accent**) pada `dystopia-linear-lib`.

---

## 1. Latar Belakang & Tujuan

Saat ini, library menggunakan token statis di [src/lib/index.css](../src/lib/index.css) dengan warna brand default (Teal). Meskipun konsumen dapat menimpa variable CSS secara manual di stylesheet mereka, belum ada mekanisme runtime atau komponen resmi yang memudahkan konsumen untuk:
1. Memasukkan warna brand kustom mereka sendiri secara bebas (HEX, RGB, HSL, atau OKLCH).
2. Membedakan antara warna aksi utama (**`primary`**) dan warna penanda/highlight (**`accent`**).
3. Mengontrol mode tema (**`light`**, **`dark`**, **`system`**) dengan sinkronisasi otomatis ke `localStorage` dan preferensi OS (`prefers-color-scheme`).
4. Menerapkan theming baik secara **Global** (seluruh aplikasi) maupun **Scoped** (khusus bagian tertentu, misal preview card, modal, atau multi-tenant dashboard).

---

## 2. Pemisahan Peran Warna (Color Roles)

Agar tidak terjadi tabrakan visual (seperti warna info yang tabrakan dengan warna brand jika brand berwarna merah), sistem token membagi warna menjadi tiga domain:

| Domain | Token | Peran |
| ------ | ----- | ----- |
| **Primary (Brand Action)** | `--primary`<br>`--primary-hover`<br>`--primary-foreground` | Aksi utama: tombol primary, active tab indicator, radio/checkbox checked, link aktif, focus ring. |
| **Accent (Highlight)** | `--accent`<br>`--accent-hover`<br>`--accent-foreground`<br>`--accent-subtle` | Penanda visual: badge highlight, subtle selection, active item background di sidebar/dropdown, table row highlight. |
| **Semantic Status (Isolasi)** | `--info`<br>`--success`<br>`--warning`<br>`--danger` | Status pesan/notifikasi: alert, badge status, toast indicator (Info selalu biru, Success hijau, Warning kuning/amber, Danger merah). **Tidak terpengaruh oleh warna brand**. |

---

## 3. Arsitektur Teknis

### A. Integrasi Tailwind v4 (`@theme inline`)
Tailwind CSS v4 menggunakan `@theme inline` di `index.css`:
```css
@theme inline {
  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-primary-foreground: var(--primary-foreground);

  --color-accent: var(--accent);
  --color-accent-hover: var(--accent-hover);
  --color-accent-foreground: var(--accent-foreground);
}
```
Karena utilitas (`bg-primary`, `text-accent`, dll.) mengacu langsung ke `var(...)`, `ThemeProvider` hanya perlu menyuntikkan CSS variables ke elemen DOM target (`document.documentElement` untuk global, atau elemen pembungkus untuk scoped).

### B. Color Utilities (`color-utils.ts`) — Zero Dependency
Kalkulasi warna dibuat murni dengan algoritma internal yang ringan tanpa dependensi external:
1. **Parser Serbaguna**: Menerima HEX (`#6366f1`), RGB (`rgb(99, 102, 241)`), HSL, atau OKLCH.
2. **Auto Contrast Ratio (WCAG AA 4.5:1)**:
   - Menghitung relative luminance / lightness dari warna latar.
   - Jika warna dasar gelap $\rightarrow$ warna teks (`foreground`) otomatis putih (`oklch(100% 0 0)`).
   - Jika warna dasar terang (misal kuning/krem) $\rightarrow$ warna teks otomatis gelap (`oklch(15% 0.04 260)`).
3. **Auto Hover State**:
   - Menghitung warna hover secara otomatis dengan menurunkan/menaikkan lightness ~8–10%.
4. **Dark Mode Variant Generator**:
   - Jika pengguna hanya menginput 1 warna (misal `#2563eb`), utilitas otomatis menurunkan saturasi dan menaikkan lightness untuk mode gelap agar tidak tenggelam di atas dark surface.
   - Pengguna juga tetap bisa menyediakan nilai spesifik untuk `light` dan `dark` jika ingin kontrol manual.

---

## 4. Desain API (Developer Experience)

### A. Komponen `<ThemeProvider />`

```svelte
<script lang="ts">
  import { ThemeProvider } from 'dystopia-linear-lib';
</script>

<!-- Penggunaan Dasar (Global) -->
<ThemeProvider
  primary="#8b5cf6"
  accent="#06b6d4"
  mode="system"
>
  <App />
</ThemeProvider>
```

#### Dukungan Input Khusus Light & Dark:
```svelte
<ThemeProvider
  primary={{
    light: '#7c3aed',
    dark: '#a78bfa'
  }}
  accent={{
    light: '#0284c7',
    dark: '#38bdf8'
  }}
>
  <App />
</ThemeProvider>
```

#### Mode Scoped (Local Subtree):
```svelte
<!-- Hanya memengaruhi card tertentu tanpa mengubah tema aplikasi secara global -->
<ThemeProvider
  primary="#e11d48"
  scoped
  class="rounded-lg border p-4"
>
  <Button variant="primary">Brand Merah</Button>
</ThemeProvider>
```

### B. Props Interface `<ThemeProvider>`

```ts
export type ThemeMode = 'light' | 'dark' | 'system';

export type ColorInput = string | { light: string; dark: string };

export interface ThemeProviderProps {
  /** Mode tema tampilan. Default `'system'`. */
  mode?: ThemeMode;
  /** Warna primary kustom (HEX, RGB, HSL, atau OKLCH). */
  primary?: ColorInput;
  /** Warna accent kustom (HEX, RGB, HSL, atau OKLCH). */
  accent?: ColorInput;
  /** Key penyimpanan di localStorage. Set `null` untuk menonaktifkan persistensi. Default `'theme'`. */
  storageKey?: string | null;
  /** Jika true, tema hanya diterapkan pada elemen container lokal, bukan pada root <html>. Default `false`. */
  scoped?: boolean;
  class?: string;
  children?: Snippet;
}
```

### C. Helper & State Management (`theme.svelte.ts`)

Menyediakan API imperatif untuk tombol switch tema atau color picker di aplikasi:

```ts
import { theme } from 'dystopia-linear-lib';

// Ganti mode
theme.setMode('dark'); // 'light' | 'dark' | 'system'

// Ganti warna secara dinamis saat runtime (misal dari input color picker)
theme.setCustomColors({
  primary: '#ec4899',
  accent: '#8b5cf6'
});

// Reset ke default tema lib
theme.resetColors();
```

---

## 5. Rencana Tahapan Eksekusi

1. **Fase 1: Tokenisasi CSS di `index.css`**
   - Tambahkan `--accent`, `--accent-hover`, `--accent-foreground`, dan `--accent-subtle` di `:root` dan `[data-theme='dark']`.
   - Expose token tersebut ke `@theme inline` (`--color-accent-*`).

2. **Fase 2: Utilitas Warna (`src/lib/utils/color.ts`)**
   - Buat helper konversi warna (HEX $\rightarrow$ OKLCH/RGB).
   - Buat fungsi penentu kontras foreground (WCAG AA).
   - Buat fungsi pembuat shade hover dan varian dark mode.
   - Buat unit test komprehensif (`color.spec.ts`).

3. **Fase 3: State & Context (`src/lib/theme/`)**
   - Buat reactive store runes (`theme.svelte.ts`) yang menangani:
     - Deteksi prefers-color-scheme OS.
     - Persistensi localStorage.
     - Inject variable CSS ke target element.
   - Sediakan Svelte context (`theme-context.ts`) untuk akses internal komponen anak.

4. **Fase 4: Komponen `<ThemeProvider.svelte>`**
   - Komponen wrapper yang mengikat state, mendukung `scoped` vs `global`.
   - Dukungan SSR safety (guard `window` & `document`).
   - Tulis unit test di `ThemeProvider.svelte.spec.ts`.

5. **Fase 5: Storybook & Dokumentasi**
   - Buat `ThemeProvider.stories.svelte`:
     - Demo interaktif dengan Color Picker live untuk mengubah warna Primary dan Accent.
     - Demo nested / scoped theme (dua container dengan brand berbeda berdampingan).
     - Demo toggle Light / Dark / System.
   - Ekspor komponen dan helper di `src/lib/index.ts` dan package exports.
