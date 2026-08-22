import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import HelperText from './HelperText.svelte';
import AssociationHarness from './AssociationHarness.spec.svelte';

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
});
