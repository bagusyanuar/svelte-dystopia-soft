import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type CardDescriptionElement = 'p' | 'div' | 'span';

export interface CardDescriptionProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
	class?: string;
	/** Tag HTML yang digunakan untuk deskripsi kartu. Default: 'div' */
	as?: CardDescriptionElement;
	/** Referensi ke elemen DOM root description */
	ref?: HTMLElement | null;
	children?: Snippet;
}
