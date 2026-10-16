import type { Snippet } from 'svelte';
import type { HTMLLabelAttributes } from 'svelte/elements';

export interface LabelClasses {
	/** Class override untuk indikator tanda wajib (`*`). */
	required?: string;
}

export interface LabelProps extends Omit<HTMLLabelAttributes, 'children'> {
	/** Class override untuk elemen root `<label>`. */
	class?: string;
	/** Sub-part classes untuk label. */
	classes?: LabelClasses;
	/** Bindable ref ke elemen root `<label>`. */
	ref?: HTMLLabelElement | null;
	/** Menandai input terkait bersifat wajib diisi dan merender indikator required. */
	required?: boolean;
	/** Menandai input terkait berstatus nonaktif (disabled) dan menerapkan gaya visual teredup. */
	disabled?: boolean;
	/** Snippet kustom opsional untuk mengganti tanda wajib bawaan (`*`). Menerima payload `{ required }`. */
	requiredIndicator?: Snippet<[{ required: boolean }]>;
	/** Konten teks label. Menerima payload `{ required, disabled }`. */
	children: Snippet<[{ required: boolean; disabled: boolean }]>;
}
