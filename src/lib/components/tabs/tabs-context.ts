import { getContext, setContext } from 'svelte';

interface TabsContext {
	baseId: string;
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
