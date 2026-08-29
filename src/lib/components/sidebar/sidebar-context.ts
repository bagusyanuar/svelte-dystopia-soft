import { getContext, setContext } from 'svelte';

interface SidebarContext {
	isCollapsed: () => boolean;
	toggleCollapsed: () => void;
	setCollapsed: (value: boolean) => void;
}

const SIDEBAR_CONTEXT_KEY = Symbol('sidebar');

export function setSidebarContext(context: SidebarContext) {
	setContext(SIDEBAR_CONTEXT_KEY, context);
}

export function getSidebarContext(): SidebarContext {
	const context = getContext<SidebarContext>(SIDEBAR_CONTEXT_KEY);
	if (!context) {
		throw new Error(
			'SidebarHeader/SidebarContent/SidebarFooter/SidebarGroup/SidebarGroupLabel/SidebarItem/SidebarTrigger must be rendered inside <Sidebar>.'
		);
	}
	return context;
}
