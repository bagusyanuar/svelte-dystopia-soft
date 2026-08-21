import type { TextFieldProps } from '../text-field/TextField.types.js';

export interface PasswordFieldProps extends Omit<TextFieldProps, 'type' | 'suffix'> {
	/** Whether the password is currently revealed. Bindable. */
	visible?: boolean;
	/** Accessible names for the toggle button, for apps that aren't in English. */
	labels?: {
		show?: string;
		hide?: string;
	};
}
