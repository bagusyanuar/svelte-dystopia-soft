import type { Snippet } from 'svelte';
import type { TextFieldProps } from '../text-field/TextField.types.js';

export interface MaskedFieldClasses {
	/** Class override untuk elemen `<input>`. */
	input?: string;
	/** Class override untuk kontainer snippet `prefix`. */
	prefix?: string;
	/** Class override untuk kontainer snippet `suffix`. */
	suffix?: string;
}

export interface MaskedFieldProps extends Omit<
	TextFieldProps,
	'value' | 'classes' | 'prefix' | 'suffix' | 'onValueChange'
> {
	/**
	 * Mask pattern using `#` as a digit placeholder (e.g. `"(##)-###-###"` for a phone
	 * number, `"#####"` for a postal code, `"################"` for a 16-digit ID
	 * number). Any other character is a fixed literal the mask inserts automatically.
	 *
	 * - Karakter kurung siku `[...]` menandai digit/karakter opsional (misal: `"####-####-####[###]"` untuk 12 digit bertanda `-` ditambah hingga 3 digit ekstra tanpa pemisah).
	 * - Blok khusus seperti `[tail]` dapat dipadukan dengan prop `blocks` untuk panjang ekor dinamis.
	 */
	pattern: string;
	/**
	 * Definisi blok kustom IMask untuk masking dinamis atau format lanjutan
	 * (misal: `{ tail: { mask: /^\d*$/ } }` untuk ekor digit dinamis tanpa batas).
	 */
	blocks?: Record<string, unknown>;
	/** Bindable. The masked, displayed value (e.g. `"(021)-123-456"`). */
	value?: string;
	/** Bindable, output-only. The raw digits with no literal characters (e.g. `"021123456"`). */
	unmaskedValue?: string;
	/** Fine-grained class overrides untuk sub-parts. */
	classes?: MaskedFieldClasses;
	/** Primary bindable ref ke elemen `<input>`. */
	ref?: HTMLInputElement | null;
	/** Explicit alias untuk input ref. */
	inputRef?: HTMLInputElement | null;
	/** Callback saat nilai input bertopeng atau nilai mentah berubah. */
	onValueChange?: (value: string, unmaskedValue: string) => void;
	/** Snippet prefix di sebelah kiri input. Menerima payload `{ value, unmaskedValue }`. */
	prefix?: Snippet<[{ value: string; unmaskedValue?: string }]>;
	/** Snippet suffix di sebelah kanan input. Menerima payload `{ value, unmaskedValue }`. */
	suffix?: Snippet<[{ value: string; unmaskedValue?: string }]>;
}
