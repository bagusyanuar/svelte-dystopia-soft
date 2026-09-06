import type { TextFieldProps } from '../text-field/TextField.types.js';

export interface NumberFieldProps extends Omit<TextFieldProps, 'value' | 'type'> {
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
}
