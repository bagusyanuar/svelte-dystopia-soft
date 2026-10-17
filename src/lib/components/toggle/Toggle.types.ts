import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { ToggleVariantProps } from './Toggle.variants.js';

export interface ToggleSnippetProps {
	pressed: boolean;
	disabled: boolean;
}

export interface ToggleChildProps {
	props: Record<string, unknown>;
	pressed: boolean;
	disabled: boolean;
}

export interface ToggleProps
	extends Omit<HTMLButtonAttributes, 'type' | 'children'>,
		ToggleVariantProps {
	class?: string;
	ref?: HTMLButtonElement | null;
	pressed?: boolean;
	defaultPressed?: boolean;
	disabled?: boolean;
	onPressedChange?: (pressed: boolean) => void;
	child?: Snippet<[ToggleChildProps]>;
	children?: Snippet<[ToggleSnippetProps]> | Snippet;
}
