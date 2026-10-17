import type { Snippet } from 'svelte';
import type { HTMLSelectAttributes } from 'svelte/elements';
import type { SelectVariantProps } from './Select.variants.js';

export interface SelectClasses {
	/** Class override untuk kontainer pembungkus terluar `<div>` (digabung bersama prop `class`). */
	container?: string;
	/** Class override untuk elemen native `<select>`. */
	select?: string;
	/** Class override untuk kontainer penampung icon chevron/indicator `<span>`. */
	icon?: string;
}

export interface SelectIconSnippetProps {
	disabled: boolean;
	invalid: boolean;
	value: string;
}

export interface SelectChildrenSnippetProps {
	disabled: boolean;
	invalid: boolean;
	value: string;
}

export interface SelectProps
	extends Omit<HTMLSelectAttributes, 'size' | 'value' | 'children'>, SelectVariantProps {
	/** Applied to the outermost wrapper element `<div>`. */
	class?: string;
	/** Granular sub-part class overrides. */
	classes?: SelectClasses;
	/** Primary bindable ref ke elemen native `<select>`. */
	ref?: HTMLSelectElement | null;
	/** Explicit alias untuk ref native `<select>`. */
	selectRef?: HTMLSelectElement | null;
	/** Bindable ref ke kontainer wrapper terluar `<div>`. */
	containerRef?: HTMLDivElement | null;
	/** Nilai yang terpilih (bindable). */
	value?: string;
	/** Callback saat nilai pilihan berubah. */
	onValueChange?: (value: string) => void;
	/** Status disabled interaksi. */
	disabled?: boolean;
	/** Status validasi error (border merah / data-invalid). */
	invalid?: boolean;
	/** Custom icon snippet untuk menggantikan chevron panah default. */
	icon?: Snippet<[SelectIconSnippetProps]>;
	/** `<option>`/`<optgroup>` elements, mendukung opsional state payload. */
	children?: Snippet<[SelectChildrenSnippetProps]>;
}
