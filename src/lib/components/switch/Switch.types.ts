import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import type { SwitchVariantProps } from './Switch.variants.js';

export interface SwitchClasses {
	/** Class override untuk elemen pembungkus root track `<span>`. */
	root?: string;
	/** Class override untuk elemen input checkbox internal. */
	input?: string;
	/** Class override untuk elemen bulatan thumb yang bergeser `<span>`. */
	thumb?: string;
	/** Class override untuk kontainer pembungkus field saat label/description digunakan. */
	field?: string;
	/** Class override untuk label teks. */
	label?: string;
	/** Class override untuk pembungkus label dan description. */
	labelWrapper?: string;
	/** Class override untuk teks deskripsi. */
	description?: string;
}

export interface SwitchThumbSnippetProps {
	checked: boolean;
	disabled: boolean;
}

export interface SwitchLabelSnippetProps {
	checked: boolean;
}

export interface SwitchProps
	extends Omit<HTMLInputAttributes, 'size' | 'type' | 'checked' | 'children'>,
		SwitchVariantProps {
	/** Applied to the container element; `classes` targets the inner parts. */
	class?: string;
	/** Granular sub-part class overrides. */
	classes?: SwitchClasses;
	/** Bindable ref ke elemen native `<input>` element. */
	ref?: HTMLInputElement | null;
	/** Bindable ref ke elemen track pembungkus kontrol `<span>`. */
	rootRef?: HTMLSpanElement | null;
	/** Bindable ref ke container terluar `<div>` saat `label` atau `description` digunakan. */
	fieldRef?: HTMLDivElement | null;
	/** Status aktif/centang switch (bindable). */
	checked?: boolean;
	/** Status error validasi. */
	invalid?: boolean;
	/** Callback saat status checked switch berubah. */
	onCheckedChange?: (checked: boolean) => void;
	/** Custom snippet untuk konten di dalam bulatan thumb (misal ikon sun/moon atau status indicator). */
	thumb?: Snippet<[SwitchThumbSnippetProps]>;
	/** Label teks atau snippet terintegrasi yang otomatis terhubung secara aksesibel dengan switch. */
	label?: string | Snippet<[SwitchLabelSnippetProps]>;
	/** Teks deskripsi pembantu di bawah label. */
	description?: string | Snippet<[SwitchLabelSnippetProps]>;
}
