import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { ToastRecord } from './toast-store.svelte.js';

export type ToastPosition =
	| 'top-left'
	| 'top-center'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-center'
	| 'bottom-right';

export interface ToasterClasses {
	/** Class override untuk viewport region container `<div>`. */
	viewport?: string;
	/** Class override untuk elemen item toast kartu `<div>`. */
	item?: string;
	/** Class override untuk container icon `<span>`. */
	icon?: string;
	/** Class override untuk pembungkus teks title dan description `<div>`. */
	content?: string;
	/** Class override untuk teks title `<p>`. */
	title?: string;
	/** Class override untuk teks deskripsi `<p>`. */
	description?: string;
	/** Class override untuk tombol aksi `<button>`. */
	action?: string;
	/** Class override untuk tombol tutup `<button>`. */
	close?: string;
}

export interface ToasterLabels {
	/** Accessible label untuk tombol dismiss/tutup. Default `'Close'`. */
	close?: string;
	/** Accessible label untuk landmark region viewport toast. Default `'Notifications'`. */
	region?: string;
}

export interface ToasterItemSnippetProps {
	toast: ToastRecord;
	dismiss: (id: string) => void;
}

export interface ToasterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	/** Corner the toast viewport renders in. Default `'bottom-right'`. */
	position?: ToastPosition;
	/** Max toasts shown at once; the rest wait offscreen until room frees up. Default `3`. */
	max?: number;
	/** Target portal elemen atau selector DOM tempat toaster dirender. */
	portalTarget?: HTMLElement | string;
	/** Class tambahan untuk elemen viewport toaster. */
	class?: string;
	/** Sub-part class overrides terstruktur. */
	classes?: ToasterClasses;
	/** Label aksesibilitas untuk screen reader. */
	labels?: ToasterLabels;
	/** Bindable ref ke elemen viewport container `<div>`. */
	ref?: HTMLDivElement | null;
	/** Snippet kustom opsional untuk mengganti seluruh rendering item toast. */
	item?: Snippet<[ToasterItemSnippetProps]>;
}

