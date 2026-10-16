import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import NumberField from './NumberField.svelte';
import NumberFieldSemiHeadlessHarness from './NumberFieldSemiHeadlessHarness.spec.svelte';

describe('NumberField.svelte', () => {
	it('renders native number input with initial value', async () => {
		render(NumberField, {
			value: 42,
			placeholder: 'Quantity'
		});

		const input = page.getByPlaceholder('Quantity');
		await expect.element(input).toBeInTheDocument();
		await expect.element(input).toHaveValue(42);
	});

	it('supports thousandSeparator mode with Indonesian grouping and comma decimal', async () => {
		render(NumberField, {
			thousandSeparator: true,
			value: 1234567.89,
			placeholder: 'Amount'
		});

		const input = page.getByPlaceholder('Amount');
		await expect.element(input).toBeInTheDocument();
		await expect.element(input).toHaveValue('1.234.567,89');
	});

	it('handles input formatting as user types in thousandSeparator mode', async () => {
		const onValueChange = vi.fn();
		render(NumberField, {
			thousandSeparator: true,
			placeholder: 'Enter amount',
			onValueChange
		});

		const input = page.getByPlaceholder('Enter amount');
		await input.fill('1500000');

		await expect.element(input).toHaveValue('1.500.000');
		expect(onValueChange).toHaveBeenCalledWith(1500000);
	});

	it('handles negative numbers and decimal commas in thousandSeparator mode', async () => {
		const onValueChange = vi.fn();
		render(NumberField, {
			thousandSeparator: true,
			placeholder: 'Balance',
			onValueChange
		});

		const input = page.getByPlaceholder('Balance');
		await input.fill('-2500,5');

		await expect.element(input).toHaveValue('-2.500,5');
		expect(onValueChange).toHaveBeenCalledWith(-2500.5);
	});

	it('exposes ref and inputRef bound to HTMLInputElement', async () => {
		render(NumberFieldSemiHeadlessHarness);

		const status = page.getByTestId('ref-status');
		await expect.element(status).toHaveAttribute('data-has-root', 'true');
		await expect.element(status).toHaveAttribute('data-has-input', 'true');
	});

	it('exposes data-slot, data-thousand-separator, and data-has-value attributes', async () => {
		render(NumberField, {
			thousandSeparator: true,
			value: 99,
			placeholder: 'Has value'
		});

		const input = document.querySelector('[data-slot="number-field"]');
		expect(input).toBeTruthy();
		expect(input?.hasAttribute('data-thousand-separator')).toBe(true);
		expect(input?.hasAttribute('data-has-value')).toBe(true);
	});

	it('applies custom sub-part classes via classes.input', async () => {
		render(NumberFieldSemiHeadlessHarness, {
			classes: { input: 'custom-number-input' }
		});

		const input = document.querySelector('[data-slot="number-field"]');
		expect(input?.className).toContain('custom-number-input');
	});

	it('forwards value and displayValue to prefix and suffix snippets', async () => {
		render(NumberFieldSemiHeadlessHarness, {
			value: -50
		});

		const prefix = page.getByTestId('test-prefix');
		const suffix = page.getByTestId('test-suffix');

		await expect.element(prefix).toHaveTextContent('NEG');
		await expect.element(prefix).toHaveAttribute('data-display', '-50');
		await expect.element(suffix).toHaveTextContent('VAL:-50');

		const input = page.getByPlaceholder('Enter number');
		await input.fill('200');

		await expect.element(prefix).toHaveTextContent('POS');
		await expect.element(suffix).toHaveTextContent('VAL:200');
	});

	it('suppresses spinners when hideSpinner is true on native number input', async () => {
		render(NumberField, {
			hideSpinner: true,
			placeholder: 'No spinner'
		});

		const input = document.querySelector('[data-slot="number-field"]');
		expect(input?.className).toContain('[-moz-appearance:textfield]');
	});

	it('keeps spinners when hideSpinner is false on native number input', async () => {
		render(NumberField, {
			hideSpinner: false,
			placeholder: 'With spinner'
		});

		const input = document.querySelector('[data-slot="number-field"]');
		expect(input?.className).not.toContain('[-moz-appearance:textfield]');
	});
});
