import { describe, it, expect, afterEach } from 'vitest';
import { lockScroll } from './scroll-lock.js';

afterEach(() => {
	document.body.style.overflow = '';
	document.body.style.paddingRight = '';
});

describe('lockScroll', () => {
	it('hides body overflow while locked and restores it on release', () => {
		const unlock = lockScroll();

		expect(document.body.style.overflow).toBe('hidden');

		unlock();

		expect(document.body.style.overflow).toBe('');
	});

	it('keeps scroll locked until every holder releases', () => {
		const unlockOuter = lockScroll();
		const unlockInner = lockScroll();

		unlockInner();
		expect(document.body.style.overflow).toBe('hidden');

		unlockOuter();
		expect(document.body.style.overflow).toBe('');
	});

	it('is idempotent if the same release is called twice', () => {
		const unlockA = lockScroll();
		const unlockB = lockScroll();

		unlockA();
		unlockA();
		expect(document.body.style.overflow).toBe('hidden');

		unlockB();
		expect(document.body.style.overflow).toBe('');
	});

	it('restores the original inline overflow value rather than always clearing it', () => {
		document.body.style.overflow = 'scroll';

		const unlock = lockScroll();
		expect(document.body.style.overflow).toBe('hidden');

		unlock();
		expect(document.body.style.overflow).toBe('scroll');

		document.body.style.overflow = '';
	});
});
