import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import type { RadioVariantProps } from './Radio.variants.js';

export interface RadioIndicatorSnippetProps {
	checked: boolean;
}

export interface RadioLabelSnippetProps {
	checked: boolean;
}

export interface RadioProps
	extends Omit<HTMLInputAttributes, 'size' | 'type' | 'value'>, RadioVariantProps {
	/** Applied to the container element; `classes` targets the inner parts. */
	class?: string;
	classes?: {
		input?: string;
		indicator?: string;
		dot?: string;
		field?: string;
		label?: string;
		labelWrapper?: string;
		description?: string;
	};
	/** Bindable ref to the native `<input>` element. */
	ref?: HTMLInputElement | null;
	/** Bindable ref to the control wrapper `<span>` element. */
	rootRef?: HTMLSpanElement | null;
	/** Bindable ref to the outer field container `<div>` (only present when `label` or `description` is used). */
	fieldRef?: HTMLDivElement | null;
	/** This radio's own value — compared against `group` to determine checked state. */
	value: string;
	/** The selected value shared across all radios with the same `name`. */
	group?: string;
	/** Standalone checked state if not using `group`. */
	checked?: boolean;
	invalid?: boolean;
	/** Custom indicator snippet to replace the default inner dot. */
	indicator?: Snippet<[RadioIndicatorSnippetProps]>;
	/** Optional integrated label text or snippet. When provided, automatically renders an accessible linked `<Label>`. */
	label?: string | Snippet<[RadioLabelSnippetProps]>;
	/** Optional description text or snippet rendered below the label. */
	description?: string | Snippet<[RadioLabelSnippetProps]>;
}
