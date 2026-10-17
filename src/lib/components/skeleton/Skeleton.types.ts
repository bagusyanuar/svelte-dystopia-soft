import type { HTMLAttributes } from 'svelte/elements';

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	/** Class kustom untuk menentukan dimensi dan bentuk skeleton (misal `h-4 w-32 rounded-full`). */
	class?: string;
	/** Bindable ref ke elemen root `<div>`. */
	ref?: HTMLDivElement | null;
}
