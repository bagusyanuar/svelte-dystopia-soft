import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { Placement } from '@floating-ui/dom';

export interface TooltipClasses {
	/** Class override for the trigger wrapper element (`<span>` or `<div>`). */
	trigger?: string;
	/** Class override for the floating content `<div>`. */
	content?: string;
	/** Class override for the arrow indicator `<div>`. */
	arrow?: string;
}

export interface TooltipSnippetProps {
	open: boolean;
	close: () => void;
}

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'class'> {
	/** Tag to render for the trigger wrapper. Default: `'span'`. */
	as?: 'span' | 'div';
	/** Class override for the trigger wrapper element. */
	class?: string;
	/** Structured class overrides for `trigger`, `content`, and `arrow`. */
	classes?: TooltipClasses;
	/** Primary bindable reference to the trigger wrapper DOM element. */
	ref?: HTMLElement | null;
	/** Explicit alias for the trigger wrapper DOM element. */
	triggerRef?: HTMLElement | null;
	/** Bindable reference to the floating content DOM element. */
	contentRef?: HTMLDivElement | null;
	/** Bindable reference to the arrow indicator DOM element. */
	arrowRef?: HTMLDivElement | null;
	/** Controlled or two-way bound open state. */
	open?: boolean;
	/** Initial open state when uncontrolled. Default: `false`. */
	defaultOpen?: boolean;
	/** Callback invoked whenever open state changes. */
	onOpenChange?: (open: boolean) => void;
	/** Placement relative to the trigger. Default: `'top'`. */
	placement?: Placement;
	/** Pixel offset between trigger and floating content. Default: `8`. */
	offset?: number;
	/** Hover delay in ms before the tooltip shows. Focus shows it instantly. Default: `700`. */
	delayDuration?: number;
	/** Whether to render a pointing arrow. Default: `false`. */
	showArrow?: boolean;
	/** Disables showing the tooltip on hover or focus. Default: `false`. */
	disabled?: boolean;
	/** Target portal element or CSS selector where the tooltip is appended. Default: `document.body`. */
	portalTarget?: HTMLElement | string;
	/** Additional HTML attributes for the floating content `<div>`. */
	contentProps?: HTMLAttributes<HTMLDivElement>;
	/** Tooltip body content. Can be a string or a snippet receiving `{ open, close }`. */
	content: string | Snippet<[TooltipSnippetProps]>;
	/** Trigger content. Receives `{ open, close }`. */
	children: Snippet<[TooltipSnippetProps]> | Snippet;
}

