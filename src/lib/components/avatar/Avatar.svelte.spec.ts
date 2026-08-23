import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Avatar from './Avatar.svelte';

const initials = createRawSnippet(() => ({
	render: () => '<span>JD</span>'
}));

describe('Avatar.svelte', () => {
	it('renders the fallback when there is no src', async () => {
		render(Avatar, { alt: 'Jane Doe', children: initials });

		await expect.element(page.getByText('JD')).toBeInTheDocument();
		await expect.element(page.getByRole('img')).not.toBeInTheDocument();
	});

	it('renders an image with the given alt text', async () => {
		render(Avatar, { src: '/jane.png', alt: 'Jane Doe', children: initials });

		await expect.element(page.getByRole('img', { name: 'Jane Doe' })).toBeInTheDocument();
	});

	it('shows the fallback until the image finishes loading', async () => {
		render(Avatar, { src: '/jane.png', alt: 'Jane Doe', children: initials });

		const img = page.getByRole('img', { name: 'Jane Doe' }).element();

		expect(img.className).toContain('hidden');
		await expect.element(page.getByText('JD')).toBeInTheDocument();

		img.dispatchEvent(new Event('load'));

		await expect.element(page.getByRole('img', { name: 'Jane Doe' })).not.toHaveClass(/hidden/);
		await expect.element(page.getByText('JD')).not.toBeInTheDocument();
	});

	it('falls back when the image fails to load', async () => {
		render(Avatar, { src: '/broken.png', alt: 'Jane Doe', children: initials });

		const img = page.getByRole('img', { name: 'Jane Doe' }).element();
		img.dispatchEvent(new Event('error'));

		await expect.element(page.getByRole('img')).not.toBeInTheDocument();
		await expect.element(page.getByText('JD')).toBeInTheDocument();
	});

	it('lets a consumer class override an internal one', async () => {
		render(Avatar, { alt: 'Jane Doe', children: initials, class: 'size-16' });

		const root = page.getByText('JD').element().closest('span[class*="rounded-full"]');
		expect(root?.className).toContain('size-16');
	});

	it('forwards unrecognized attributes', async () => {
		render(Avatar, { alt: 'Jane Doe', children: initials, 'data-testid': 'avatar-root' });

		await expect.element(page.getByTestId('avatar-root')).toBeInTheDocument();
	});
});
