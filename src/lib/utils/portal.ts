import type { Action } from 'svelte/action';

export interface PortalOptions {
	target?: HTMLElement | string;
}

export const portal: Action<HTMLElement, PortalOptions | undefined> = (node, options) => {
	function resolveTarget(opts?: PortalOptions): HTMLElement {
		if (!opts?.target) return document.body;
		if (typeof opts.target === 'string') {
			const el = document.querySelector<HTMLElement>(opts.target);
			if (!el) throw new Error(`portal target not found: ${opts.target}`);
			return el;
		}
		return opts.target;
	}

	function mount(opts?: PortalOptions) {
		resolveTarget(opts).appendChild(node);
	}

	mount(options);

	return {
		update: mount,
		destroy() {
			node.remove();
		}
	};
};
