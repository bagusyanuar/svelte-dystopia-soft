import type { HTMLInputAttributes } from 'svelte/elements';
import type { SliderVariantProps } from './Slider.variants.js';

export interface SliderProps
	extends Omit<HTMLInputAttributes, 'size' | 'type' | 'value' | 'min' | 'max' | 'children'>,
		SliderVariantProps {
	/** Class kustom untuk menimpa styling input range slider. */
	class?: string;
	/** Bindable ref ke elemen native `<input type="range">`. */
	ref?: HTMLInputElement | null;
	/** Nilai saat ini (bindable). Default: `0`. */
	value?: number;
	/** Nilai batas minimum. Default: `0`. */
	min?: number;
	/** Nilai batas maksimum. Default: `100`. */
	max?: number;
	/** Callback saat nilai slider berubah via interaksi pengguna. */
	onValueChange?: (value: number) => void;
	/** Callback khusus saat slider digeser/dislide (alias ergonomis untuk `onValueChange`). */
	onSlide?: (value: number) => void;
}
