import type { HTMLInputAttributes } from 'svelte/elements';
import type { SliderVariantProps } from './Slider.variants.js';

export interface SliderProps
	extends Omit<HTMLInputAttributes, 'size' | 'type' | 'value' | 'min' | 'max'>, SliderVariantProps {
	class?: string;
	ref?: HTMLInputElement | null;
	value?: number;
	min?: number;
	max?: number;
}
