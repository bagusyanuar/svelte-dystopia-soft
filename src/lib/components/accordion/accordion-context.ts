import { getContext, setContext } from 'svelte';

interface AccordionContext {
	baseId: string;
	isOpen: (value: string) => boolean;
	toggle: (value: string) => void;
}

const ACCORDION_CONTEXT_KEY = Symbol('accordion');

export function setAccordionContext(context: AccordionContext) {
	setContext(ACCORDION_CONTEXT_KEY, context);
}

export function getAccordionContext(): AccordionContext {
	const context = getContext<AccordionContext>(ACCORDION_CONTEXT_KEY);
	if (!context) {
		throw new Error('AccordionItem must be rendered inside <Accordion>.');
	}
	return context;
}
