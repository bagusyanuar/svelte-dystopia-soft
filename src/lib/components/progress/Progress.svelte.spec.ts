import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Progress from './Progress.svelte';
import ProgressSemiHeadlessHarness from './ProgressSemiHeadlessHarness.spec.svelte';

describe('Progress.svelte', () => {
	it('exposes value via the progressbar role and ARIA attributes', async () => {
		render(Progress, { value: 40, 'aria-label': 'Upload progress' });

		const el = page.getByRole('progressbar').element();

		expect(el.getAttribute('aria-valuenow')).toBe('40');
		expect(el.getAttribute('aria-valuemin')).toBe('0');
		expect(el.getAttribute('aria-valuemax')).toBe('100');
	});

	it('defaults to a value of 0', async () => {
		render(Progress, { 'aria-label': 'Upload progress' });

		await expect.element(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
	});

	it('scales aria-valuemax to a custom max', async () => {
		render(Progress, { value: 3, max: 5, 'aria-label': 'Steps' });

		await expect.element(page.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '5');
	});

	it('sets the fill width proportional to value/max', async () => {
		render(Progress, { value: 3, max: 5, 'aria-label': 'Steps' });

		const fill = page.getByRole('progressbar').element().firstElementChild as HTMLElement;

		expect(fill.style.width).toBe('60%');
	});

	it('clamps the fill width to 100% when value exceeds max', async () => {
		render(Progress, { value: 150, 'aria-label': 'Upload progress' });

		const fill = page.getByRole('progressbar').element().firstElementChild as HTMLElement;

		expect(fill.style.width).toBe('100%');
	});

	it('omits aria-valuenow and sets a sweeping fill when indeterminate', async () => {
		render(Progress, { indeterminate: true, 'aria-label': 'Loading' });

		const el = page.getByRole('progressbar').element();
		expect(el.hasAttribute('aria-valuenow')).toBe(false);

		const fill = el.firstElementChild as HTMLElement;
		expect(fill.className).toContain('animate-progress-indeterminate');
		expect(fill.style.width).toBe('');
	});

	it('lets a consumer class override an internal one', async () => {
		render(Progress, { 'aria-label': 'Upload progress', class: 'h-4' });

		const el = page.getByRole('progressbar').element();

		expect(el.className).toContain('h-4');
		expect(el.className).not.toContain('h-2');
	});

	it('forwards unrecognized attributes', async () => {
		render(Progress, { 'aria-label': 'Upload progress', id: 'upload-progress' });

		await expect.element(page.getByRole('progressbar')).toHaveAttribute('id', 'upload-progress');
	});

	it('exposes data-slot and data-state attributes for loading, complete, and indeterminate', async () => {
		render(Progress, { value: 50, max: 100, 'aria-label': 'Progress bar' });

		const root = page.getByRole('progressbar').element();
		const fill = root.querySelector('[data-slot="progress-fill"]') as HTMLElement;

		expect(root.getAttribute('data-slot')).toBe('progress');
		expect(root.getAttribute('data-state')).toBe('loading');
		expect(root.getAttribute('data-value')).toBe('50');
		expect(root.getAttribute('data-max')).toBe('100');
		expect(root.hasAttribute('data-indeterminate')).toBe(false);

		expect(fill).not.toBeNull();
		expect(fill.getAttribute('data-slot')).toBe('progress-fill');
		expect(fill.getAttribute('data-state')).toBe('loading');
	});

	it('sets data-state="complete" when value reaches max', async () => {
		render(Progress, { value: 100, max: 100, 'aria-label': 'Complete progress' });

		const root = page.getByRole('progressbar').element();
		const fill = root.querySelector('[data-slot="progress-fill"]') as HTMLElement;

		expect(root.getAttribute('data-state')).toBe('complete');
		expect(fill.getAttribute('data-state')).toBe('complete');
	});

	it('sets data-state="indeterminate" and data-indeterminate attribute when indeterminate', async () => {
		render(Progress, { indeterminate: true, 'aria-label': 'Indeterminate progress' });

		const root = page.getByRole('progressbar').element();
		const fill = root.querySelector('[data-slot="progress-fill"]') as HTMLElement;

		expect(root.getAttribute('data-state')).toBe('indeterminate');
		expect(root.hasAttribute('data-indeterminate')).toBe(true);
		expect(root.hasAttribute('data-value')).toBe(false);
		expect(fill.getAttribute('data-state')).toBe('indeterminate');
	});

	it('exposes ref and fillRef bound to respective elements', async () => {
		render(ProgressSemiHeadlessHarness, {
			value: 45
		});

		const status = page.getByTestId('ref-status');
		await expect.element(status).toHaveAttribute('data-has-root', 'true');
		await expect.element(status).toHaveAttribute('data-has-fill', 'true');
	});

	it('supports classes.root and classes.fill/indicator sub-part styling', async () => {
		render(Progress, {
			'aria-label': 'Styled progress',
			value: 70,
			class: 'custom-progress-root',
			classes: {
				root: 'border-2 border-primary',
				fill: 'bg-emerald-500',
				indicator: 'shadow-sm'
			}
		});

		const root = page.getByRole('progressbar').element();
		const fill = root.querySelector('[data-slot="progress-fill"]') as HTMLElement;

		expect(root.className).toContain('custom-progress-root');
		expect(root.className).toContain('border-2');
		expect(root.className).toContain('border-primary');

		expect(fill.className).toContain('bg-emerald-500');
		expect(fill.className).toContain('shadow-sm');
	});

	it('renders custom indicator snippet with payload', async () => {
		render(ProgressSemiHeadlessHarness, {
			'aria-label': 'Custom indicator',
			value: 75,
			max: 100,
			customIndicator: true
		});

		const indicator = page.getByTestId('custom-indicator');
		await expect.element(indicator).toBeInTheDocument();
		await expect.element(indicator).toHaveTextContent('Custom Indicator: 75%');
		await expect.element(indicator).toHaveAttribute('data-pct', '75');
		await expect.element(indicator).toHaveAttribute('data-val', '75');
		await expect.element(indicator).toHaveAttribute('data-max', '100');
	});

	it('renders children snippet with payload alongside indicator', async () => {
		render(ProgressSemiHeadlessHarness, {
			'aria-label': 'Custom children',
			value: 60,
			customChildren: true
		});

		const childrenEl = page.getByTestId('custom-children');
		await expect.element(childrenEl).toBeInTheDocument();
		await expect.element(childrenEl).toHaveTextContent('Progress: 60%');
	});

	it('supports animated prop to initialize fill on mount with data-animated attribute', async () => {
		render(Progress, { value: 80, animated: true, 'aria-label': 'Animated test' });

		const root = page.getByRole('progressbar');
		await expect.element(root).toHaveAttribute('data-animated', '');
	});
});
