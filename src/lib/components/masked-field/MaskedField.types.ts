import type { TextFieldProps } from '../text-field/TextField.types.js';

export interface MaskedFieldProps extends Omit<TextFieldProps, 'value'> {
	/**
	 * Mask pattern using `#` as a digit placeholder (e.g. `"(##)-###-###"` for a phone
	 * number, `"#####"` for a postal code, `"################"` for a 16-digit ID
	 * number). Any other character is a fixed literal the mask inserts automatically.
	 * Avoid literal `0`, `a`, `*` in the pattern — those are `imask`'s own built-in
	 * placeholder characters.
	 */
	pattern: string;
	/** Bindable. The masked, displayed value (e.g. `"(021)-123-456"`). */
	value?: string;
	/** Bindable, output-only. The raw digits with no literal characters (e.g. `"021123456"`). */
	unmaskedValue?: string;
	onValueChange?: (value: string, unmaskedValue: string) => void;
}
