import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Button from './Button.svelte';

const label = createRawSnippet(() => ({
	render: () => `<span>Click me</span>`
}));

describe('Button.svelte', () => {
	it('renders children', async () => {
		render(Button, { children: label });

		await expect.element(page.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
	});

	it('calls onclick when clicked', async () => {
		const onclick = vi.fn();
		render(Button, { onclick, children: label });

		await page.getByRole('button', { name: 'Click me' }).click();

		expect(onclick).toHaveBeenCalledOnce();
	});

	it('is disabled when the disabled prop is set', async () => {
		render(Button, { disabled: true, children: label });

		await expect.element(page.getByRole('button', { name: 'Click me' })).toBeDisabled();
	});

	it('is disabled and marked busy while isLoading is set', async () => {
		render(Button, { isLoading: true, children: label });

		const button = page.getByRole('button', { name: 'Click me' });

		await expect.element(button).toBeDisabled();
		await expect.element(button).toHaveAttribute('aria-busy', 'true');
	});

	it('does not call onclick while isLoading is set', async () => {
		const onclick = vi.fn();
		render(Button, { onclick, isLoading: true, children: label });

		await page.getByRole('button', { name: 'Click me' }).click({ force: true });

		expect(onclick).not.toHaveBeenCalled();
	});

	it('shows the default spinner while isLoading is set', async () => {
		render(Button, { isLoading: true, children: label });

		const svg = page.getByRole('button', { name: 'Click me' }).element().querySelector('svg');

		expect(svg).not.toBeNull();
		expect(svg?.getAttribute('aria-hidden')).toBe('true');
	});

	it('renders a custom loading snippet instead of the default spinner', async () => {
		const customLoading = createRawSnippet(() => ({
			render: () => `<span data-testid="custom-spinner">Loading…</span>`
		}));

		render(Button, { isLoading: true, loading: customLoading, children: label });

		await expect.element(page.getByTestId('custom-spinner')).toBeInTheDocument();
		const svg = page.getByRole('button').element().querySelector('svg');
		expect(svg).toBeNull();
	});
});
