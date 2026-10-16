import type { Snippet } from 'svelte';
import type { TextFieldProps } from '../text-field/TextField.types.js';

export interface NumberFieldClasses {
	/** Class override untuk elemen `<input>`. */
	input?: string;
	/** Class override untuk kontainer snippet `prefix`. */
	prefix?: string;
	/** Class override untuk kontainer snippet `suffix`. */
	suffix?: string;
}

export interface NumberFieldProps extends Omit<
	TextFieldProps,
	'value' | 'type' | 'classes' | 'prefix' | 'suffix' | 'onValueChange'
> {
	/** Bindable. `undefined` while the field is empty or holds an unparsable value. */
	value?: number;
	onValueChange?: (value: number | undefined) => void;
	/** Hides the native up/down spin buttons. Defaults to `true`. No-op when `thousandSeparator` is on — that mode uses a text input, which never has spin buttons. */
	hideSpinner?: boolean;
	/**
	 * Groups the integer part while typing, Indonesian-style (e.g. `1.234.567,89` — `.` for
	 * thousands, `,` for the decimal mark). Switches the underlying input from `type="number"`
	 * to `type="text"` with `inputmode="decimal"`, since native number inputs reject grouping
	 * characters — as a result, `min`/`max`/`step` are no longer natively validated by the
	 * browser in this mode.
	 */
	thousandSeparator?: boolean;
	/** Fine-grained class overrides untuk sub-parts. */
	classes?: NumberFieldClasses;
	/** Primary bindable ref ke elemen `<input>`. */
	ref?: HTMLInputElement | null;
	/** Explicit alias untuk input ref. */
	inputRef?: HTMLInputElement | null;
	/** Snippet prefix di sebelah kiri input. Menerima payload `{ value, displayValue }`. */
	prefix?: Snippet<[{ value: number | undefined; displayValue: string }]>;
	/** Snippet suffix di sebelah kanan input. Menerima payload `{ value, displayValue }`. */
	suffix?: Snippet<[{ value: number | undefined; displayValue: string }]>;
}
