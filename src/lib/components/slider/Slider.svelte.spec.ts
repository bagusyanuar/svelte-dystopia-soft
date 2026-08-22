import { page, userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Slider from './Slider.svelte';
import BindingHarness from './BindingHarness.spec.svelte';

describe('Slider.svelte', () => {
	it('renders a slider with the given bounds', async () => {
		render(Slider, { 'aria-label': 'Volume', min: 0, max: 100, value: 20 });

		const slider = page.getByRole('slider');
		await expect.element(slider).toHaveAttribute('min', '0');
		await expect.element(slider).toHaveAttribute('max', '100');
		await expect.element(slider).toHaveValue('20');
	});

	it('defaults to a value of 0', async () => {
		render(Slider, { 'aria-label': 'Volume' });

		await expect.element(page.getByRole('slider')).toHaveValue('0');
	});

	it('moves on arrow key presses', async () => {
		render(Slider, { 'aria-label': 'Volume', min: 0, max: 100, value: 20, step: 5 });

		const slider = page.getByRole('slider');
		slider.element().focus();
		await userEvent.keyboard('{ArrowRight}');

		await expect.element(slider).toHaveValue('25');
	});

	it('propagates the value back to the consumer', async () => {
		render(BindingHarness);

		const slider = page.getByRole('slider');
		slider.element().focus();
		await userEvent.keyboard('{ArrowRight}');

		await expect.element(page.getByTestId('outer-value')).toHaveTextContent('21');
	});

	it('sets --slider-fill from value/min/max for the filled-track gradient', async () => {
		render(Slider, { 'aria-label': 'Volume', min: 0, max: 200, value: 50 });

		const el = page.getByRole('slider').element() as HTMLElement;
		expect(el.style.getPropertyValue('--slider-fill')).toBe('25%');
	});

	it('recomputes --slider-fill as the value changes', async () => {
		render(Slider, { 'aria-label': 'Volume', min: 0, max: 100, value: 20, step: 5 });

		const slider = page.getByRole('slider');
		slider.element().focus();
		await userEvent.keyboard('{ArrowRight}');

		const el = slider.element() as HTMLElement;
		expect(el.style.getPropertyValue('--slider-fill')).toBe('25%');
	});

	it('keeps a visible focus indicator on the input itself', async () => {
		render(Slider, { 'aria-label': 'Volume' });

		const el = page.getByRole('slider').element();

		expect(el.className).toContain('focus-visible:outline-2');
		expect(el.className).not.toContain('focus-visible:outline-none');
	});

	it('is disabled when the disabled prop is set', async () => {
		render(Slider, { 'aria-label': 'Volume', disabled: true });

		await expect.element(page.getByRole('slider')).toBeDisabled();
	});

	it('lets a consumer class override an internal one', async () => {
		render(Slider, { 'aria-label': 'Volume', class: 'w-32' });

		const el = page.getByRole('slider').element();

		expect(el.className).toContain('w-32');
		expect(el.className).not.toContain('w-full');
	});

	it('forwards unrecognized attributes', async () => {
		render(Slider, { 'aria-label': 'Volume', name: 'volume' });

		await expect.element(page.getByRole('slider')).toHaveAttribute('name', 'volume');
	});
});
