import { cva, type VariantProps } from 'class-variance-authority';

export const tabsListVariants = cva('', {
	variants: {
		variant: {
			pill: 'rounded-md bg-surface-subtle p-1 inline-flex items-center gap-1',
			underline: 'rounded-none bg-transparent p-0 border-b border-border gap-6 w-full inline-flex items-center'
		},
		orientation: {
			horizontal: '',
			vertical: 'flex-col items-stretch self-start'
		}
	},
	compoundVariants: [
		{
			variant: 'underline',
			orientation: 'vertical',
			class: 'border-b-0 border-r border-border gap-2 w-auto'
		}
	],
	defaultVariants: {
		variant: 'pill',
		orientation: 'horizontal'
	}
});

export const tabsTriggerVariants = cva(
	'cursor-pointer text-sm leading-snug font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
	{
		variants: {
			variant: {
				pill: 'rounded-md px-compact py-control-y text-foreground-subtle hover:bg-surface-hover hover:text-foreground-soft data-[state=active]:bg-surface data-[state=active]:text-foreground',
				underline:
					'rounded-none border-b-2 border-transparent px-1 pb-2 pt-1 text-foreground-subtle hover:text-foreground-soft -mb-px data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent'
			},
			orientation: {
				horizontal: '',
				vertical: 'text-left justify-start'
			}
		},
		compoundVariants: [
			{
				variant: 'underline',
				orientation: 'vertical',
				class: 'border-b-0 border-r-2 -mr-px pr-3 pb-1'
			}
		],
		defaultVariants: {
			variant: 'pill',
			orientation: 'horizontal'
		}
	}
);

export type TabsListVariantProps = VariantProps<typeof tabsListVariants>;
export type TabsTriggerVariantProps = VariantProps<typeof tabsTriggerVariants>;
