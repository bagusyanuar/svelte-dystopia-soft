import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

interface AccordionBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	class?: string;
	children: Snippet;
}

export type AccordionProps = AccordionBaseProps &
	({ type?: 'single'; value?: string } | { type: 'multiple'; value?: string[] });
