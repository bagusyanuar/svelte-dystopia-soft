import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { AlertVariantProps } from './Alert.variants.js';

export interface AlertProps
	extends AlertVariantProps, Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	class?: string;
	classes?: {
		icon?: string;
		title?: string;
		description?: string;
	};
	icon?: Snippet;
	title?: Snippet;
	description?: Snippet;
	children?: Snippet;
}
