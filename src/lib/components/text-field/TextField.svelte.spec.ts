import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import TextField from './TextField.svelte';

const icon = (text: string) =>
	createRawSnippet(() => ({
		render: () => `<span>${text}</span>`
	}));

describe('TextField.svelte', () => {
	it('renders an input with the given placeholder', async () => {
		render(TextField, { placeholder: 'Email' });

		await expect.element(page.getByPlaceholder('Email')).toBeInTheDocument();
	});

	it('renders prefix and suffix snippets', async () => {
		render(TextField, { placeholder: 'Search', prefix: icon('@'), suffix: icon('clear') });

		await expect.element(page.getByText('@')).toBeInTheDocument();
		await expect.element(page.getByText('clear')).toBeInTheDocument();
	});

	it('updates value as the user types', async () => {
		render(TextField, { placeholder: 'Email' });

		const input = page.getByPlaceholder('Email');
		await input.fill('hello@example.com');

		await expect.element(input).toHaveValue('hello@example.com');
	});

	it('is disabled when the disabled prop is set', async () => {
		render(TextField, { placeholder: 'Email', disabled: true });

		await expect.element(page.getByPlaceholder('Email')).toBeDisabled();
	});

	it('marks the input as invalid', async () => {
		render(TextField, { placeholder: 'Email', invalid: true });

		await expect.element(page.getByPlaceholder('Email')).toHaveAttribute('aria-invalid', 'true');
	});
});
