export type ToastPosition =
	'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface ToasterProps {
	/** Corner the toast viewport renders in. Default `'bottom-right'`. */
	position?: ToastPosition;
	/** Max toasts shown at once; the rest wait offscreen until room frees up. Default `3`. */
	max?: number;
	portalTarget?: HTMLElement | string;
	class?: string;
	classes?: {
		viewport?: string;
		item?: string;
		title?: string;
		description?: string;
		close?: string;
	};
	labels?: {
		close?: string;
		region?: string;
	};
}
