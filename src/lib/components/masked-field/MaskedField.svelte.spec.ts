import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import MaskedField from './MaskedField.svelte';
import MaskedFieldSemiHeadlessHarness from './MaskedFieldSemiHeadlessHarness.spec.svelte';

describe('MaskedField.svelte', () => {
	it('renders formatted value when initial value is provided', async () => {
		render(MaskedField, {
			pattern: '(##)-###-###',
			value: '021123456',
			placeholder: '(08)-123-456'
		});

		const input = page.getByPlaceholder('(08)-123-456');
		await expect.element(input).toBeInTheDocument();
		await expect.element(input).toHaveValue('(02)-112-345');
	});

	it('formats input digits as user types', async () => {
		render(MaskedField, {
			pattern: '#####',
			placeholder: '12345'
		});

		const input = page.getByPlaceholder('12345');
		await input.fill('12345');

		await expect.element(input).toHaveValue('12345');
	});

	it('exposes ref and inputRef bound to HTMLInputElement', async () => {
		render(MaskedFieldSemiHeadlessHarness);

		const status = page.getByTestId('ref-status');
		await expect.element(status).toHaveAttribute('data-has-root', 'true');
		await expect.element(status).toHaveAttribute('data-has-input', 'true');
	});

	it('exposes data-slot and data-masked attributes on the input', async () => {
		render(MaskedFieldSemiHeadlessHarness);

		const input = document.querySelector('[data-slot="masked-field"]');
		expect(input).toBeTruthy();
		expect(input?.hasAttribute('data-masked')).toBe(true);
	});

	it('applies custom sub-part classes via classes.input', async () => {
		render(MaskedFieldSemiHeadlessHarness, {
			classes: { input: 'custom-masked-input' }
		});

		const input = document.querySelector('[data-slot="masked-field"]');
		expect(input?.className).toContain('custom-masked-input');
	});

	it('propagates value and unmaskedValue through two-way binding and calls onValueChange', async () => {
		const onValueChange = vi.fn();
		render(MaskedFieldSemiHeadlessHarness, {
			pattern: '(##)-###-###',
			onValueChange
		});

		const input = page.getByPlaceholder('(08)-123-456');
		await input.fill('08123456');

		const status = page.getByTestId('ref-status');
		await expect.element(status).toHaveAttribute('data-masked', '(08)-123-456');
		await expect.element(status).toHaveAttribute('data-unmasked', '08123456');
		expect(onValueChange).toHaveBeenCalledWith('(08)-123-456', '08123456');
	});

	it('forwards value and unmaskedValue to prefix and suffix snippets', async () => {
		render(MaskedFieldSemiHeadlessHarness, {
			pattern: '(##)-###-###'
		});

		const input = page.getByPlaceholder('(08)-123-456');
		const suffix = page.getByTestId('test-suffix');

		await expect.element(suffix).toHaveTextContent('BELUM');

		await input.fill('08123456');

		await expect.element(suffix).toHaveTextContent('LENGKAP');
	});

	it('supports bounded optional tail digits using bracket syntax', async () => {
		render(MaskedField, {
			pattern: '####-####-####[###]',
			placeholder: '1234-5678-9012345'
		});

		const input = page.getByPlaceholder('1234-5678-9012345');
		await input.fill('123456789012345');

		await expect.element(input).toHaveValue('1234-5678-9012345');
	});

	it('supports dynamic tail digits using blocks prop', async () => {
		render(MaskedField, {
			pattern: '####-####-####[tail]',
			blocks: {
				tail: { mask: /^\d*$/ }
			},
			placeholder: '1234-5678-9012...'
		});

		const input = page.getByPlaceholder('1234-5678-9012...');
		await input.fill('123456789012345678');

		await expect.element(input).toHaveValue('1234-5678-9012345678');
	});

	it('supports repeating chunks every N digits with repeat: Infinity', async () => {
		render(MaskedField, {
			pattern: 'first[rest]',
			blocks: {
				first: {
					mask: '####',
					definitions: { '#': /\d/ }
				},
				rest: {
					mask: '-####',
					definitions: { '#': /\d/ },
					repeat: Infinity
				}
			},
			placeholder: '1234-5678-9012-3456...'
		});

		const input = page.getByPlaceholder('1234-5678-9012-3456...');
		await input.fill('12345678901234567890');

		await expect.element(input).toHaveValue('1234-5678-9012-3456-7890');
	});
});
