import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Checkbox from './Checkbox.svelte';
import BindingHarness from './BindingHarness.spec.svelte';

describe('Checkbox.svelte', () => {
	it('renders an unchecked checkbox by default', async () => {
		render(Checkbox, { 'aria-label': 'Accept terms' });

		await expect.element(page.getByRole('checkbox')).not.toBeChecked();
	});

	it('propagates the checked state back to the consumer', async () => {
		render(BindingHarness);

		await page.getByRole('checkbox').click();

		await expect.element(page.getByTestId('outer-checked')).toHaveTextContent('true');
	});

	it('clears the indeterminate state once the user clicks', async () => {
		render(BindingHarness);

		expect((page.getByRole('checkbox').element() as HTMLInputElement).indeterminate).toBe(true);

		await page.getByRole('checkbox').click();

		await expect.element(page.getByTestId('outer-indeterminate')).toHaveTextContent('false');
	});

	it('is toggled by clicking its associated label', async () => {
		render(BindingHarness);

		await page.getByText('Accept terms').click();

		await expect.element(page.getByRole('checkbox')).toBeChecked();
	});

	it('does not toggle while disabled', async () => {
		render(Checkbox, { 'aria-label': 'Accept terms', disabled: true });

		const checkbox = page.getByRole('checkbox');

		await expect.element(checkbox).toBeDisabled();
		await expect.element(checkbox).not.toBeChecked();
	});

	it('marks the input as invalid', async () => {
		render(Checkbox, { 'aria-label': 'Accept terms', invalid: true });

		await expect.element(page.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
	});

	it('lets a consumer class override an internal one', async () => {
		render(Checkbox, { 'aria-label': 'Accept terms', class: 'size-8' });

		const root = page.getByRole('checkbox').element().parentElement;

		expect(root?.className).toContain('size-8');
		expect(root?.className).not.toContain('size-5');
	});

	it('forwards unrecognized attributes to the input', async () => {
		render(Checkbox, { 'aria-label': 'Accept terms', name: 'terms', value: 'yes' });

		const checkbox = page.getByRole('checkbox');

		await expect.element(checkbox).toHaveAttribute('name', 'terms');
		await expect.element(checkbox).toHaveAttribute('value', 'yes');
	});
});
