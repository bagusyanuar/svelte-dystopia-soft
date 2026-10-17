import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Toggle from './Toggle.svelte';
import BindingHarness from './BindingHarness.spec.svelte';
import ToggleSemiHeadlessHarness from './ToggleSemiHeadlessHarness.spec.svelte';

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

	it('exposes data-slot, data-variant, and data-size attributes', async () => {
		render(Toggle, { children: label, variant: 'outline', size: 'lg' });

		const button = page.getByRole('button', { name: 'Bold' }).element();
		expect(button.getAttribute('data-slot')).toBe('toggle');
		expect(button.getAttribute('data-variant')).toBe('outline');
		expect(button.getAttribute('data-size')).toBe('lg');
	});

	it('exposes data-pressed only when pressed is true', async () => {
		render(Toggle, { children: label });

		const button = page.getByRole('button', { name: 'Bold' });
		expect(button.element().hasAttribute('data-pressed')).toBe(false);

		await button.click();
		expect(button.element().hasAttribute('data-pressed')).toBe(true);
	});

	it('exposes data-disabled attribute when disabled', async () => {
		render(Toggle, { children: label, disabled: true });

		const button = page.getByRole('button', { name: 'Bold' }).element();
		expect(button.hasAttribute('data-disabled')).toBe(true);
	});

	it('calls onPressedChange when state changes', async () => {
		const onPressedChange = vi.fn();
		render(Toggle, { children: label, onPressedChange });

		const button = page.getByRole('button', { name: 'Bold' });
		await button.click();

		expect(onPressedChange).toHaveBeenCalledTimes(1);
		expect(onPressedChange).toHaveBeenCalledWith(true);

		await button.click();
		expect(onPressedChange).toHaveBeenCalledTimes(2);
		expect(onPressedChange).toHaveBeenCalledWith(false);
	});

	it('supports defaultPressed for uncontrolled initialization', async () => {
		render(Toggle, { children: label, defaultPressed: true });

		const button = page.getByRole('button', { name: 'Bold' });
		await expect.element(button).toHaveAttribute('aria-pressed', 'true');
		expect(button.element().getAttribute('data-state')).toBe('on');
		expect(button.element().hasAttribute('data-pressed')).toBe(true);
	});

	it('does not toggle or trigger onPressedChange when disabled and clicked', async () => {
		const onPressedChange = vi.fn();
		render(Toggle, { children: label, disabled: true, onPressedChange });

		const button = page.getByRole('button', { name: 'Bold' });
		await expect.element(button).toBeDisabled();
		(button.element() as HTMLButtonElement).click();

		expect(onPressedChange).not.toHaveBeenCalled();
		await expect.element(button).toHaveAttribute('aria-pressed', 'false');
	});

	it('prevents toggling when onclick calls preventDefault', async () => {
		const onPressedChange = vi.fn();
		render(ToggleSemiHeadlessHarness, { testPreventDefault: true, onPressedChange });

		const button = page.getByRole('button', { name: 'Prevent Default' });
		await button.click();

		await expect.element(button).toHaveAttribute('aria-pressed', 'false');
		expect(onPressedChange).not.toHaveBeenCalled();
	});

	it('binds DOM element ref to the underlying button', async () => {
		render(ToggleSemiHeadlessHarness, { bindRef: true });

		await expect.element(page.getByTestId('ref-status')).toHaveTextContent('bound');
	});

	it('provides pressed and disabled payload to children snippet', async () => {
		render(ToggleSemiHeadlessHarness, { testSnippetPayload: true, defaultPressed: true });

		await expect.element(page.getByTestId('payload-pressed')).toHaveTextContent('Pressed');
		await expect.element(page.getByTestId('payload-disabled')).toHaveTextContent('Enabled');
	});

	it('renders via child snippet pattern forwarding props and state', async () => {
		const onPressedChange = vi.fn();
		render(ToggleSemiHeadlessHarness, { testChild: true, onPressedChange });

		const customToggle = page.getByTestId('custom-toggle');
		await expect.element(customToggle).toBeInTheDocument();
		await expect.element(customToggle).toHaveAttribute('data-slot', 'toggle');
		await expect.element(customToggle).toHaveAttribute('data-state', 'off');

		await customToggle.click();
		expect(onPressedChange).toHaveBeenCalledWith(true);
		await expect.element(customToggle).toHaveAttribute('data-state', 'on');
		await expect.element(customToggle).toHaveAttribute('data-custom-pressed', 'true');
	});

	it('forwards unrecognized attributes', async () => {
		render(Toggle, { children: label, id: 'bold-toggle' });

		await expect
			.element(page.getByRole('button', { name: 'Bold' }))
			.toHaveAttribute('id', 'bold-toggle');
	});
});
