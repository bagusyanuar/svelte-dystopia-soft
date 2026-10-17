import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { SpinnerVariantProps } from './Spinner.variants.js';

export interface SpinnerClasses {
	/** Class override untuk elemen pembungkus root `<span>`. */
	root?: string;
	/** Class override untuk elemen ikon/SVG spinner. */
	icon?: string;
}

export interface SpinnerIconSnippetProps {
	size?: SpinnerVariantProps['size'];
}

export interface SpinnerProps
	extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'>, SpinnerVariantProps {
	/** Class kustom untuk menimpa class root `<span>`. */
	class?: string;
	/** Granular sub-part class overrides. */
	classes?: SpinnerClasses;
	/** Bindable ref ke elemen root `<span>`. */
	ref?: HTMLSpanElement | null;
	/**
	 * Accessible name announced to assistive tech. Defaults to "Loading" —
	 * pass `label=""` to suppress it when a nearby element (e.g. a button with `aria-busy`)
	 * already announces the loading state.
	 */
	label?: string;
	/** Custom icon snippet untuk menggantikan icon lingkaran SVG bawaan. */
	icon?: Snippet<[SpinnerIconSnippetProps]>;
	/** Custom children snippet (alias untuk custom icon/konten). */
	children?: Snippet<[SpinnerIconSnippetProps]>;
}
