import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { TabsVariant } from './tabs-context.js';

export interface TabsTriggerSnippetProps {
	/** Status apakah tab sedang terpilih/aktif. */
	active: boolean;
	/** Status apakah tab sedang dinonaktifkan. */
	disabled: boolean;
}

export interface TabsTriggerProps extends Omit<HTMLButtonAttributes, 'children'> {
	/** Class tambahan untuk elemen trigger button. */
	class?: string;
	/** Nilai unik yang mengidentifikasi tab ini. */
	value: string;
	/** Override varian tabs untuk trigger ini: 'pill' atau 'underline'. */
	variant?: TabsVariant;
	/** Menandai tombol tab tidak dapat diklik atau dipilih. */
	disabled?: boolean;
	/** Bindable ref ke elemen `<button>`. */
	ref?: HTMLButtonElement | null;
	/** Konten di dalam tombol tab, menerima payload status `{ active, disabled }`. */
	children?: Snippet<[TabsTriggerSnippetProps]> | Snippet;
	/** Snippet opsional child untuk merender elemen kustom (seperti anchor `<a>` router link) alih-alih native button. */
	child?: Snippet<[{ props: Record<string, unknown>; active: boolean; disabled: boolean }]>;
}



