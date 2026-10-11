import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { ButtonGroupOrientation, ButtonGroupVariantProps } from './ButtonGroup.variants.js';

export type { ButtonGroupOrientation };

export interface ButtonGroupProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, ButtonGroupVariantProps {
	class?: string;
	/** Reference to the root `<div>` element */
	ref?: HTMLDivElement | null;
	/**
	 * Content to render inside the button group.
	 * Receives the current active orientation (`{ orientation }`).
	 */
	children?: Snippet<[{ orientation: ButtonGroupOrientation }]>;
}
