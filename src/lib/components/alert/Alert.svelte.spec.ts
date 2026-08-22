import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Alert from './Alert.svelte';

const title = createRawSnippet(() => ({
	render: () => `<span>Payment failed</span>`
}));
const description = createRawSnippet(() => ({
	render: () => `<span>Your card was declined. Try another payment method.</span>`
}));
const icon = createRawSnippet(() => ({
	render: () => `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>`
}));

describe('Alert.svelte', () => {
	it('renders with the alert role', async () => {
		render(Alert, { title, description });

		await expect.element(page.getByRole('alert')).toBeInTheDocument();
	});

	it('renders the title and description', async () => {
		render(Alert, { title, description });

		await expect.element(page.getByText('Payment failed')).toBeInTheDocument();
		await expect
			.element(page.getByText('Your card was declined.', { exact: false }))
			.toBeInTheDocument();
	});

	it('renders nothing for a part that is omitted', async () => {
		const { container } = render(Alert, { title });

		expect(container.querySelectorAll('p').length).toBe(1);
	});

	it('renders custom content via the default children snippet', async () => {
		const children = createRawSnippet(() => ({
			render: () => `<button>Retry</button>`
		}));

		render(Alert, { title, children });

		await expect.element(page.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
	});

	it('hides the icon from assistive tech', async () => {
		const { container } = render(Alert, { title, icon });

		const iconWrapper = container.querySelector('svg')?.parentElement;
		expect(iconWrapper?.getAttribute('aria-hidden')).toBe('true');
	});

	it('applies the danger variant border', async () => {
		render(Alert, { title, variant: 'danger' });

		const alert = page.getByRole('alert').element();
		expect(alert.className).toContain('border-danger-border');
	});

	it('applies the warning variant border', async () => {
		render(Alert, { title, variant: 'warning' });

		const alert = page.getByRole('alert').element();
		expect(alert.className).toContain('border-warning-border');
	});

	it('applies the success variant border', async () => {
		render(Alert, { title, variant: 'success' });

		const alert = page.getByRole('alert').element();
		expect(alert.className).toContain('border-success-border');
	});

	it('applies the default variant border', async () => {
		render(Alert, { title });

		const alert = page.getByRole('alert').element();
		expect(alert.className).toContain('border-border');
	});

	it('lets a consumer class override the internal class', async () => {
		render(Alert, { title, class: 'rounded-md' });

		const alert = page.getByRole('alert').element();
		expect(alert.className).toContain('rounded-md');
		expect(alert.className).not.toContain('rounded-lg');
	});

	it('lets a consumer style the title, description, and icon via classes', async () => {
		render(Alert, {
			title,
			description,
			icon,
			classes: { title: 'title-test', description: 'desc-test', icon: 'icon-test' }
		});

		const alert = page.getByRole('alert').element();
		expect(alert.querySelector('p.title-test')).toBeTruthy();
		expect(alert.querySelector('p.desc-test')).toBeTruthy();
		expect(alert.querySelector('span.icon-test')).toBeTruthy();
	});

	it('forwards unrecognized attributes to the root element', async () => {
		render(Alert, { title, 'data-testid': 'billing-alert' });

		await expect.element(page.getByTestId('billing-alert')).toBeInTheDocument();
	});
});
