import { cva, type VariantProps } from 'class-variance-authority';

// :focus-visible and :hover chained onto the WebKit/Moz slider-thumb pseudo-elements don't
// reliably compile/apply through Tailwind's arbitrary variants (verified: the base thumb
// pseudo-element rules compile fine, but state-chained ones silently produce no rule). Rather
// than ship an unverifiable ring that might leave the thumb with no visible focus indicator,
// the focus ring goes on the input's own box via the plain (proven) focus-visible: variant.
// The filled portion left of the thumb is a gradient on the track pseudo-element, split at
// the --slider-fill custom property (set inline per-render from value/min/max). Custom
// properties inherit into ::-webkit-/::-moz- pseudo-elements even though most other styles
// don't, which is what makes this work without any JS-driven width/clip-path trickery.
// Tailwind's class scanner reads this file as plain text, so the class name is written out
// literally (twice, once per vendor prefix) rather than built with string interpolation —
// an interpolated `${gradient}` would never be seen by the scanner as a real candidate.
const base =
	'w-full cursor-pointer appearance-none bg-transparent focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,var(--color-primary)_var(--slider-fill),var(--color-border)_var(--slider-fill))] [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-[linear-gradient(to_right,var(--color-primary)_var(--slider-fill),var(--color-border)_var(--slider-fill))] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-surface [&::-webkit-slider-thumb]:shadow-sm [&::-moz-range-thumb]:box-border [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-surface [&::-moz-range-thumb]:shadow-sm';

export const sliderVariants = cva(base, {
	variants: {
		size: {
			sm: 'h-4 [&::-webkit-slider-runnable-track]:h-1.5 [&::-moz-range-track]:h-1.5 [&::-webkit-slider-thumb]:mt-[-5px] [&::-webkit-slider-thumb]:size-4 [&::-moz-range-thumb]:size-4',
			md: 'h-5 [&::-webkit-slider-runnable-track]:h-2 [&::-moz-range-track]:h-2 [&::-webkit-slider-thumb]:mt-[-6px] [&::-webkit-slider-thumb]:size-5 [&::-moz-range-thumb]:size-5',
			lg: 'h-6 [&::-webkit-slider-runnable-track]:h-2.5 [&::-moz-range-track]:h-2.5 [&::-webkit-slider-thumb]:mt-[-7px] [&::-webkit-slider-thumb]:size-6 [&::-moz-range-thumb]:size-6'
		}
	},
	defaultVariants: {
		size: 'md'
	}
});

export type SliderVariantProps = VariantProps<typeof sliderVariants>;
