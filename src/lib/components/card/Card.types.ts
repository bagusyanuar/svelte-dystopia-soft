import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type CardElement = 'div' | 'article' | 'section';

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
	class?: string;
	/** Tag HTML yang digunakan untuk container kartu. Default: 'div' */
	as?: CardElement;
	/** Referensi ke elemen DOM root */
	ref?: HTMLElement | null;
	children?: Snippet;
}
