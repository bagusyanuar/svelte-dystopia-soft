import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Switch from './Switch.svelte';
import BindingHarness from './BindingHarness.spec.svelte';
import SwitchHarness from './SwitchHarness.spec.svelte';

describe('Switch.svelte', () => {
	it('renders an unchecked switch by default', async () => {
		render(Switch, { 'aria-label': 'Notifications' });

		await expect.element(page.getByRole('switch')).not.toBeChecked();
	});

	it('propagates the checked state back to the consumer', async () => {
		render(BindingHarness);

		await page.getByRole('switch').click();

		await expect.element(page.getByTestId('outer-checked')).toHaveTextContent('true');
	});

	it('is toggled by clicking its associated label', async () => {
		render(BindingHarness);

		await page.getByText('Notifications').click();

		await expect.element(page.getByRole('switch')).toBeChecked();
	});

	it('does not toggle while disabled', async () => {
		render(Switch, { 'aria-label': 'Notifications', disabled: true });

		const toggle = page.getByRole('switch');

		await expect.element(toggle).toBeDisabled();
		await expect.element(toggle).not.toBeChecked();
	});

	it('marks itself invalid for consumer styling', async () => {
		render(Switch, { 'aria-label': 'Notifications', invalid: true });

		const root = page.getByRole('switch').element().parentElement;

		expect(root?.hasAttribute('data-invalid')).toBe(true);
	});

	it('lets a consumer class override an internal one', async () => {
		render(Switch, { 'aria-label': 'Notifications', class: 'w-14' });

		const root = page.getByRole('switch').element().parentElement;

		expect(root?.className).toContain('w-14');
		expect(root?.className).not.toContain('w-9');
	});

	it('forwards unrecognized attributes', async () => {
		render(Switch, { 'aria-label': 'Notifications', name: 'notifications' });

		await expect.element(page.getByRole('switch')).toHaveAttribute('name', 'notifications');
	});

	it('exposes data-slot and data-state on root control element', async () => {
		render(Switch, { 'aria-label': 'Airplane mode' });

		const root = page.getByRole('switch').element().parentElement;
		expect(root?.getAttribute('data-slot')).toBe('switch');
		expect(root?.getAttribute('data-state')).toBe('unchecked');
		expect(root?.hasAttribute('data-checked')).toBe(false);
	});

	it('exposes data-state="checked" and data-checked when checked is true', async () => {
		render(Switch, { 'aria-label': 'Airplane mode', checked: true });

		const root = page.getByRole('switch').element().parentElement;
		expect(root?.getAttribute('data-state')).toBe('checked');
		expect(root?.hasAttribute('data-checked')).toBe(true);
	});

	it('exposes data-size and data-disabled attributes on root element', async () => {
		render(Switch, { 'aria-label': 'Power', size: 'lg', disabled: true });

		const root = page.getByRole('switch').element().parentElement;
		expect(root?.getAttribute('data-size')).toBe('lg');
		expect(root?.hasAttribute('data-disabled')).toBe(true);
	});

	it('binds input ref and rootRef via bindable props', async () => {
		render(SwitchHarness, { checked: false });

		await expect.element(page.getByTestId('has-input-ref')).toHaveTextContent('true');
		await expect.element(page.getByTestId('has-root-ref')).toHaveTextContent('true');
		// Field ref is false when label/description are not passed
		await expect.element(page.getByTestId('has-field-ref')).toHaveTextContent('false');
	});

	it('binds fieldRef when label is provided', async () => {
		render(SwitchHarness, { label: 'Bluetooth' });

		await expect.element(page.getByTestId('has-field-ref')).toHaveTextContent('true');
	});

	it('invokes onCheckedChange callback with updated state on toggle', async () => {
		const onCheckedChange = vi.fn();
		render(SwitchHarness, { checked: false, onCheckedChange });

		await page.getByRole('switch').click();

		expect(onCheckedChange).toHaveBeenCalledWith(true);
		await expect.element(page.getByTestId('callback-count')).toHaveTextContent('1');
		await expect.element(page.getByTestId('callback-val')).toHaveTextContent('true');
		await expect.element(page.getByTestId('bound-checked')).toHaveTextContent('true');
	});

	it('renders custom thumb snippet with state payload', async () => {
		render(SwitchHarness, { checked: false, customThumb: true });

		await expect.element(page.getByTestId('custom-thumb')).toHaveTextContent('OFF');
		await expect.element(page.getByTestId('custom-thumb')).toHaveAttribute('data-thumb-checked', 'false');

		await page.getByRole('switch').click();

		await expect.element(page.getByTestId('custom-thumb')).toHaveTextContent('ON');
		await expect.element(page.getByTestId('custom-thumb')).toHaveAttribute('data-thumb-checked', 'true');
	});

	it('forwards custom sub-part classes to root, input, and thumb', async () => {
		render(Switch, {
			'aria-label': 'Mode',
			classes: {
				root: 'custom-root-class',
				input: 'custom-input-class',
				thumb: 'custom-thumb-class'
			}
		});

		const input = page.getByRole('switch');
		await expect.element(input).toHaveClass('custom-input-class');

		const root = input.element().parentElement;
		expect(root?.classList.contains('custom-root-class')).toBe(true);

		const thumb = root?.querySelector('[data-slot="switch-thumb"]');
		expect(thumb?.classList.contains('custom-thumb-class')).toBe(true);
	});

	it('renders with integrated label and description with proper slots and classes', async () => {
		render(Switch, {
			label: 'Do not disturb',
			description: 'Silence all incoming calls and notifications',
			classes: {
				field: 'custom-field-box',
				label: 'custom-label-text',
				description: 'custom-desc-text'
			}
		});

		const field = page.getByRole('switch').element().closest('[data-slot="switch-field"]');
		expect(field).not.toBeNull();
		expect(field?.classList.contains('custom-field-box')).toBe(true);

		const label = page.getByText('Do not disturb');
		await expect.element(label).toHaveClass('custom-label-text');

		const desc = page.getByText('Silence all incoming calls and notifications');
		await expect.element(desc).toHaveClass('custom-desc-text');
		expect(desc.element().getAttribute('data-slot')).toBe('switch-description');
	});

	it('clicking integrated label toggles the switch', async () => {
		render(Switch, { label: 'Dark Mode' });

		const toggle = page.getByRole('switch');
		await expect.element(toggle).not.toBeChecked();

		await page.getByText('Dark Mode').click();
		await expect.element(toggle).toBeChecked();
	});
});

