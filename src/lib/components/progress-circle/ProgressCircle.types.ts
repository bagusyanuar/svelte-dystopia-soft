import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface ProgressCircleClasses {
	root?: string;
	svg?: string;
	track?: string;
	indicator?: string;
	fill?: string;
	content?: string;
}

export interface ProgressCircleSnippetPayload {
	value: number;
	max: number;
	percentage: number;
	indeterminate: boolean;
}

export type ProgressCircleSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ProgressCircleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	class?: string;
	classes?: ProgressCircleClasses;
	value?: number;
	max?: number;
	/** Predefined size ('xs' | 'sm' | 'md' | 'lg' | 'xl') or custom diameter in pixels. */
	size?: ProgressCircleSize | number;
	/** Custom thickness of the circular stroke in pixels. Defaults according to size. */
	strokeWidth?: number;
	/** Shows a spinning animation instead of a fixed fill, for an unknown duration. */
	indeterminate?: boolean;
	/** Animates the progress indicator from 0 to the target value on initial mount. */
	animated?: boolean;
	/** Binding for the outer root container element. */
	ref?: HTMLDivElement | null;
	/** Binding for the SVG element. */
	svgRef?: SVGSVGElement | null;
	/** Binding for the background track circle element. */
	trackRef?: SVGCircleElement | null;
	/** Binding for the progress indicator circle element. */
	indicatorRef?: SVGCircleElement | null;
	/** Optional children snippet rendered in the center of the circle. */
	children?: Snippet<[ProgressCircleSnippetPayload]>;
}
