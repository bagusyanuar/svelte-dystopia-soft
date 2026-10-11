import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

interface AccordionBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	class?: string;
	ref?: HTMLDivElement | null;
	children: Snippet;
}

export type AccordionProps = AccordionBaseProps &
	({ type?: 'single'; value?: string } | { type: 'multiple'; value?: string[] });
