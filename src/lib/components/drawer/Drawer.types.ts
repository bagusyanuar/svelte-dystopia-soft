import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { DrawerVariantProps } from './Drawer.variants.js';

export interface DrawerProps
	extends Omit<HTMLButtonAttributes, 'children' | 'class' | 'title'>, DrawerVariantProps {
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
