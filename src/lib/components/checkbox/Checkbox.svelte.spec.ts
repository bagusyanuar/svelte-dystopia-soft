import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Checkbox from './Checkbox.svelte';
import BindingHarness from './BindingHarness.spec.svelte';
import CheckboxHarness from './CheckboxHarness.spec.svelte';

describe('Checkbox.svelte', () => {
	it('renders an unchecked checkbox by default', async () => {
		render(Checkbox, { 'aria-label': 'Accept terms' });

		await expect.element(page.getByRole('checkbox')).not.toBeChecked();
	});

	it('propagates the checked state back to the consumer', async () => {
		render(BindingHarness);

		await page.getByRole('checkbox').click();

		await expect.element(page.getByTestId('outer-checked')).toHaveTextContent('true');
	});

	it('clears the indeterminate state once the user clicks', async () => {
		render(BindingHarness);

		expect((page.getByRole('checkbox').element() as HTMLInputElement).indeterminate).toBe(true);

		await page.getByRole('checkbox').click();

		await expect.element(page.getByTestId('outer-indeterminate')).toHaveTextContent('false');
	});

	it('is toggled by clicking its associated label', async () => {
		render(BindingHarness);

		await page.getByText('Accept terms').click();

		await expect.element(page.getByRole('checkbox')).toBeChecked();
	});

	it('does not toggle while disabled', async () => {
		render(Checkbox, { 'aria-label': 'Accept terms', disabled: true });

		const checkbox = page.getByRole('checkbox');

		await expect.element(checkbox).toBeDisabled();
		await expect.element(checkbox).not.toBeChecked();
	});

	it('marks the input as invalid', async () => {
		render(Checkbox, { 'aria-label': 'Accept terms', invalid: true });

		await expect.element(page.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
	});

	it('lets a consumer class override an internal one', async () => {
		render(Checkbox, { 'aria-label': 'Accept terms', class: 'size-8' });

		const root = page.getByRole('checkbox').element().parentElement;

		expect(root?.className).toContain('size-8');
		expect(root?.className).not.toContain('size-5');
	});

	it('forwards unrecognized attributes to the input', async () => {
		render(Checkbox, { 'aria-label': 'Accept terms', name: 'terms', value: 'yes' });

		const checkbox = page.getByRole('checkbox');

		await expect.element(checkbox).toHaveAttribute('name', 'terms');
		await expect.element(checkbox).toHaveAttribute('value', 'yes');
	});

	// --- Semi-headless capability tests ---

	it('exposes data-slot and data-state on root element', async () => {
		render(Checkbox, { checked: true, 'aria-label': 'Accept terms' });

		const root = page.getByRole('checkbox').element().parentElement;
		expect(root?.getAttribute('data-slot')).toBe('checkbox');
		expect(root?.getAttribute('data-state')).toBe('checked');
		expect(root?.hasAttribute('data-checked')).toBe(true);
	});

	it('exposes data-state="indeterminate" when indeterminate is true', async () => {
		render(Checkbox, { indeterminate: true, 'aria-label': 'Accept terms' });

		const root = page.getByRole('checkbox').element().parentElement;
		expect(root?.getAttribute('data-state')).toBe('indeterminate');
		expect(root?.hasAttribute('data-indeterminate')).toBe(true);
	});

	it('exposes data-state="unchecked" when unchecked', async () => {
		render(Checkbox, { checked: false, 'aria-label': 'Accept terms' });

		const root = page.getByRole('checkbox').element().parentElement;
		expect(root?.getAttribute('data-state')).toBe('unchecked');
	});

	it('exposes data-size attribute on root element', async () => {
		render(Checkbox, { size: 'lg', 'aria-label': 'Accept terms' });

		const root = page.getByRole('checkbox').element().parentElement;
		expect(root?.getAttribute('data-size')).toBe('lg');
	});

	it('binds both input ref and rootRef via bindable props', async () => {
		render(CheckboxHarness);

		await expect.element(page.getByTestId('has-input-ref')).toHaveTextContent('yes');
		await expect.element(page.getByTestId('has-root-ref')).toHaveTextContent('yes');
	});

	it('supports custom indicator snippet with state payload', async () => {
		render(CheckboxHarness, { customIndicator: true, checked: true });

		await expect.element(page.getByTestId('custom-indicator')).toHaveTextContent('check');
	});

	it('forwards custom sub-part classes to indicator and input', async () => {
		render(Checkbox, {
			'aria-label': 'Accept terms',
			classes: {
				input: 'custom-input-class',
				indicator: 'custom-indicator-class'
			}
		});

		const input = page.getByRole('checkbox').element();
		const indicator = input.parentElement?.querySelector('[data-slot="checkbox-indicator"]');

		expect(input.className).toContain('custom-input-class');
		expect(indicator?.className).toContain('custom-indicator-class');
	});

	it('renders with integrated label when label prop is provided', async () => {
		render(Checkbox, { label: 'Remember me' });

		const label = page.getByText('Remember me');
		await expect.element(label).toBeInTheDocument();

		const checkbox = page.getByRole('checkbox');
		const inputId = checkbox.element().getAttribute('id');
		expect(inputId).toBeTruthy();
		expect(label.element().getAttribute('for')).toBe(inputId);
	});

	it('allows customizing label class via classes.label', async () => {
		render(Checkbox, {
			label: 'Custom label',
			classes: { label: 'custom-label-style' }
		});

		const label = page.getByText('Custom label');
		expect(label.element().className).toContain('custom-label-style');
	});

	it('clicking integrated label toggles the checkbox', async () => {
		render(Checkbox, { label: 'Clickable label' });

		await page.getByText('Clickable label').click();
		await expect.element(page.getByRole('checkbox')).toBeChecked();
	});

	it('renders with integrated description when description prop is provided', async () => {
		render(Checkbox, {
			label: 'Email digest',
			description: 'Receive weekly updates on project progress'
		});

		await expect.element(page.getByText('Email digest')).toBeInTheDocument();
		await expect.element(page.getByText('Receive weekly updates on project progress')).toBeInTheDocument();
	});
});


