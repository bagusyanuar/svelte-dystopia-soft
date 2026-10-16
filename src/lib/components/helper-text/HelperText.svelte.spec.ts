import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import HelperText from './HelperText.svelte';
import AssociationHarness from './AssociationHarness.spec.svelte';
import HelperTextSemiHeadlessHarness from './HelperTextSemiHeadlessHarness.spec.svelte';

const text = createRawSnippet(() => ({
	render: () => `<span>Must be at least 8 characters.</span>`
}));

describe('HelperText.svelte', () => {
	it('renders its children', async () => {
		render(HelperText, { children: text });

		await expect.element(page.getByText('Must be at least 8 characters.')).toBeInTheDocument();
	});

	it('has no alert role by default', async () => {
		render(HelperText, { children: text });

		const el = page.getByText('Must be at least 8 characters.').element().closest('p');

		expect(el?.hasAttribute('role')).toBe(false);
	});

	it('announces itself as an alert when invalid', async () => {
		render(HelperText, { invalid: true, children: text });

		await expect.element(page.getByRole('alert')).toBeInTheDocument();
	});

	it('marks itself invalid for consumer styling', async () => {
		render(HelperText, { invalid: true, children: text });

		const el = page.getByText('Must be at least 8 characters.').element().closest('p');

		expect(el?.hasAttribute('data-invalid')).toBe(true);
	});

	it('forwards unrecognized attributes', async () => {
		render(HelperText, { id: 'email-error', children: text });

		const el = page.getByText('Must be at least 8 characters.').element().closest('p');

		expect(el?.id).toBe('email-error');
	});

	it('describes the associated field via aria-describedby', async () => {
		render(AssociationHarness);

		await expect
			.element(page.getByPlaceholder('you@company.com'))
			.toHaveAccessibleDescription('Enter a valid email address.');
	});

	it('exposes ref bound to the root paragraph element', async () => {
		render(HelperTextSemiHeadlessHarness);

		const status = page.getByTestId('ref-status');
		await expect.element(status).toHaveAttribute('data-has-root', 'true');
	});

	it('exposes data-slot hooks on root and icon', async () => {
		render(HelperTextSemiHeadlessHarness);

		const root = document.querySelector('[data-slot="helper-text"]');
		expect(root?.getAttribute('data-slot')).toBe('helper-text');
		expect(root?.querySelector('[data-slot="helper-text-icon"]')).toBeTruthy();
	});

	it('lets a consumer style the icon container via classes.icon', async () => {
		render(HelperTextSemiHeadlessHarness, {
			classes: { icon: 'custom-icon-class' }
		});

		const iconEl = document.querySelector('[data-slot="helper-text-icon"]');
		expect(iconEl?.className).toContain('custom-icon-class');
	});

	it('forwards the invalid state payload to icon and children snippets', async () => {
		render(HelperTextSemiHeadlessHarness, { invalid: true });

		const icon = page.getByTestId('test-icon');
		const content = page.getByTestId('test-text');

		await expect.element(icon).toHaveAttribute('data-invalid-payload', 'true');
		await expect.element(content).toHaveAttribute('data-invalid-payload', 'true');
		await expect.element(content).toHaveTextContent('Pesan kesalahan.');
	});
});
