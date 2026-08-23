import { page, userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import TabsHarness from './TabsHarness.spec.svelte';
import BindingHarness from './BindingHarness.spec.svelte';

describe('Tabs family', () => {
	it('renders a tablist with a tab per trigger', async () => {
		render(TabsHarness);

		await expect.element(page.getByRole('tablist')).toBeInTheDocument();
		await expect.element(page.getByRole('tab', { name: 'Profile' })).toBeInTheDocument();
		await expect.element(page.getByRole('tab', { name: 'Billing' })).toBeInTheDocument();
	});

	it('shows only the panel matching the current value', async () => {
		render(TabsHarness);

		await expect.element(page.getByRole('tabpanel')).toHaveTextContent('Profile content');
		await expect.element(page.getByText('Billing content')).not.toBeInTheDocument();
	});

	it('marks the active tab with aria-selected and a roving tabindex', async () => {
		render(TabsHarness);

		await expect
			.element(page.getByRole('tab', { name: 'Profile' }))
			.toHaveAttribute('aria-selected', 'true');
		await expect
			.element(page.getByRole('tab', { name: 'Profile' }))
			.toHaveAttribute('tabindex', '0');
		await expect
			.element(page.getByRole('tab', { name: 'Billing' }))
			.toHaveAttribute('aria-selected', 'false');
		await expect
			.element(page.getByRole('tab', { name: 'Billing' }))
			.toHaveAttribute('tabindex', '-1');
	});

	it('associates each tab with its panel via aria-controls/id', async () => {
		render(TabsHarness);

		const tab = page.getByRole('tab', { name: 'Profile' }).element();
		const panel = page.getByRole('tabpanel').element();

		expect(tab.getAttribute('aria-controls')).toBe(panel.id);
		expect(panel.getAttribute('aria-labelledby')).toBe(tab.id);
	});

	it('switches panel when a tab is clicked', async () => {
		render(TabsHarness);

		await page.getByRole('tab', { name: 'Billing' }).click();

		await expect.element(page.getByRole('tabpanel')).toHaveTextContent('Billing content');
	});

	it('ArrowRight moves focus to the next tab and activates it, skipping disabled tabs', async () => {
		render(TabsHarness);

		await page.getByRole('tab', { name: 'Profile' }).element().focus();
		await userEvent.keyboard('{ArrowRight}');

		await expect.element(page.getByRole('tab', { name: 'Billing' })).toHaveFocus();
		await expect
			.element(page.getByRole('tab', { name: 'Billing' }))
			.toHaveAttribute('aria-selected', 'true');

		await userEvent.keyboard('{ArrowRight}');

		await expect.element(page.getByRole('tab', { name: 'Profile' })).toHaveFocus();
	});

	it('ArrowLeft from the first tab wraps to the last enabled tab', async () => {
		render(TabsHarness);

		await page.getByRole('tab', { name: 'Profile' }).element().focus();
		await userEvent.keyboard('{ArrowLeft}');

		await expect.element(page.getByRole('tab', { name: 'Billing' })).toHaveFocus();
	});

	it('Home and End jump to the first and last enabled tab', async () => {
		render(TabsHarness);

		await page.getByRole('tab', { name: 'Profile' }).element().focus();
		await userEvent.keyboard('{End}');
		await expect.element(page.getByRole('tab', { name: 'Billing' })).toHaveFocus();

		await userEvent.keyboard('{Home}');
		await expect.element(page.getByRole('tab', { name: 'Profile' })).toHaveFocus();
	});

	it('propagates the active value back to the consumer', async () => {
		render(BindingHarness);

		await page.getByRole('tab', { name: 'Billing' }).click();

		await expect.element(page.getByTestId('outer-value')).toHaveTextContent('billing');
	});

	it('lets a consumer class override an internal class on each part', async () => {
		render(TabsHarness);

		expect(page.getByRole('tablist').element().className).toContain('custom-list');
		expect(page.getByRole('tab', { name: 'Billing' }).element().className).toContain(
			'custom-trigger'
		);
		expect(page.getByRole('tabpanel').element().className).toContain('custom-content');
	});

	it('forwards unrecognized attributes on the root', async () => {
		render(TabsHarness);

		await expect.element(page.getByTestId('tabs-root')).toBeInTheDocument();
	});
});
