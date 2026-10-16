import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Collapsible from './Collapsible.svelte';
import BindingHarness from './BindingHarness.spec.svelte';
import CollapsibleHarness from './CollapsibleHarness.spec.svelte';

const trigger = createRawSnippet(() => ({
	render: () => `<span>Toggle</span>`
}));
const content = createRawSnippet(() => ({
	render: () => `<p>Details go here.</p>`
}));

describe('Collapsible.svelte', () => {
	it('renders the trigger', async () => {
		render(Collapsible, { trigger, children: content });

		await expect.element(page.getByRole('button', { name: 'Toggle' })).toBeInTheDocument();
	});

	it('is collapsed by default', async () => {
		render(Collapsible, { trigger, children: content });

		await expect
			.element(page.getByRole('button', { name: 'Toggle' }))
			.toHaveAttribute('aria-expanded', 'false');
	});

	it('expands when the trigger is clicked', async () => {
		render(Collapsible, { trigger, children: content });

		await page.getByRole('button', { name: 'Toggle' }).click();

		await expect
			.element(page.getByRole('button', { name: 'Toggle' }))
			.toHaveAttribute('aria-expanded', 'true');
	});

	it('collapses again on a second click', async () => {
		render(Collapsible, { trigger, children: content });

		const button = page.getByRole('button', { name: 'Toggle' });
		await button.click();
		await button.click();

		await expect.element(button).toHaveAttribute('aria-expanded', 'false');
	});

	it('associates the trigger with the content region it controls via aria-controls', async () => {
		render(Collapsible, { trigger, children: content });

		const button = page.getByRole('button', { name: 'Toggle' }).element();
		const controlsId = button.getAttribute('aria-controls');

		expect(controlsId).toBeTruthy();
		expect(document.getElementById(controlsId!)?.textContent).toContain('Details go here.');
	});

	it('removes the collapsed content from the tab order', async () => {
		render(Collapsible, { trigger, children: content });

		const button = page.getByRole('button', { name: 'Toggle' }).element();
		const controlsId = button.getAttribute('aria-controls');

		expect(document.getElementById(controlsId!)?.inert).toBe(true);
	});

	it('propagates the open state back to the consumer', async () => {
		render(BindingHarness);

		await page.getByRole('button', { name: 'Toggle' }).click();

		await expect.element(page.getByTestId('outer-open')).toHaveTextContent('true');
	});

	it('does not toggle while disabled', async () => {
		render(Collapsible, { trigger, children: content, disabled: true });

		const button = page.getByRole('button', { name: 'Toggle' });
		await expect.element(button).toBeDisabled();
		await button.click({ force: true });

		await expect.element(button).toHaveAttribute('aria-expanded', 'false');
	});

	it('lets a consumer class override an internal one', async () => {
		render(Collapsible, { trigger, children: content, class: 'rounded-md' });

		const root = page.getByRole('button', { name: 'Toggle' }).element().parentElement;

		expect(root?.className).toContain('rounded-md');
		expect(root?.className).not.toContain('rounded-lg');
	});

	// --- Semi-headless capability & hover rounded fix tests ---

	it('fixes header hover rounded bug: clips via root overflow-hidden and removes rounded-lg from trigger', async () => {
		render(Collapsible, { trigger, children: content, open: true });

		const button = page.getByRole('button', { name: 'Toggle' }).element();
		const root = button.parentElement;

		expect(root?.className).toContain('overflow-hidden');
		expect(root?.className).toContain('rounded-lg');
		expect(button.className).not.toContain('rounded-lg');
	});

	it('exposes data-slot, data-state, and data-disabled on root container', async () => {
		render(Collapsible, { trigger, children: content, open: true });

		const button = page.getByRole('button', { name: 'Toggle' }).element();
		const root = button.parentElement;

		expect(root?.getAttribute('data-slot')).toBe('collapsible');
		expect(root?.getAttribute('data-state')).toBe('open');
		expect(root?.hasAttribute('data-disabled')).toBe(false);
	});

	it('binds both root ref and triggerRef via bindable props', async () => {
		render(CollapsibleHarness);

		await expect.element(page.getByTestId('has-collapsible-ref')).toHaveTextContent('yes');
		await expect.element(page.getByTestId('has-trigger-ref')).toHaveTextContent('yes');
	});

	it('forwards open state payload to trigger and children snippets', async () => {
		render(CollapsibleHarness);

		await expect.element(page.getByTestId('trigger-text')).toHaveTextContent('Collapsed');
		await expect.element(page.getByTestId('content-text')).toHaveTextContent('Closed Content');

		await page.getByRole('button', { name: /Collapsed/ }).click();

		await expect.element(page.getByTestId('trigger-text')).toHaveTextContent('Expanded');
		await expect.element(page.getByTestId('content-text')).toHaveTextContent('Open Content');
	});

	it('supports custom indicator snippet and sub-part classes', async () => {
		render(CollapsibleHarness, { customIndicator: true });

		await expect.element(page.getByTestId('custom-indicator')).toHaveTextContent('[+]');

		const button = page.getByRole('button', { name: /Collapsed/ }).element();
		const controlsId = button.getAttribute('aria-controls');
		const panel = document.getElementById(controlsId!);

		expect(panel?.className).toContain('custom-panel-class');
	});
});

