import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';

export interface DialogProps extends Omit<HTMLButtonAttributes, 'children' | 'class' | 'title'> {
	classes?: {
		trigger?: string;
		overlay?: string;
		content?: string;
		title?: string;
		description?: string;
		close?: string;
	};
	open?: boolean;
	portalTarget?: HTMLElement | string;
	labels?: { close?: string };
	trigger: Snippet;
	title: Snippet;
	description?: Snippet;
	children: Snippet;
}
