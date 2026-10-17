import { getContext, setContext } from 'svelte';

export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsVariant = 'pill' | 'underline';

export interface TabsContext {
	baseId: string;
	getOrientation: () => TabsOrientation;
	getVariant: () => TabsVariant;
	getValue: () => string;
	setValue: (value: string) => void;
}


const TABS_CONTEXT_KEY = Symbol('tabs');

export function setTabsContext(context: TabsContext) {
	setContext(TABS_CONTEXT_KEY, context);
}

export function getTabsContext(): TabsContext {
	const context = getContext<TabsContext>(TABS_CONTEXT_KEY);
	if (!context) {
		throw new Error('Tabs.List/Tabs.Trigger/Tabs.Content must be rendered inside <Tabs>.');
	}
	return context;
}

