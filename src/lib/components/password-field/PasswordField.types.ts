import type { Snippet } from 'svelte';
import type { TextFieldProps } from '../text-field/TextField.types.js';

export interface PasswordFieldClasses {
	/** Class override untuk kontainer pembungkus terluar `<div>`. */
	container?: string;
	/** Class override untuk elemen native `<input>`. */
	input?: string;
	/** Class override untuk kontainer snippet `prefix`. */
	prefix?: string;
	/** Class override untuk kontainer snippet `suffix`. */
	suffix?: string;
	/** Class override untuk tombol toggle visibilitas password (`<button>`). */
	toggle?: string;
	/** Class override untuk ikon SVG di dalam tombol toggle. */
	icon?: string;
}

export interface PasswordFieldProps extends Omit<TextFieldProps, 'type' | 'classes' | 'prefix'> {
	/** Status visibilitas karakter kata sandi (bindable). */
	visible?: boolean;
	/** Callback saat status visibilitas kata sandi berubah. */
	onVisibleChange?: (visible: boolean) => void;
	/** Label tombol toggle untuk screen reader (aksesibilitas). */
	labels?: {
		show?: string;
		hide?: string;
	};
	/** Class overrides untuk sub-parts PasswordField. */
	classes?: PasswordFieldClasses;
	/** Primary bindable ref ke elemen native `<input>`. */
	ref?: HTMLInputElement | null;
	/** Explicit alias untuk input ref. */
	inputRef?: HTMLInputElement | null;
	/** Bindable ref ke elemen kontainer luar `<div>`. */
	containerRef?: HTMLDivElement | null;
	/** Bindable ref ke tombol toggle visibilitas kata sandi. */
	toggleRef?: HTMLButtonElement | null;
	/** Snippet prefix di sebelah kiri input. Menerima payload `{ visible, value }`. */
	prefix?: Snippet<[{ visible: boolean; value: string }]>;
	/** Snippet opsional untuk mengganti ikon default pada tombol toggle. Menerima payload `{ visible }`. */
	icon?: Snippet<[{ visible: boolean }]>;
}
