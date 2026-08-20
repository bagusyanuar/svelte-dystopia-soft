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
});
