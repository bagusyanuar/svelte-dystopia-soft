import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Collapsible from './Collapsible.svelte';
import BindingHarness from './BindingHarness.spec.svelte';

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
});
