import type { Component, Snippet } from 'svelte';

export type ToastVariant = 'default' | 'info' | 'danger' | 'warning' | 'success';

export interface ToastOptions {
	description?: string;
	/** ms before auto-dismiss; 0 (or `Infinity`) disables it. Default 5000. */
	duration?: number;
	/** Custom icon snippet, component, or `false` to hide the icon. */
	icon?: Snippet | Component | false;
}

export interface ToastRecord extends ToastOptions {
	id: string;
	title: string;
	variant: ToastVariant;
	duration: number;
}

const DEFAULT_DURATION = 5000;

let toasts = $state<ToastRecord[]>([]);

function add(variant: ToastVariant, title: string, options?: ToastOptions): string {
	const id = crypto.randomUUID();
	toasts.push({
		id,
		title,
		variant,
		description: options?.description,
		duration: options?.duration ?? DEFAULT_DURATION,
		icon: options?.icon
	});
	return id;
}

function dismiss(id: string) {
	toasts = toasts.filter((toast) => toast.id !== id);
}

function dismissAll() {
	toasts = [];
}

export const toastStore = {
	get toasts() {
		return toasts;
	},
	dismiss,
	dismissAll
};

export const toast = {
	message: (title: string, options?: ToastOptions) => add('default', title, options),
	info: (title: string, options?: ToastOptions) => add('info', title, options),
	success: (title: string, options?: ToastOptions) => add('success', title, options),
	warning: (title: string, options?: ToastOptions) => add('warning', title, options),
	danger: (title: string, options?: ToastOptions) => add('danger', title, options),
	dismiss,
	dismissAll
};
