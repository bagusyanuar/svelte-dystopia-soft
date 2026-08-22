import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Switch from './Switch.svelte';
import BindingHarness from './BindingHarness.spec.svelte';

describe('Switch.svelte', () => {
	it('renders an unchecked switch by default', async () => {
		render(Switch, { 'aria-label': 'Notifications' });

		await expect.element(page.getByRole('switch')).not.toBeChecked();
	});

	it('propagates the checked state back to the consumer', async () => {
		render(BindingHarness);

		await page.getByRole('switch').click();

		await expect.element(page.getByTestId('outer-checked')).toHaveTextContent('true');
	});

	it('is toggled by clicking its associated label', async () => {
		render(BindingHarness);

		await page.getByText('Notifications').click();

		await expect.element(page.getByRole('switch')).toBeChecked();
	});

	it('does not toggle while disabled', async () => {
		render(Switch, { 'aria-label': 'Notifications', disabled: true });

		const toggle = page.getByRole('switch');

		await expect.element(toggle).toBeDisabled();
		await expect.element(toggle).not.toBeChecked();
	});

	it('marks itself invalid for consumer styling', async () => {
		render(Switch, { 'aria-label': 'Notifications', invalid: true });

		const root = page.getByRole('switch').element().parentElement;

		expect(root?.hasAttribute('data-invalid')).toBe(true);
	});

	it('lets a consumer class override an internal one', async () => {
		render(Switch, { 'aria-label': 'Notifications', class: 'w-14' });

		const root = page.getByRole('switch').element().parentElement;

		expect(root?.className).toContain('w-14');
		expect(root?.className).not.toContain('w-9');
	});

	it('forwards unrecognized attributes', async () => {
		render(Switch, { 'aria-label': 'Notifications', name: 'notifications' });

		await expect.element(page.getByRole('switch')).toHaveAttribute('name', 'notifications');
	});
});
