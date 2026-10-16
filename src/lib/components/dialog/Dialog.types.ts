import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';

export interface DialogTriggerSnippetProps {
	open: boolean;
}

export interface DialogContentSnippetProps {
	open: boolean;
	close: () => void;
}

export interface DialogCloseSnippetProps {
	close: () => void;
}

export interface DialogClasses {
	trigger?: string;
	overlay?: string;
	content?: string;
	title?: string;
	description?: string;
	body?: string;
	close?: string;
	closeIcon?: string;
}

export interface DialogProps extends Omit<HTMLButtonAttributes, 'children' | 'class' | 'title'> {
	/** Consumer class override for the root trigger `<button>` element. */
	class?: string;
	/** Fine-grained sub-part class overrides. */
	classes?: DialogClasses;
	/** Bindable ref to the primary root trigger `<button>` element. */
	ref?: HTMLButtonElement | null;
	/** Bindable ref to the interactive trigger `<button>` element (alias for `ref`). */
	triggerRef?: HTMLButtonElement | null;
	/** Bindable ref to the floating modal dialog content `<div>` element. */
	contentRef?: HTMLDivElement | null;
	/** Controlled/uncontrolled open state of the dialog. */
	open?: boolean;
	/** Target element or selector for Svelte portal. Defaults to `document.body`. */
	portalTarget?: HTMLElement | string;
	/** Accessible text labels for internal controls. */
	labels?: { close?: string };
	/** Trigger snippet accepting `{ open }` state payload. */
	trigger: Snippet<[DialogTriggerSnippetProps]>;
	/** Title snippet for the modal header. */
	title: Snippet<[DialogTriggerSnippetProps]>;
	/** Optional description snippet for the modal subtitle. */
	description?: Snippet<[DialogTriggerSnippetProps]>;
	/** Optional custom close snippet replacing the default top-right X button, accepting `{ close }`. */
	close?: Snippet<[DialogCloseSnippetProps]>;
	/** Dialog body content snippet accepting `{ open, close }` state payload. */
	children?: Snippet<[DialogContentSnippetProps]>;
}
