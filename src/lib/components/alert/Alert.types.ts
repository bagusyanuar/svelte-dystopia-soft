import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { AlertVariantProps } from './Alert.variants.js';

export type AlertVariant = NonNullable<AlertVariantProps['variant']>;

export interface AlertProps
	extends AlertVariantProps, Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
	class?: string;
	classes?: {
		icon?: string;
		title?: string;
		description?: string;
		content?: string;
	};
	ref?: HTMLDivElement | null;
	icon?: Snippet<[{ variant: AlertVariant }]>;
	title?: Snippet<[{ variant: AlertVariant }]>;
	description?: Snippet<[{ variant: AlertVariant }]>;
	children?: Snippet<[{ variant: AlertVariant }]>;
}
