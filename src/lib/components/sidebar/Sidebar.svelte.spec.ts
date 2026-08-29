import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import SidebarHarness from './SidebarHarness.spec.svelte';
import BindingHarness from './BindingHarness.spec.svelte';
import CollapsibleBindingHarness from './CollapsibleBindingHarness.spec.svelte';

describe('Sidebar family', () => {
	it('renders a complementary landmark, expanded by default', async () => {
		render(SidebarHarness);

		await expect.element(page.getByRole('complementary')).toBeInTheDocument();
		await expect.element(page.getByRole('complementary')).toHaveAttribute('data-state', 'expanded');
	});

	it('marks the active item with aria-current and data-state', async () => {
		render(SidebarHarness);

		await expect
			.element(page.getByRole('button', { name: 'Dashboard' }))
			.toHaveAttribute('aria-current', 'page');
		await expect
			.element(page.getByRole('button', { name: 'Dashboard' }))
			.toHaveAttribute('data-state', 'active');
		await expect
			.element(page.getByRole('button', { name: 'Projects' }))
			.not.toHaveAttribute('aria-current');
	});

	it('renders items as type="button" so they never submit a surrounding form', async () => {
		render(SidebarHarness);

		await expect
			.element(page.getByRole('button', { name: 'Dashboard' }))
			.toHaveAttribute('type', 'button');
	});

	it('collapses on trigger click, updating data-state and aria-expanded', async () => {
		render(SidebarHarness);

		await expect
			.element(page.getByRole('button', { name: 'Collapse sidebar' }))
			.toHaveAttribute('aria-expanded', 'true');

		await page.getByRole('button', { name: 'Collapse sidebar' }).click();

		await expect
			.element(page.getByRole('complementary'))
			.toHaveAttribute('data-state', 'collapsed');
		await expect
			.element(page.getByRole('button', { name: 'Expand sidebar' }))
			.toHaveAttribute('aria-expanded', 'false');
	});

	it('keeps the item label reachable to assistive tech when collapsed', async () => {
		render(SidebarHarness);

		await page.getByRole('button', { name: 'Collapse sidebar' }).click();

		await expect.element(page.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument();
	});

	it('propagates collapsed state back to the consumer via bind:collapsed', async () => {
		render(BindingHarness);

		await page.getByRole('button', { name: 'Collapse sidebar' }).click();

		await expect.element(page.getByTestId('outer-collapsed')).toHaveTextContent('true');
	});

	it('lets a consumer class override an internal class on each part', async () => {
		render(SidebarHarness);

		expect(page.getByRole('complementary').element().className).toContain('custom-sidebar');
		expect(page.getByRole('button', { name: 'Collapse sidebar' }).element().className).toContain(
			'custom-trigger'
		);
		expect(page.getByRole('button', { name: 'Dashboard' }).element().className).toContain(
			'custom-item'
		);
	});

	it('forwards unrecognized attributes on the root', async () => {
		render(SidebarHarness);

		await expect.element(page.getByTestId('sidebar-root')).toBeInTheDocument();
	});
});

describe('SidebarCollapsibleItem', () => {
	it('is collapsed by default', async () => {
		render(SidebarHarness);

		await expect
			.element(page.getByRole('button', { name: 'Team' }))
			.toHaveAttribute('aria-expanded', 'false');
	});

	it('expands on click and reveals its nested items', async () => {
		render(SidebarHarness);

		await page.getByRole('button', { name: 'Team' }).click();

		await expect
			.element(page.getByRole('button', { name: 'Team' }))
			.toHaveAttribute('aria-expanded', 'true');
		await expect.element(page.getByRole('button', { name: 'Active members' })).toBeInTheDocument();
	});

	it('removes collapsed nested items from the tab order via inert', async () => {
		render(SidebarHarness);

		const button = page.getByRole('button', { name: 'Team' }).element();
		const controlsId = button.getAttribute('aria-controls');

		expect(document.getElementById(controlsId!)?.inert).toBe(true);

		await page.getByRole('button', { name: 'Team' }).click();

		expect(document.getElementById(controlsId!)?.inert).toBe(false);
	});

	it('propagates the open state back to the consumer via bind:open', async () => {
		render(CollapsibleBindingHarness);

		await page.getByRole('button', { name: 'Team' }).click();

		await expect.element(page.getByTestId('outer-open')).toHaveTextContent('true');
	});

	it('lets a consumer class override an internal class', async () => {
		render(SidebarHarness);

		expect(page.getByRole('button', { name: 'Team' }).element().className).toContain(
			'custom-collapsible'
		);
	});
});
