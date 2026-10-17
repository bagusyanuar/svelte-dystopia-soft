import { page, userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import TabsHarness from './TabsHarness.spec.svelte';
import BindingHarness from './BindingHarness.spec.svelte';
import TabsSemiHeadlessHarness from './TabsSemiHeadlessHarness.spec.svelte';

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

	it('exposes data-slot, data-orientation, and data-value across tabs parts', async () => {
		render(TabsSemiHeadlessHarness, { value: 'tab1', orientation: 'horizontal' });

		const root = page.getByTestId('semi-tabs-root').element();
		expect(root.getAttribute('data-slot')).toBe('tabs');
		expect(root.getAttribute('data-orientation')).toBe('horizontal');
		expect(root.getAttribute('data-value')).toBe('tab1');

		const list = page.getByTestId('semi-tabs-list').element();
		expect(list.getAttribute('data-slot')).toBe('tabs-list');
		expect(list.getAttribute('data-orientation')).toBe('horizontal');

		const trigger1 = page.getByRole('tab', { name: 'Tab 1' }).element();
		expect(trigger1.getAttribute('data-slot')).toBe('tabs-trigger');
		expect(trigger1.getAttribute('data-state')).toBe('active');
		expect(trigger1.getAttribute('data-value')).toBe('tab1');
		expect(trigger1.hasAttribute('data-selected')).toBe(true);

		const trigger2 = page.getByRole('tab', { name: 'Tab 2' }).element();
		expect(trigger2.getAttribute('data-state')).toBe('inactive');
		expect(trigger2.hasAttribute('data-selected')).toBe(false);

		const trigger3 = page.getByRole('tab', { name: 'Tab 3 Disabled' }).element();
		expect(trigger3.hasAttribute('data-disabled')).toBe(true);

		const panel1 = page.getByRole('tabpanel').element();
		expect(panel1.getAttribute('data-slot')).toBe('tabs-content');
		expect(panel1.getAttribute('data-state')).toBe('active');
		expect(panel1.getAttribute('data-value')).toBe('tab1');
	});

	it('binds element refs on Tabs, TabsList, TabsTrigger, and TabsContent', async () => {
		render(TabsSemiHeadlessHarness, { value: 'tab1' });

		await expect.element(page.getByTestId('has-tabs-ref')).toHaveTextContent('true');
		await expect.element(page.getByTestId('has-list-ref')).toHaveTextContent('true');
		await expect.element(page.getByTestId('has-trigger1-ref')).toHaveTextContent('true');
		await expect.element(page.getByTestId('has-content1-ref')).toHaveTextContent('true');
	});

	it('invokes onValueChange callback with the newly activated tab value', async () => {
		render(TabsSemiHeadlessHarness, { value: 'tab1' });

		await page.getByRole('tab', { name: 'Tab 2' }).click();

		await expect.element(page.getByTestId('callback-count')).toHaveTextContent('1');
		await expect.element(page.getByTestId('callback-val')).toHaveTextContent('tab2');
		await expect.element(page.getByTestId('bound-value')).toHaveTextContent('tab2');
	});

	it('supports forceMount on TabsContent to keep unselected panels mounted with hidden attribute', async () => {
		render(TabsSemiHeadlessHarness, { value: 'tab1', forceMount: true });

		const panel1 = page.getByTestId('panel-content-1');
		const panel2 = page.getByTestId('panel-content-2');

		await expect.element(panel1).toBeInTheDocument();
		await expect.element(panel2).toBeInTheDocument();

		const panel2Wrapper = panel2.element().parentElement;
		expect(panel2Wrapper?.hasAttribute('hidden')).toBe(true);
		expect(panel2Wrapper?.getAttribute('data-state')).toBe('inactive');
	});

	it('passes state payload { active, disabled } to TabsTrigger children snippet', async () => {
		render(TabsSemiHeadlessHarness, { value: 'tab1', useCustomTrigger: true });

		const customText = page.getByTestId('custom-trigger-text');
		await expect.element(customText).toHaveTextContent('Custom Tab 1 (ACTIVE)');
		await expect.element(customText).toHaveAttribute('data-is-active', 'true');

		await page.getByRole('tab', { name: 'Tab 2' }).click();

		await expect.element(customText).toHaveTextContent('Custom Tab 1 (INACTIVE)');
		await expect.element(customText).toHaveAttribute('data-is-active', 'false');
	});

	it('supports child snippet on TabsTrigger to render a custom element like an anchor', async () => {
		render(TabsSemiHeadlessHarness, { value: 'tab1', useChildTrigger: true });

		const anchor = page.getByTestId('child-anchor-trigger');
		await expect.element(anchor).toBeInTheDocument();
		await expect.element(anchor).toHaveAttribute('role', 'tab');
		await expect.element(anchor).toHaveAttribute('aria-selected', 'true');
		await expect.element(anchor).toHaveAttribute('data-anchor-active', 'true');
	});

	it('supports vertical orientation with ArrowDown and ArrowUp roving navigation', async () => {
		render(TabsSemiHeadlessHarness, { value: 'tab1', orientation: 'vertical' });

		const list = page.getByRole('tablist');
		await expect.element(list).toHaveAttribute('aria-orientation', 'vertical');
		await expect.element(list).toHaveAttribute('data-orientation', 'vertical');

		await page.getByRole('tab', { name: 'Tab 1' }).element().focus();
		await userEvent.keyboard('{ArrowDown}');

		await expect.element(page.getByRole('tab', { name: 'Tab 2' })).toHaveFocus();
		await expect
			.element(page.getByRole('tab', { name: 'Tab 2' }))
			.toHaveAttribute('aria-selected', 'true');

		await userEvent.keyboard('{ArrowUp}');
		await expect.element(page.getByRole('tab', { name: 'Tab 1' })).toHaveFocus();
	});

	it('supports variant="underline" with border-b styles and data-variant attribute', async () => {
		render(TabsSemiHeadlessHarness, { value: 'tab1', variant: 'underline' });

		const root = page.getByTestId('semi-tabs-root').element();
		expect(root.getAttribute('data-variant')).toBe('underline');

		const list = page.getByTestId('semi-tabs-list').element();
		expect(list.getAttribute('data-variant')).toBe('underline');
		expect(list.className).toContain('border-b');

		const trigger1 = page.getByRole('tab', { name: 'Tab 1' }).element();
		expect(trigger1.getAttribute('data-variant')).toBe('underline');
		expect(trigger1.className).toContain('border-b-2');
	});
});


