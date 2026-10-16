import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { Placement } from '@floating-ui/dom';

export interface DropdownTriggerSnippetProps {
	open: boolean;
}

export interface DropdownContentSnippetProps {
	open: boolean;
	close: () => void;
}

export interface DropdownClasses {
	trigger?: string;
	content?: string;
}

export interface DropdownProps extends Omit<HTMLButtonAttributes, 'children' | 'class'> {
	/** Consumer class override for the root trigger `<button>` element. */
	class?: string;
	/** Fine-grained sub-part class overrides. */
	classes?: DropdownClasses;
	/** Bindable ref to the primary root trigger `<button>` element. */
	ref?: HTMLButtonElement | null;
	/** Bindable ref to the interactive trigger `<button>` element (alias for `ref`). */
	triggerRef?: HTMLButtonElement | null;
	/** Bindable ref to the floating menu content `<div>` element. */
	contentRef?: HTMLDivElement | null;
	/** Controlled/uncontrolled open state of the dropdown. */
	open?: boolean;
	/** Floating placement relative to the trigger. Defaults to `'bottom-start'`. */
	placement?: Placement;
	/** Floating offset in pixels from the trigger. Defaults to `8`. */
	offset?: number;
	/** Target element or selector for Svelte portal. Defaults to `document.body`. */
	portalTarget?: HTMLElement | string;
	/** Trigger snippet accepting `{ open }` state payload. */
	trigger: Snippet<[DropdownTriggerSnippetProps]>;
	/** Menu content snippet accepting `{ open, close }` state payload. */
	children: Snippet<[DropdownContentSnippetProps]>;
}
