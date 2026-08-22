import { describe, it, expect } from 'vitest';
import { createIds, idFor } from './id.js';

describe('createIds', () => {
	it('prefixes each part with the base id', () => {
		const ids = createIds('r0', 'trigger', 'content');

		expect(ids).toEqual({ trigger: 'r0-trigger', content: 'r0-content' });
	});

	it('returns an empty object when no parts are given', () => {
		expect(createIds('r0')).toEqual({});
	});
});

describe('idFor', () => {
	it('joins the base and segments with a dash', () => {
		expect(idFor('r0', 'tab', 2)).toBe('r0-tab-2');
	});

	it('returns the base unchanged when no segments are given', () => {
		expect(idFor('r0')).toBe('r0');
	});
});
