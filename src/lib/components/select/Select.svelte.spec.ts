import { createRawSnippet } from 'svelte';
import { page, userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Select from './Select.svelte';
import BindingHarness from './BindingHarness.spec.svelte';

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
});
