import { cva, type VariantProps } from 'class-variance-authority';

export const calendarDayVariants = cva(
	'inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-sm leading-snug transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
	{
		variants: {
			selected: {
				true: 'bg-primary text-primary-foreground hover:bg-primary-hover',
				false: 'text-foreground-soft hover:bg-surface-subtle'
			},
			outsideMonth: {
				true: 'text-foreground-muted',
				false: ''
			},
			inRange: {
				true: 'bg-surface-subtle rounded-none',
				false: ''
			},
			today: {
				true: 'font-semibold',
				false: ''
			}
		},
		compoundVariants: [
			// Selection always wins visually over the softer in-range fill.
			{ selected: true, inRange: true, class: 'rounded-md' }
		],
		defaultVariants: {
			selected: false,
			outsideMonth: false,
			inRange: false,
			today: false
		}
	}
);

export type CalendarDayVariantProps = VariantProps<typeof calendarDayVariants>;
