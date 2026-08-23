import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Toggle from './Toggle.svelte';
import BindingHarness from './BindingHarness.spec.svelte';

const label = createRawSnippet(() => ({
	render: () => `<span>Bold</span>`
}));

describe('Toggle.svelte', () => {
	it('renders children', async () => {
		render(Toggle, { children: label });

		await expect.element(page.getByRole('button', { name: 'Bold' })).toBeInTheDocument();
	});

	it('is unpressed by default', async () => {
		render(Toggle, { children: label });

		await expect
			.element(page.getByRole('button', { name: 'Bold' }))
			.toHaveAttribute('aria-pressed', 'false');
	});

	it('toggles pressed state when clicked', async () => {
		render(Toggle, { children: label });

		const button = page.getByRole('button', { name: 'Bold' });
		await button.click();

		await expect.element(button).toHaveAttribute('aria-pressed', 'true');
	});

	it('reflects the pressed state as data-state for style hooks', async () => {
		render(Toggle, { children: label });

		const button = page.getByRole('button', { name: 'Bold' }).element();
		expect(button.getAttribute('data-state')).toBe('off');
		expect(button.className).toContain('data-[state=on]:bg-primary/10');

		await page.getByRole('button', { name: 'Bold' }).click();

		expect(button.getAttribute('data-state')).toBe('on');
	});

	it('toggles back to unpressed on a second click', async () => {
		render(Toggle, { children: label });

		const button = page.getByRole('button', { name: 'Bold' });
		await button.click();
		await button.click();

		await expect.element(button).toHaveAttribute('aria-pressed', 'false');
	});

	it('propagates the pressed state back to the consumer', async () => {
		render(BindingHarness);

		await page.getByRole('button', { name: 'Bold' }).click();

		await expect.element(page.getByTestId('outer-pressed')).toHaveTextContent('true');
	});

	it('does not toggle while disabled', async () => {
		render(Toggle, { children: label, disabled: true });

		const button = page.getByRole('button', { name: 'Bold' });

		await expect.element(button).toBeDisabled();
		await expect.element(button).toHaveAttribute('aria-pressed', 'false');
	});

	it('has type="button" so it never submits an enclosing form', async () => {
		render(Toggle, { children: label });

		await expect
			.element(page.getByRole('button', { name: 'Bold' }))
			.toHaveAttribute('type', 'button');
	});

	it('calls onclick when clicked', async () => {
		const onclick = vi.fn();
		render(Toggle, { onclick, children: label });

		await page.getByRole('button', { name: 'Bold' }).click();

		expect(onclick).toHaveBeenCalledOnce();
	});

	it('lets a consumer class override an internal one', async () => {
		render(Toggle, { children: label, class: 'rounded-full' });

		const button = page.getByRole('button', { name: 'Bold' }).element();

		expect(button.className).toContain('rounded-full');
		expect(button.className).not.toContain('rounded-md');
	});

	it('forwards unrecognized attributes', async () => {
		render(Toggle, { children: label, id: 'bold-toggle' });

		await expect
			.element(page.getByRole('button', { name: 'Bold' }))
			.toHaveAttribute('id', 'bold-toggle');
	});
});
