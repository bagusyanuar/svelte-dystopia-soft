import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type CardTitleElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span';

export interface CardTitleProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
	class?: string;
	/** Tag HTML yang digunakan untuk judul kartu. Default: 'div' */
	as?: CardTitleElement;
	/** Referensi ke elemen DOM root title */
	ref?: HTMLElement | null;
	children?: Snippet;
}
