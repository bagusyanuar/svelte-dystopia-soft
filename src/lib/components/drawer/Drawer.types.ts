import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { DrawerVariantProps } from './Drawer.variants.js';

export interface DrawerTriggerSnippetProps {
	open: boolean;
}

export interface DrawerContentSnippetProps {
	open: boolean;
	close: () => void;
}

export interface DrawerCloseSnippetProps {
	close: () => void;
}

export interface DrawerClasses {
	trigger?: string;
	overlay?: string;
	content?: string;
	title?: string;
	description?: string;
	body?: string;
	close?: string;
	closeIcon?: string;
}

export interface DrawerProps
	extends Omit<HTMLButtonAttributes, 'children' | 'class' | 'title'>,
		DrawerVariantProps {
	/** Consumer class override for the root trigger `<button>` element. */
	class?: string;
	/** Fine-grained sub-part class overrides. */
	classes?: DrawerClasses;
	/** Bindable ref to the primary root trigger `<button>` element. */
	ref?: HTMLButtonElement | null;
	/** Bindable ref to the interactive trigger `<button>` element (alias for `ref`). */
	triggerRef?: HTMLButtonElement | null;
	/** Bindable ref to the drawer panel content `<div>` element. */
	contentRef?: HTMLDivElement | null;
	/** Controlled/uncontrolled open state of the drawer. */
	open?: boolean;
	/** Target element or selector for Svelte portal. Defaults to `document.body`. */
	portalTarget?: HTMLElement | string;
	/** Accessible text labels for internal controls. */
	labels?: { close?: string };
	/** Trigger snippet accepting `{ open }` state payload. */
	trigger: Snippet<[DrawerTriggerSnippetProps]>;
	/** Title snippet for the drawer header. */
	title: Snippet<[DrawerTriggerSnippetProps]>;
	/** Optional description snippet for the drawer subtitle. */
	description?: Snippet<[DrawerTriggerSnippetProps]>;
	/** Optional custom close snippet replacing the default top-right X button, accepting `{ close }`. */
	close?: Snippet<[DrawerCloseSnippetProps]>;
	/** Drawer body content snippet accepting `{ open, close }` state payload. */
	children?: Snippet<[DrawerContentSnippetProps]>;
}
