import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
	class?: string;
	/**
	 * Purely presentational — this component holds no selection state itself.
	 * Wire it to whatever drives your own selection (e.g. a TanStack Table row model).
	 */
	selected?: boolean;
	children: Snippet;
}
