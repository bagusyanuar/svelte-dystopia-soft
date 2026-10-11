import { cva, type VariantProps } from 'class-variance-authority';

export const buttonGroupVariants = cva('inline-flex', {
	variants: {
		orientation: {
			horizontal:
				'flex-row [&>*]:relative [&>*:not(:first-child)]:-ml-px [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:first-child:not(:last-child)]:rounded-r-none [&>*:last-child:not(:first-child)]:rounded-l-none [&>*:hover]:z-10 [&>*:focus-visible]:z-10',
			vertical:
				'flex-col [&>*]:relative [&>*:not(:first-child)]:-mt-px [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:first-child:not(:last-child)]:rounded-b-none [&>*:last-child:not(:first-child)]:rounded-t-none [&>*:hover]:z-10 [&>*:focus-visible]:z-10'
		}
	},
	defaultVariants: {
		orientation: 'horizontal'
	}
});

export type ButtonGroupOrientation = NonNullable<
	VariantProps<typeof buttonGroupVariants>['orientation']
>;
export type ButtonGroupVariantProps = VariantProps<typeof buttonGroupVariants>;
