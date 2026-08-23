import type { HTMLAttributes } from 'svelte/elements';
import type { SpinnerVariantProps } from './Spinner.variants.js';

export interface SpinnerProps
	extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'>, SpinnerVariantProps {
	class?: string;
	classes?: {
		icon?: string;
	};
	/** Accessible name announced to assistive tech. Defaults to "Loading" — pass `label=""` to suppress it when a nearby element (e.g. a button with `aria-busy`) already announces the loading state. */
	label?: string;
}
