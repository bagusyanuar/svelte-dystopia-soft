import { describe, it, expect } from 'vitest';
import { getPaginationRange } from './pagination-range.js';

describe('getPaginationRange', () => {
	it('collapses the tail when the current page is near the start', () => {
		expect(getPaginationRange({ currentPage: 2, totalPages: 10 })).toEqual([
			1,
			2,
			3,
			'ellipsis',
			10
		]);
	});

	it('collapses both sides when the current page is in the middle', () => {
		expect(getPaginationRange({ currentPage: 7, totalPages: 25 })).toEqual([
			1,
			'ellipsis',
			6,
			7,
			8,
			'ellipsis',
			25
		]);
	});

	it('collapses the head when the current page is near the end', () => {
		expect(getPaginationRange({ currentPage: 24, totalPages: 25 })).toEqual([
			1,
			'ellipsis',
			23,
			24,
			25
		]);
	});

	it('shows every page with no ellipsis when they all fit', () => {
		expect(getPaginationRange({ currentPage: 1, totalPages: 5 })).toEqual([1, 2, 3, 4, 5]);
	});

	it('never emits two adjacent ellipsis markers, even at the boundary', () => {
		expect(getPaginationRange({ currentPage: 1, totalPages: 3 })).toEqual([1, 2, 3]);
	});

	it('respects a larger siblingCount', () => {
		expect(getPaginationRange({ currentPage: 10, totalPages: 20, siblingCount: 2 })).toEqual([
			1,
			'ellipsis',
			8,
			9,
			10,
			11,
			12,
			'ellipsis',
			20
		]);
	});

	it('respects a larger boundaryCount', () => {
		expect(getPaginationRange({ currentPage: 10, totalPages: 20, boundaryCount: 2 })).toEqual([
			1,
			2,
			'ellipsis',
			9,
			10,
			11,
			'ellipsis',
			19,
			20
		]);
	});

	it('clamps an out-of-range currentPage instead of throwing', () => {
		expect(getPaginationRange({ currentPage: 999, totalPages: 5 })).toEqual([1, 2, 3, 4, 5]);
		expect(getPaginationRange({ currentPage: -5, totalPages: 5 })).toEqual([1, 2, 3, 4, 5]);
	});

	it('returns an empty array for zero or negative totalPages', () => {
		expect(getPaginationRange({ currentPage: 1, totalPages: 0 })).toEqual([]);
		expect(getPaginationRange({ currentPage: 1, totalPages: -3 })).toEqual([]);
	});

	it('handles a single page', () => {
		expect(getPaginationRange({ currentPage: 1, totalPages: 1 })).toEqual([1]);
	});
});
