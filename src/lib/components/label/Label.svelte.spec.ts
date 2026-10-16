import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Label from './Label.svelte';
import AssociationHarness from './AssociationHarness.spec.svelte';
import LabelSemiHeadlessHarness from './LabelSemiHeadlessHarness.spec.svelte';

const text = createRawSnippet(() => ({
	render: () => `<span>Email</span>`
}));

describe('Label.svelte', () => {
	it('renders its children', async () => {
		render(Label, { children: text });

		await expect.element(page.getByText('Email')).toBeInTheDocument();
	});

	it('focuses the associated field when clicked', async () => {
		render(AssociationHarness);

		await page.getByText('Email').click();

		await expect.element(page.getByPlaceholder('you@company.com')).toHaveFocus();
	});

	it('shows a required marker that assistive tech ignores', async () => {
		render(Label, { required: true, children: text });

		const marker = page.getByText('*').element();

		expect(marker.getAttribute('aria-hidden')).toBe('true');
	});

	it('omits the required marker by default', async () => {
		render(Label, { children: text });

		expect(page.getByText('Email').element().closest('label')?.textContent).not.toContain('*');
	});

	it('marks itself disabled for consumer styling', async () => {
		render(Label, { disabled: true, children: text });

		const el = page.getByText('Email').element().closest('label');

		expect(el?.hasAttribute('data-disabled')).toBe(true);
	});

	it('forwards unrecognized attributes', async () => {
		render(Label, { id: 'email-label', children: text });

		expect(page.getByText('Email').element().closest('label')?.id).toBe('email-label');
	});

	it('exposes ref bound to the root label element', async () => {
		render(LabelSemiHeadlessHarness);

		const status = page.getByTestId('ref-status');
		await expect.element(status).toHaveAttribute('data-has-root', 'true');
	});

	it('exposes data-slot hooks and data-required attribute', async () => {
		render(LabelSemiHeadlessHarness, { required: true });

		const labelEl = document.querySelector('[data-slot="label"]');
		expect(labelEl).toBeTruthy();
		expect(labelEl?.hasAttribute('data-required')).toBe(true);

		const requiredEl = document.querySelector('[data-slot="label-required"]');
		expect(requiredEl).toBeTruthy();
	});

	it('lets a consumer style the required marker via classes.required', async () => {
		render(LabelSemiHeadlessHarness, {
			required: true,
			classes: { required: 'custom-required-color' }
		});

		const requiredEl = document.querySelector('[data-slot="label-required"]');
		expect(requiredEl?.className).toContain('custom-required-color');
	});

	it('forwards required and disabled state to snippet payloads', async () => {
		render(LabelSemiHeadlessHarness, { required: true, disabled: true });

		const textEl = page.getByTestId('label-text');
		await expect.element(textEl).toHaveAttribute('data-required', 'true');
		await expect.element(textEl).toHaveAttribute('data-disabled', 'true');
	});

	it('supports a custom requiredIndicator snippet', async () => {
		render(LabelSemiHeadlessHarness, {
			required: true,
			useCustomIndicator: true
		});

		await expect.element(page.getByTestId('custom-marker')).toHaveTextContent('(wajib-true)');
	});
});
