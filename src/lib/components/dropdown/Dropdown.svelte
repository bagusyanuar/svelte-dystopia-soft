<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { floating } from '../../utils/floating.js';
	import { portal } from '../../utils/portal.js';
	import { createPresence } from '../../utils/presence.svelte.js';
	import type { DropdownProps } from './Dropdown.types.js';

	let {
		classes,
		open = $bindable(false),
		placement = 'bottom-start',
		offset = 8,
		portalTarget,
		trigger,
		children,
		...restProps
	}: DropdownProps = $props();

	const contentId = $props.id();

	let triggerEl = $state<HTMLButtonElement | null>(null);
	let contentEl = $state<HTMLDivElement | null>(null);
	const presence = createPresence(
		() => open,
		() => contentEl
	);
	let pendingFocus: 'first' | 'last' | null = null;

	function close() {
		open = false;
	}

	// Focus is always moved here programmatically (never by tabbing into the
	// list), so items stay out of the tab order permanently — no roving
	// tabindex bookkeeping needed. Querying live avoids tracking item
	// registration/order separately from the DOM.
	function getItems(): HTMLButtonElement[] {
		return contentEl
			? Array.from(
					contentEl.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')
				)
			: [];
	}

	function focusFirst() {
		getItems()[0]?.focus();
	}

	function focusLast() {
		const items = getItems();
		items[items.length - 1]?.focus();
	}

	function focusAdjacent(delta: 1 | -1) {
		const items = getItems();
		if (items.length === 0) return;
		const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);
		const nextIndex =
			currentIndex === -1 ? 0 : (currentIndex + delta + items.length) % items.length;
		items[nextIndex]?.focus();
	}

	let typeaheadBuffer = '';
	let typeaheadTimer: ReturnType<typeof setTimeout> | undefined;

	function typeahead(char: string) {
		clearTimeout(typeaheadTimer);
		typeaheadBuffer += char.toLowerCase();
		typeaheadTimer = setTimeout(() => (typeaheadBuffer = ''), 500);

		const items = getItems();
		if (items.length === 0) return;
		const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);
		const ordered = [...items.slice(currentIndex + 1), ...items.slice(0, currentIndex + 1)];
		const match = ordered.find((item) =>
			item.textContent?.trim().toLowerCase().startsWith(typeaheadBuffer)
		);
		match?.focus();
	}

	function handlePointerDown(event: PointerEvent) {
		const target = event.target as Node;
		if (triggerEl?.contains(target) || contentEl?.contains(target)) return;
		close();
	}

	function handleContentKeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				focusAdjacent(1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				focusAdjacent(-1);
				break;
			case 'Home':
				event.preventDefault();
				focusFirst();
				break;
			case 'End':
				event.preventDefault();
				focusLast();
				break;
			case 'Escape':
				event.preventDefault();
				close();
				triggerEl?.focus();
				break;
			case 'Tab':
				close();
				break;
			default:
				if (event.key.length === 1 && event.key !== ' ') {
					typeahead(event.key);
				}
		}
	}

	function handleContentClick(event: MouseEvent) {
		const target = (event.target as HTMLElement).closest('[role="menuitem"]:not(:disabled)');
		if (!target) return;
		close();
		triggerEl?.focus();
	}

	function handleTriggerKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault();
			pendingFocus = event.key === 'ArrowDown' ? 'first' : 'last';
			open = true;
		}
	}

	$effect(() => {
		if (!open) return;

		// `contentEl` is itself tracked $state, so reading it makes this effect
		// re-run once the portalled menu actually mounts. The first run (right
		// after `open` flips) fires before that DOM exists — bail out rather
		// than consuming `pendingFocus` on a run that can't act on it, or the
		// real run that follows would see it already cleared.
		if (!contentEl) return;

		if (pendingFocus === 'last') {
			focusLast();
		} else {
			focusFirst();
		}
		pendingFocus = null;

		document.addEventListener('pointerdown', handlePointerDown);
		return () => document.removeEventListener('pointerdown', handlePointerDown);
	});

	const triggerProps = $derived({
		...restProps,
		type: 'button' as const,
		'aria-haspopup': 'menu' as const,
		'aria-expanded': open,
		'aria-controls': contentId,
		'data-state': open ? 'open' : 'closed',
		class: cn(
			'inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-foreground-soft transition-colors duration-150 hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
			classes?.trigger
		),
		onclick: () => (open = !open),
		onkeydown: handleTriggerKeydown
	});
</script>

<button bind:this={triggerEl} {...triggerProps}>
	{@render trigger()}
</button>

{#if presence.current}
	<div
		bind:this={contentEl}
		id={contentId}
		role="menu"
		tabindex="-1"
		data-state={open ? 'open' : 'closed'}
		inert={!open}
		onkeydown={handleContentKeydown}
		onclick={handleContentClick}
		use:portal={{ target: portalTarget }}
		use:floating={{ reference: triggerEl, placement, offset }}
		class={cn(
			'z-50 min-w-40 rounded-lg border border-border bg-surface p-1 text-sm text-foreground-muted shadow-md focus-visible:outline-none',
			classes?.content
		)}
	>
		{@render children()}
	</div>
{/if}
