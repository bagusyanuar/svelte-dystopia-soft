import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { Placement } from '@floating-ui/dom';

export interface HoverCardClasses {
	/** Class override untuk elemen wrapper trigger (`<span>`). */
	trigger?: string;
	/** Class override untuk kontainer kartu mengambang (`<div>`). */
	content?: string;
}

export interface HoverCardProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
	/** Class override untuk elemen wrapper trigger (`<span>`). */
	class?: string;
	/** Sub-part classes untuk trigger dan content. */
	classes?: HoverCardClasses;
	/** Primary bindable ref ke elemen trigger (`<span>`). */
	ref?: HTMLSpanElement | null;
	/** Alias eksplisit untuk trigger ref. */
	triggerRef?: HTMLSpanElement | null;
	/** Bindable ref ke kontainer kartu mengambang (`<div>`). */
	contentRef?: HTMLDivElement | null;
	/** Status buka/tutup kartu. Mendukung two-way binding `$bindable(false)`. */
	open?: boolean;
	/** Posisi penempatan floating kartu mengambang terhadap trigger. */
	placement?: Placement;
	/** Jarak offset dalam pixel antara trigger dan floating content. */
	offset?: number;
	/** Delay hover dalam milidetik sebelum kartu terbuka. Fokus keyboard membukanya secara instan. */
	openDelay?: number;
	/** Grace period dalam milidetik sebelum kartu tertutup ketika kursor meninggalkan trigger atau kartu. */
	closeDelay?: number;
	/** Target portal DOM tempat kartu dirender. Default ke `document.body`. */
	portalTarget?: HTMLElement | string;
	/** Snippet untuk konten di dalam kartu mengambang. Menerima payload `{ open, close }`. */
	content: Snippet<[{ open: boolean; close: () => void }]>;
	/** Snippet elemen trigger pemicu. Menerima payload `{ open, close }`. */
	children: Snippet<[{ open: boolean; close: () => void }]>;
}
