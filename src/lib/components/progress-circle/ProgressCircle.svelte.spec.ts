import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ProgressCircle from './ProgressCircle.svelte';
import ProgressCircleSemiHeadlessHarness from './ProgressCircleSemiHeadlessHarness.spec.svelte';

describe('ProgressCircle.svelte', () => {
	it('exposes value via the progressbar role and ARIA attributes', async () => {
		render(ProgressCircle, { value: 40, 'aria-label': 'Loading ring' });

		const el = page.getByRole('progressbar').element();

		expect(el.getAttribute('aria-valuenow')).toBe('40');
		expect(el.getAttribute('aria-valuemin')).toBe('0');
		expect(el.getAttribute('aria-valuemax')).toBe('100');
	});

	it('defaults to a value of 0', async () => {
		render(ProgressCircle, { 'aria-label': 'Ring progress' });

		await expect.element(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
	});

	it('scales aria-valuemax to a custom max', async () => {
		render(ProgressCircle, { value: 3, max: 5, 'aria-label': 'Steps' });

		await expect.element(page.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '5');
	});

	it('calculates stroke-dashoffset proportional to value/max', async () => {
		render(ProgressCircle, { value: 50, max: 100, size: 'md', 'aria-label': 'Steps' });

		const indicator = page
			.getByRole('progressbar')
			.element()
			.querySelector('[data-slot="progress-circle-indicator"]') as SVGCircleElement;
		const dasharray = parseFloat(indicator.getAttribute('stroke-dasharray') || '0');
		const dashoffset = parseFloat(indicator.getAttribute('stroke-dashoffset') || '0');

		// At 50%, dashoffset should be approximately half of dasharray
		expect(dashoffset).toBeCloseTo(dasharray * 0.5, 1);
	});

	it('clamps stroke-dashoffset to 100% when value exceeds max', async () => {
		render(ProgressCircle, { value: 150, max: 100, 'aria-label': 'Steps' });

		const indicator = page
			.getByRole('progressbar')
			.element()
			.querySelector('[data-slot="progress-circle-indicator"]') as SVGCircleElement;
		const dashoffset = parseFloat(indicator.getAttribute('stroke-dashoffset') || '0');

		// At >= 100%, offset should be 0 (fully drawn)
		expect(dashoffset).toBe(0);
	});

	it('omits aria-valuenow and sets spinning animation when indeterminate', async () => {
		render(ProgressCircle, { indeterminate: true, 'aria-label': 'Indeterminate ring' });

		const root = page.getByRole('progressbar').element();
		expect(root.hasAttribute('aria-valuenow')).toBe(false);

		const svg = root.querySelector('svg') as SVGSVGElement;
		expect(svg.className.baseVal).toContain('animate-spin');
	});

	it('exposes data-slot and data-state attributes for loading, complete, and indeterminate', async () => {
		render(ProgressCircle, { value: 50, max: 100, 'aria-label': 'Ring progress' });

		const root = page.getByRole('progressbar').element();
		const track = root.querySelector('[data-slot="progress-circle-track"]');
		const indicator = root.querySelector('[data-slot="progress-circle-indicator"]');

		expect(root.getAttribute('data-slot')).toBe('progress-circle');
		expect(root.getAttribute('data-state')).toBe('loading');
		expect(root.getAttribute('data-value')).toBe('50');
		expect(root.getAttribute('data-max')).toBe('100');

		expect(track).not.toBeNull();
		expect(indicator).not.toBeNull();
		expect(indicator?.getAttribute('data-state')).toBe('loading');
	});

	it('sets data-state="complete" when value reaches max', async () => {
		render(ProgressCircle, { value: 100, max: 100, 'aria-label': 'Complete ring' });

		const root = page.getByRole('progressbar').element();
		expect(root.getAttribute('data-state')).toBe('complete');
	});

	it('sets data-state="indeterminate" and data-indeterminate attribute when indeterminate', async () => {
		render(ProgressCircle, { indeterminate: true, 'aria-label': 'Indeterminate ring' });

		const root = page.getByRole('progressbar').element();
		expect(root.getAttribute('data-state')).toBe('indeterminate');
		expect(root.hasAttribute('data-indeterminate')).toBe(true);
		expect(root.hasAttribute('data-value')).toBe(false);
	});

	it('exposes ref, svgRef, trackRef, and indicatorRef bound to respective elements', async () => {
		render(ProgressCircleSemiHeadlessHarness, {
			value: 45
		});

		const status = page.getByTestId('ref-status');
		await expect.element(status).toHaveAttribute('data-has-root', 'true');
		await expect.element(status).toHaveAttribute('data-has-svg', 'true');
		await expect.element(status).toHaveAttribute('data-has-track', 'true');
		await expect.element(status).toHaveAttribute('data-has-indicator', 'true');
	});

	it('supports custom size as a number and custom strokeWidth', async () => {
		render(ProgressCircle, {
			value: 60,
			size: 96,
			strokeWidth: 8,
			'aria-label': 'Large ring'
		});

		const root = page.getByRole('progressbar').element();
		expect(root.style.width).toBe('96px');
		expect(root.style.height).toBe('96px');

		const track = root.querySelector('[data-slot="progress-circle-track"]') as SVGCircleElement;
		expect(track.getAttribute('stroke-width')).toBe('8');
	});

	it('supports sub-parts styling via classes prop', async () => {
		render(ProgressCircle, {
			value: 70,
			'aria-label': 'Styled ring',
			class: 'custom-root-class',
			classes: {
				root: 'p-1',
				svg: 'opacity-90',
				track: 'stroke-emerald-100',
				indicator: 'stroke-emerald-600',
				content: 'text-emerald-700'
			}
		});

		const root = page.getByRole('progressbar').element();
		const svg = root.querySelector('svg') as SVGSVGElement;
		const track = root.querySelector('[data-slot="progress-circle-track"]') as SVGCircleElement;
		const indicator = root.querySelector(
			'[data-slot="progress-circle-indicator"]'
		) as SVGCircleElement;

		expect(root.className).toContain('custom-root-class');
		expect(root.className).toContain('p-1');
		expect(svg.className.baseVal).toContain('opacity-90');
		expect(track.className.baseVal).toContain('stroke-emerald-100');
		expect(indicator.className.baseVal).toContain('stroke-emerald-600');
	});

	it('renders children snippet in center with payload', async () => {
		render(ProgressCircleSemiHeadlessHarness, {
			value: 75,
			customChildren: true
		});

		const centerText = page.getByTestId('custom-center-text');
		await expect.element(centerText).toBeInTheDocument();
		await expect.element(centerText).toHaveTextContent('75%');
	});

	it('forwards unrecognized attributes to root element', async () => {
		render(ProgressCircle, {
			'aria-label': 'Ring progress',
			id: 'custom-circle-id',
			title: 'Custom Circle Title'
		});

		const root = page.getByRole('progressbar');
		await expect.element(root).toHaveAttribute('id', 'custom-circle-id');
		await expect.element(root).toHaveAttribute('title', 'Custom Circle Title');
	});

	it('supports animated prop to initialize ring on mount with data-animated attribute', async () => {
		render(ProgressCircle, { value: 80, animated: true, 'aria-label': 'Animated test' });

		const root = page.getByRole('progressbar');
		await expect.element(root).toHaveAttribute('data-animated', '');
	});
});
