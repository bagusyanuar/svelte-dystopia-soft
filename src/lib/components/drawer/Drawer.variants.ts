import { cva, type VariantProps } from 'class-variance-authority';

export const drawerVariants = cva(
	'fixed z-50 flex flex-col overflow-y-auto border-border bg-surface p-surface shadow-sm focus-visible:outline-none',
	{
		variants: {
			side: {
				right: 'inset-y-0 right-0 h-full w-full max-w-sm rounded-l-lg border-l',
				left: 'inset-y-0 left-0 h-full w-full max-w-sm rounded-r-lg border-r',
				top: 'inset-x-0 top-0 w-full max-h-[80vh] rounded-b-lg border-b',
				bottom: 'inset-x-0 bottom-0 w-full max-h-[80vh] rounded-t-lg border-t'
			}
		},
		defaultVariants: {
			side: 'right'
		}
	}
);

export type DrawerVariantProps = VariantProps<typeof drawerVariants>;
