import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import type { CheckboxVariantProps } from './Checkbox.variants.js';

export interface CheckboxIndicatorSnippetProps {
	checked: boolean;
	indeterminate: boolean;
}

export interface CheckboxLabelSnippetProps {
	checked: boolean;
	indeterminate: boolean;
}

export interface CheckboxProps
	extends Omit<HTMLInputAttributes, 'size' | 'type'>, CheckboxVariantProps {
	/** Applied to the container element; `classes` targets the inner parts. */
	class?: string;
	classes?: {
		input?: string;
		indicator?: string;
		icon?: string;
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
	checked?: boolean;
	/** Mixed state, e.g. a parent of partially selected children. Cleared by the user clicking. */
	indeterminate?: boolean;
	invalid?: boolean;
	/** Custom indicator snippet to replace the default SVG checkmark / minus. */
	indicator?: Snippet<[CheckboxIndicatorSnippetProps]>;
	/** Optional integrated label text or snippet. When provided, automatically renders an accessible linked `<Label>`. */
	label?: string | Snippet<[CheckboxLabelSnippetProps]>;
	/** Optional description text or snippet rendered below the label. */
	description?: string | Snippet<[CheckboxLabelSnippetProps]>;
}


