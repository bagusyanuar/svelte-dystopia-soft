/**
 * Keeps a portalled overlay (Popover/Dropdown/Tooltip content) mounted past
 * `open` flipping to `false` until any exit animation the consumer styled
 * onto `data-state="closed"` finishes — unmounting immediately when there
 * isn't one, rather than waiting for an `animationend` that will never fire.
 */
export function createPresence(getOpen: () => boolean, getNode: () => HTMLElement | null) {
	let present = $state(getOpen());

	$effect(() => {
		if (getOpen()) {
			present = true;
			return;
		}

		const node = getNode();
		if (!node) {
			present = false;
			return;
		}

		const exiting = node.getAnimations().filter((animation) => animation.playState !== 'finished');
		if (exiting.length === 0) {
			present = false;
			return;
		}

		let cancelled = false;
		Promise.allSettled(exiting.map((animation) => animation.finished)).then(() => {
			if (!cancelled) present = false;
		});

		return () => {
			cancelled = true;
		};
	});

	return {
		get current() {
			return present;
		}
	};
}
