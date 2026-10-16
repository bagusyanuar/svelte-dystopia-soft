import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { CalendarDayVariantProps } from './CalendarDay.variants.js';

export interface CalendarDayProps
	extends Omit<HTMLButtonAttributes, 'children' | 'class' | 'disabled'>, CalendarDayVariantProps {
	class?: string;
	/** Bindable reference to the button element. */
	ref?: HTMLButtonElement | null;
	/** Roving-tabindex position within the grid — only one cell is ever `0`. */
	tabIndex?: 0 | -1;
	/**
	 * Styled via `aria-disabled`, not the native `disabled` attribute — an
	 * ARIA grid keeps out-of-range/unavailable cells keyboard-reachable so
	 * arrow-key navigation can still traverse the full month, it just refuses
	 * to select them (see `Calendar.svelte`'s `selectDate`).
	 */
	disabled?: boolean;
	children: Snippet;
}
