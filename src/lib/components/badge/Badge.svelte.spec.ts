import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Badge from './Badge.svelte';
import BadgeHarness from './BadgeHarness.spec.svelte';

const text = createRawSnippet(() => ({
	render: () => `<span>New</span>`
}));

describe('Badge.svelte', () => {
	it('renders its children', async () => {
		render(Badge, { children: text });

		await expect.element(page.getByText('New')).toBeInTheDocument();
	});

	it('lets a consumer class override an internal one', async () => {
		render(Badge, { children: text, class: 'rounded-full' });

		const el = page.getByText('New').element().parentElement;

		expect(el?.className).toContain('rounded-full');
		expect(el?.className).not.toContain('rounded-md');
	});

	it('forwards unrecognized attributes', async () => {
		render(Badge, { children: text, id: 'status-badge' });

		const el = page.getByText('New').element().parentElement;

		expect(el?.id).toBe('status-badge');
	});

	// --- Semi-headless capability tests ---

	it('exposes data-variant and data-size attributes on root element', async () => {
		render(Badge, {
			children: text,
			variant: 'success',
			size: 'sm',
			'data-testid': 'badge-el'
		});

		const el = page.getByTestId('badge-el');
		await expect.element(el).toHaveAttribute('data-variant', 'success');
		await expect.element(el).toHaveAttribute('data-size', 'sm');
	});

	it('binds DOM ref via bindable prop', async () => {
		render(BadgeHarness, { variant: 'info' });

		await expect.element(page.getByTestId('has-badge-ref')).toHaveTextContent('yes');
	});

	it('passes variant payload to children snippet', async () => {
		render(BadgeHarness, { variant: 'warning' });

		await expect.element(page.getByTestId('variant-in-child')).toHaveTextContent('warning');
	});

	it('supports all semantic status variants', async () => {
		const variants = [
			'default',
			'secondary',
			'outline',
			'danger',
			'success',
			'warning',
			'info'
		] as const;

		for (const v of variants) {
			render(Badge, { variant: v, children: text, 'data-testid': `badge-${v}` });
			await expect.element(page.getByTestId(`badge-${v}`)).toHaveAttribute('data-variant', v);
		}
	});

	it('supports size density variants', async () => {
		render(Badge, { size: 'sm', children: text, 'data-testid': 'badge-sm' });
		render(Badge, { size: 'lg', children: text, 'data-testid': 'badge-lg' });

		const sm = page.getByTestId('badge-sm').element();
		const lg = page.getByTestId('badge-lg').element();

		expect(sm.className).toContain('text-[11px]');
		expect(lg.className).toContain('text-sm');
	});
});
