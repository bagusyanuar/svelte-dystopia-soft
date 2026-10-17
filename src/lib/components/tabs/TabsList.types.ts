import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { TabsVariant } from './tabs-context.js';

export interface TabsListProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	/** Class tambahan untuk elemen tablist. */
	class?: string;
	/** Override varian tabs untuk tablist ini: 'pill' atau 'underline'. */
	variant?: TabsVariant;
	/** Bindable ref ke elemen container `<div>` tablist. */
	ref?: HTMLDivElement | null;
	/** Konten tombol-tombol tab (`TabsTrigger`). */
	children: Snippet;
}


