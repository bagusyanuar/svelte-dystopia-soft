import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface HelperTextClasses {
	/** Class override untuk kontainer pembungkus icon. */
	icon?: string;
}

export interface HelperTextProps extends Omit<HTMLAttributes<HTMLParagraphElement>, 'children'> {
	/** Class override untuk elemen root `<p>`. */
	class?: string;
	/** Fine-grained sub-part class overrides. */
	classes?: HelperTextClasses;
	/** Bindable ref ke elemen root `<p>`. */
	ref?: HTMLParagraphElement | null;
	/** Switches styling to the danger color and announces the text as a validation error. */
	invalid?: boolean;
	/** Snippet ikon opsional yang dirender sebelum teks. Menerima payload `{ invalid }`. */
	icon?: Snippet<[{ invalid: boolean }]>;
	/** Helper text content. Menerima payload `{ invalid }`. */
	children?: Snippet<[{ invalid: boolean }]>;
}
