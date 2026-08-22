import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Radio from './Radio.svelte';
import BindingHarness from './BindingHarness.spec.svelte';

describe('Radio.svelte', () => {
	it('renders an unchecked radio by default', async () => {
		render(Radio, { value: 'free', 'aria-label': 'Free' });

		await expect.element(page.getByRole('radio')).not.toBeChecked();
	});

	it('propagates the selected value back to the consumer', async () => {
		render(BindingHarness);

		await page.getByText('Free').click();

		await expect.element(page.getByTestId('outer-selected')).toHaveTextContent('free');
	});

	it('unchecks the previous radio when another one in the group is selected', async () => {
		render(BindingHarness);

		await page.getByText('Free').click();
		await page.getByText('Pro').click();

		const [free, pro] = await Promise.all([
			page.getByLabelText('Free').element(),
			page.getByLabelText('Pro').element()
		]);

		expect((free as HTMLInputElement).checked).toBe(false);
		expect((pro as HTMLInputElement).checked).toBe(true);
	});

	it('is toggled by clicking its associated label', async () => {
		render(BindingHarness);

		await page.getByText('Pro').click();

		await expect.element(page.getByLabelText('Pro')).toBeChecked();
	});

	it('does not toggle while disabled', async () => {
		render(Radio, { value: 'free', 'aria-label': 'Free', disabled: true });

		const radio = page.getByRole('radio');

		await expect.element(radio).toBeDisabled();
		await expect.element(radio).not.toBeChecked();
	});

	it('marks itself invalid for consumer styling', async () => {
		render(Radio, { value: 'free', 'aria-label': 'Free', invalid: true });

		const root = page.getByRole('radio').element().parentElement;

		expect(root?.hasAttribute('data-invalid')).toBe(true);
	});

	it('lets a consumer class override an internal one', async () => {
		render(Radio, { value: 'free', 'aria-label': 'Free', class: 'size-8' });

		const root = page.getByRole('radio').element().parentElement;

		expect(root?.className).toContain('size-8');
		expect(root?.className).not.toContain('size-5');
	});

	it('forwards unrecognized attributes to the input', async () => {
		render(Radio, { value: 'free', 'aria-label': 'Free', name: 'plan' });

		await expect.element(page.getByRole('radio')).toHaveAttribute('name', 'plan');
	});
});
