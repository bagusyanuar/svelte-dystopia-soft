import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { TabsOrientation, TabsVariant } from './tabs-context.js';

export type { TabsOrientation, TabsVariant };

export interface TabsClasses {
	/** Class override untuk elemen root container `<div>`. */
	root?: string;
	/** Class override untuk container daftar tab `TabsList`. */
	list?: string;
	/** Class override untuk tombol pemicu tab `TabsTrigger`. */
	trigger?: string;
	/** Class override untuk panel konten tab `TabsContent`. */
	content?: string;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	/** Class tambahan untuk elemen root tabs. */
	class?: string;
	/** Sub-part classes opsional untuk menata sub-elemen dari tingkat root. */
	classes?: TabsClasses;
	/** Nilai tab aktif (bindable). */
	value?: string;
	/** Nilai default tab saat mount jika value tidak ditentukan. */
	defaultValue?: string;
	/** Varian visual tabs: 'pill' (default dalam kotak track) atau 'underline' (garis bawah minimalis). */
	variant?: TabsVariant;
	/** Orientasi tab, baik horizontal maupun vertical. Default 'horizontal'. */
	orientation?: TabsOrientation;
	/** Callback saat nilai tab aktif berubah. */
	onValueChange?: (value: string) => void;
	/** Bindable ref ke elemen root `<div>`. */
	ref?: HTMLDivElement | null;
	/** Konten tabs (biasanya TabsList dan TabsContent). */
	children: Snippet;
}


