let lockCount = 0;
let originalOverflow = '';
let originalPaddingRight = '';

/**
 * Locks page scroll for as long as any caller holds it open — ref-counted so
 * a dialog opened from inside another dialog doesn't have the inner one's
 * cleanup re-enable scrolling behind the outer one still on screen. Also
 * compensates for the scrollbar's width so hiding it doesn't shift layout.
 */
export function lockScroll(): () => void {
	if (lockCount === 0) {
		const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
		originalOverflow = document.body.style.overflow;
		originalPaddingRight = document.body.style.paddingRight;

		document.body.style.overflow = 'hidden';
		if (scrollbarWidth > 0) {
			const currentPadding = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
			document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
		}
	}
	lockCount++;

	let released = false;
	return () => {
		if (released) return;
		released = true;

		lockCount--;
		if (lockCount === 0) {
			document.body.style.overflow = originalOverflow;
			document.body.style.paddingRight = originalPaddingRight;
		}
	};
}
