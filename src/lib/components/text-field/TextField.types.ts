import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import type { TextFieldVariantProps } from './TextField.variants.js';

export interface TextFieldClasses {
	/** Class override untuk kontainer pembungkus terluar `<div>` (digabung bersama prop `class`). */
	container?: string;
	/** Class override untuk elemen native `<input>`. */
	input?: string;
	/** Class override untuk kontainer snippet `prefix`. */
	prefix?: string;
	/** Class override untuk kontainer snippet `suffix`. */
	suffix?: string;
}

export interface TextFieldProps
	extends Omit<HTMLInputAttributes, 'size' | 'prefix' | 'value'>, TextFieldVariantProps {
	/** Class yang diterapkan ke elemen kontainer pembungkus terluar `<div>`. */
	class?: string;
	/** Class overrides terstruktur untuk sub-parts. */
	classes?: TextFieldClasses;
	/** Primary bindable ref ke elemen native `<input>`. */
	ref?: HTMLInputElement | null;
	/** Explicit alias untuk input ref. */
	inputRef?: HTMLInputElement | null;
	/** Bindable ref ke elemen kontainer luar `<div>`. */
	containerRef?: HTMLDivElement | null;
	/** Nilai teks input (bindable). */
	value?: string;
	/** Callback saat nilai input berubah. */
	onValueChange?: (value: string) => void;
	/** Status validasi error (border merah / data-invalid). */
	invalid?: boolean;
	/** Snippet prefix di sebelah kiri input. Menerima payload `{ value }`. */
	prefix?: Snippet<[{ value: string }]>;
	/** Snippet suffix di sebelah kanan input. Menerima payload `{ value }`. */
	suffix?: Snippet<[{ value: string }]>;
}
