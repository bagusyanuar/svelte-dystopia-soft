import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { Placement } from '@floating-ui/dom';

export interface PopoverClasses {
	/** Class override untuk elemen trigger `<button>`. */
	trigger?: string;
	/** Class override untuk kontainer dialog mengambang `<div>`. */
	content?: string;
}

export interface PopoverProps extends Omit<HTMLButtonAttributes, 'children' | 'class'> {
	/** Class override untuk elemen trigger `<button>`. */
	class?: string;
	/** Sub-part class overrides terstruktur untuk `trigger` dan `content`. */
	classes?: PopoverClasses;
	/** Primary bindable ref ke elemen trigger `<button>`. */
	ref?: HTMLButtonElement | null;
	/** Explicit alias untuk trigger ref. */
	triggerRef?: HTMLButtonElement | null;
	/** Bindable ref ke elemen kontainer dialog mengambang `<div>`. */
	contentRef?: HTMLDivElement | null;
	/** Status buka/tutup popover (bindable). */
	open?: boolean;
	/** Callback saat status buka/tutup popover berubah. */
	onOpenChange?: (open: boolean) => void;
	/** Posisi penempatan floating dialog relatif terhadap trigger. Default: `'bottom-start'`. */
	placement?: Placement;
	/** Jarak offset dalam pixel antara trigger dan floating content. Default: `8`. */
	offset?: number;
	/** Target portal DOM tempat popover dirender. Default: `document.body`. */
	portalTarget?: HTMLElement | string;
	/** Snippet untuk elemen pemicu (trigger). Menerima payload `{ open, close }`. */
	trigger: Snippet<[{ open: boolean; close: () => void }]>;
	/** Snippet konten di dalam dialog popover. Menerima payload `{ open, close }`. */
	children: Snippet<[{ open: boolean; close: () => void }]>;
}
