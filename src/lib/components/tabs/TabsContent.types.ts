import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface TabsContentSnippetProps {
	/** Status apakah panel tab sedang aktif/terpilih. */
	active: boolean;
}

export interface TabsContentProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	/** Class tambahan untuk elemen tabpanel. */
	class?: string;
	/** Nilai yang mencocokkan panel ini dengan TabsTrigger terkait. */
	value: string;
	/**
	 * Tetap me-render elemen panel di DOM dengan atribut `hidden` saat tidak aktif,
	 * berguna untuk mempertahankan state form, scroll position, atau iframe/media.
	 */
	forceMount?: boolean;
	/** Bindable ref ke elemen `<div>` tabpanel. */
	ref?: HTMLDivElement | null;
	/** Konten di dalam panel tab, menerima payload `{ active }`. */
	children: Snippet<[TabsContentSnippetProps]> | Snippet;
}

