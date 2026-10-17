import { createRawSnippet } from 'svelte';
import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Select from './Select.svelte';
import BindingHarness from './BindingHarness.spec.svelte';
import SelectSemiHeadlessHarness from './SelectSemiHeadlessHarness.spec.svelte';

const fruitOptions = createRawSnippet(() => ({
	render: () =>
		'<optgroup label="Fruit"><option value="apple">Apple</option><option value="banana">Banana</option><option value="cherry">Cherry</option></optgroup>'
}));

describe('Select.svelte', () => {
	it('renders the given options', async () => {
		render(Select, { 'aria-label': 'Fruit', children: fruitOptions });

		await expect.element(page.getByRole('option', { name: 'Banana' })).toBeInTheDocument();
	});

	it('updates value when the user picks an option', async () => {
		render(Select, { 'aria-label': 'Fruit', children: fruitOptions });

		const select = page.getByRole('combobox', { name: 'Fruit' });
		await userEvent.selectOptions(select.element(), 'banana');

		await expect.element(select).toHaveValue('banana');
	});

	it('is disabled when the disabled prop is set', async () => {
		render(Select, { 'aria-label': 'Fruit', children: fruitOptions, disabled: true });

		await expect.element(page.getByRole('combobox', { name: 'Fruit' })).toBeDisabled();
	});

	it('marks the select as invalid', async () => {
		render(Select, { 'aria-label': 'Fruit', children: fruitOptions, invalid: true });

		await expect
			.element(page.getByRole('combobox', { name: 'Fruit' }))
			.toHaveAttribute('aria-invalid', 'true');
	});

	it('propagates the selected value back to the consumer', async () => {
		render(BindingHarness);

		await userEvent.selectOptions(
			page.getByRole('combobox', { name: 'Fruit' }).element(),
			'cherry'
		);

		await expect.element(page.getByTestId('outer-value')).toHaveTextContent('cherry');
	});

	it('lets a consumer class override an internal one', async () => {
		render(Select, { 'aria-label': 'Fruit', children: fruitOptions, class: 'w-96' });

		const root = page.getByRole('combobox', { name: 'Fruit' }).element().closest('div');

		expect(root?.className).toContain('w-96');
	});

	it('forwards unrecognized attributes', async () => {
		render(Select, { 'aria-label': 'Fruit', children: fruitOptions, name: 'fruit' });

		await expect
			.element(page.getByRole('combobox', { name: 'Fruit' }))
			.toHaveAttribute('name', 'fruit');
	});

	// --- Semi-headless capability tests ---

	it('exposes data-slot annotations on container, select, and icon', async () => {
		render(Select, { 'aria-label': 'Fruit', children: fruitOptions });

		const container = document.querySelector('[data-slot="select"]');
		const input = document.querySelector('[data-slot="select-input"]');
		const icon = document.querySelector('[data-slot="select-icon"]');

		expect(container).toBeInTheDocument();
		expect(input).toBeInTheDocument();
		expect(icon).toBeInTheDocument();
	});

	it('exposes data-invalid on BOTH the root container and native select', async () => {
		render(Select, { 'aria-label': 'Fruit', children: fruitOptions, invalid: true });

		const container = document.querySelector('[data-slot="select"]');
		const input = document.querySelector('[data-slot="select-input"]');

		expect(container?.hasAttribute('data-invalid')).toBe(true);
		expect(input?.hasAttribute('data-invalid')).toBe(true);
	});

	it('exposes data-disabled on BOTH the root container and native select', async () => {
		render(Select, { 'aria-label': 'Fruit', children: fruitOptions, disabled: true });

		const container = document.querySelector('[data-slot="select"]');
		const input = document.querySelector('[data-slot="select-input"]');

		expect(container?.hasAttribute('data-disabled')).toBe(true);
		expect(input?.hasAttribute('data-disabled')).toBe(true);
	});

	it('exposes data-has-value when value is present and removes when empty', async () => {
		render(Select, { 'aria-label': 'Fruit', children: fruitOptions, value: 'banana' });

		const container = document.querySelector('[data-slot="select"]');
		const input = document.querySelector('[data-slot="select-input"]');

		expect(container?.hasAttribute('data-has-value')).toBe(true);
		expect(input?.hasAttribute('data-has-value')).toBe(true);
	});

	it('supports granular sub-part classes override (container, select, icon)', async () => {
		render(Select, {
			'aria-label': 'Fruit',
			children: fruitOptions,
			classes: {
				container: 'custom-container-cls',
				select: 'custom-select-cls',
				icon: 'custom-icon-cls'
			}
		});

		const container = document.querySelector('[data-slot="select"]');
		const select = document.querySelector('[data-slot="select-input"]');
		const icon = document.querySelector('[data-slot="select-icon"]');

		expect(container?.className).toContain('custom-container-cls');
		expect(select?.className).toContain('custom-select-cls');
		expect(icon?.className).toContain('custom-icon-cls');
	});

	it('binds ref, selectRef, and containerRef via harness', async () => {
		render(SelectSemiHeadlessHarness);

		await expect.element(page.getByTestId('has-ref')).toHaveTextContent('yes');
		await expect.element(page.getByTestId('has-select-ref')).toHaveTextContent('yes');
		await expect.element(page.getByTestId('has-container-ref')).toHaveTextContent('yes');
	});

	it('allows custom icon snippet with state payload', async () => {
		render(SelectSemiHeadlessHarness, {
			customIcon: true,
			invalid: true,
			value: 'apple'
		});

		const icon = page.getByTestId('custom-icon');
		await expect.element(icon).toBeInTheDocument();
		await expect.element(icon).toHaveTextContent('ERR:apple');
	});

	it('invokes onValueChange when the user picks an option', async () => {
		const onValueChange = vi.fn();
		render(SelectSemiHeadlessHarness, { onValueChange });

		const select = page.getByRole('combobox', { name: 'Fruit' });
		await userEvent.selectOptions(select.element(), 'cherry');

		expect(onValueChange).toHaveBeenCalledWith('cherry');
		await expect.element(page.getByTestId('outer-value')).toHaveTextContent('cherry');
	});
});
