import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Radio from './Radio.svelte';
import BindingHarness from './BindingHarness.spec.svelte';
import RadioSemiHeadlessHarness from './RadioSemiHeadlessHarness.spec.svelte';

describe('Radio.svelte', () => {
	it('renders an unchecked radio by default', async () => {
		render(Radio, { value: 'free', 'aria-label': 'Free' });

		await expect.element(page.getByRole('radio')).not.toBeChecked();
	});

	it('propagates the selected value back to the consumer', async () => {
		render(BindingHarness);

		await page.getByText('Free').click();

		await expect.element(page.getByTestId('outer-selected')).toHaveTextContent('free');
	});

	it('unchecks the previous radio when another one in the group is selected', async () => {
		render(BindingHarness);

		await page.getByText('Free').click();
		await page.getByText('Pro').click();

		const [free, pro] = await Promise.all([
			page.getByLabelText('Free').element(),
			page.getByLabelText('Pro').element()
		]);

		expect((free as HTMLInputElement).checked).toBe(false);
		expect((pro as HTMLInputElement).checked).toBe(true);
	});

	it('is toggled by clicking its associated label', async () => {
		render(BindingHarness);

		await page.getByText('Pro').click();

		await expect.element(page.getByLabelText('Pro')).toBeChecked();
	});

	it('does not toggle while disabled', async () => {
		render(Radio, { value: 'free', 'aria-label': 'Free', disabled: true });

		const radio = page.getByRole('radio');

		await expect.element(radio).toBeDisabled();
		await expect.element(radio).not.toBeChecked();
	});

	it('marks itself invalid for consumer styling', async () => {
		render(Radio, { value: 'free', 'aria-label': 'Free', invalid: true });

		const radio = page.getByRole('radio');
		const root = radio.element().parentElement;

		expect(root?.hasAttribute('data-invalid')).toBe(true);
	});

	it('lets a consumer class override an internal one', async () => {
		render(Radio, { value: 'free', 'aria-label': 'Free', class: 'size-8' });

		const root = page.getByRole('radio').element().parentElement;

		expect(root?.className).toContain('size-8');
		expect(root?.className).not.toContain('size-5');
	});

	it('forwards unrecognized attributes to the input', async () => {
		render(Radio, { value: 'free', 'aria-label': 'Free', name: 'plan' });

		await expect.element(page.getByRole('radio')).toHaveAttribute('name', 'plan');
	});

	// --- Semi-headless capability tests ---

	it('exposes data-slot and data-state on root element', async () => {
		render(Radio, { value: 'pro', group: 'pro', 'aria-label': 'Pro Plan' });

		const root = page.getByRole('radio').element().parentElement;
		expect(root?.getAttribute('data-slot')).toBe('radio');
		expect(root?.getAttribute('data-state')).toBe('checked');
		expect(root?.hasAttribute('data-checked')).toBe(true);
	});

	it('exposes data-state="unchecked" when unchecked', async () => {
		render(Radio, { value: 'pro', group: 'free', 'aria-label': 'Pro Plan' });

		const root = page.getByRole('radio').element().parentElement;
		expect(root?.getAttribute('data-slot')).toBe('radio');
		expect(root?.getAttribute('data-state')).toBe('unchecked');
		expect(root?.hasAttribute('data-checked')).toBe(false);
	});

	it('exposes data-size attribute on root element', async () => {
		render(Radio, { value: 'pro', size: 'lg', 'aria-label': 'Pro Plan' });

		const root = page.getByRole('radio').element().parentElement;
		expect(root?.getAttribute('data-size')).toBe('lg');
	});

	it('binds input ref, rootRef, and fieldRef via bindable props', async () => {
		render(RadioSemiHeadlessHarness, { hasLabel: true });

		await expect.element(page.getByTestId('has-input-ref')).toHaveTextContent('yes');
		await expect.element(page.getByTestId('has-root-ref')).toHaveTextContent('yes');
		await expect.element(page.getByTestId('has-field-ref')).toHaveTextContent('yes');
	});

	it('supports custom indicator snippet with state payload', async () => {
		render(RadioSemiHeadlessHarness, { customIndicator: true, value: 'pro', group: 'pro' });

		await expect.element(page.getByTestId('custom-indicator')).toHaveTextContent('ACTIVE_DOT');
	});

	it('forwards custom sub-part classes to classes.input, classes.indicator, and classes.dot', async () => {
		render(Radio, {
			value: 'pro',
			'aria-label': 'Pro Plan',
			classes: {
				input: 'custom-input-class',
				indicator: 'custom-indicator-class',
				dot: 'custom-dot-class'
			}
		});

		const input = page.getByRole('radio').element();
		const indicator = input.parentElement?.querySelector('[data-slot="radio-indicator"]');
		const dot = indicator?.querySelector('.rounded-full');

		expect(input.className).toContain('custom-input-class');
		expect(indicator?.className).toContain('custom-indicator-class');
		expect(dot?.className).toContain('custom-dot-class');
	});

	it('renders with integrated label when label prop is provided', async () => {
		render(Radio, { value: 'pro', label: 'Pro Membership' });

		const label = page.getByText('Pro Membership');
		await expect.element(label).toBeInTheDocument();

		const radio = page.getByRole('radio');
		const inputId = radio.element().getAttribute('id');
		expect(inputId).toBeTruthy();
		expect(label.element().getAttribute('for')).toBe(inputId);
	});

	it('allows customizing label and field class via classes', async () => {
		render(Radio, {
			value: 'pro',
			label: 'Custom Plan',
			classes: {
				field: 'custom-field-class',
				label: 'custom-label-style'
			}
		});

		const label = page.getByText('Custom Plan');
		expect(label.element().className).toContain('custom-label-style');

		const field = label.element().closest('[data-slot="radio-field"]');
		expect(field?.className).toContain('custom-field-class');
	});

	it('clicking integrated label selects the radio and updates group', async () => {
		render(RadioSemiHeadlessHarness, { hasLabel: true, value: 'pro' });

		await page.getByText('Pro Plan').click();

		await expect.element(page.getByRole('radio')).toBeChecked();
		await expect.element(page.getByTestId('harness-group')).toHaveTextContent('pro');
	});

	it('renders with integrated description when description prop is provided', async () => {
		render(Radio, {
			value: 'team',
			label: 'Team Tier',
			description: 'Collaborate with up to 20 users'
		});

		await expect.element(page.getByText('Team Tier')).toBeInTheDocument();
		await expect.element(page.getByText('Collaborate with up to 20 users')).toBeInTheDocument();
	});

	it('supports custom label and description snippets receiving checked state payload', async () => {
		render(RadioSemiHeadlessHarness, { useSnippets: true, value: 'pro', group: 'pro' });

		await expect.element(page.getByTestId('snippet-label')).toHaveTextContent('Pro (Selected)');
		await expect
			.element(page.getByTestId('snippet-desc'))
			.toHaveTextContent('Selected plan active');
	});

	it('supports standalone checked boolean prop without group', async () => {
		render(Radio, { value: 'pro', checked: true, 'aria-label': 'Pro Standalone' });

		const radio = page.getByRole('radio');
		await expect.element(radio).toBeChecked();

		const root = radio.element().parentElement;
		expect(root?.getAttribute('data-state')).toBe('checked');
		expect(root?.hasAttribute('data-checked')).toBe(true);
	});
});
