import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import TextField from './TextField.svelte';
import TextFieldSemiHeadlessHarness from './TextFieldSemiHeadlessHarness.spec.svelte';

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

	it('exposes ref, inputRef, and containerRef bound to respective HTML elements', async () => {
		render(TextFieldSemiHeadlessHarness);

		const status = page.getByTestId('ref-status');
		await expect.element(status).toHaveAttribute('data-has-root', 'true');
		await expect.element(status).toHaveAttribute('data-has-input', 'true');
		await expect.element(status).toHaveAttribute('data-has-container', 'true');
	});

	it('exposes data-slot and data-has-value attributes', async () => {
		render(TextField, {
			value: 'Hello',
			placeholder: 'Greeting'
		});

		const container = document.querySelector('[data-slot="text-field"]');
		const input = document.querySelector('[data-slot="text-field-input"]');

		expect(container).toBeTruthy();
		expect(input).toBeTruthy();
		expect(container?.hasAttribute('data-has-value')).toBe(true);
	});

	it('applies custom sub-part classes via classes prop', async () => {
		render(TextFieldSemiHeadlessHarness, {
			classes: {
				container: 'custom-container-class',
				input: 'custom-input-class'
			}
		});

		const container = document.querySelector('[data-slot="text-field"]');
		const input = document.querySelector('[data-slot="text-field-input"]');

		expect(container?.className).toContain('custom-container-class');
		expect(input?.className).toContain('custom-input-class');
	});

	it('forwards value payload to prefix and suffix snippets dynamically', async () => {
		render(TextFieldSemiHeadlessHarness);

		const prefix = page.getByTestId('test-prefix');
		const suffix = page.getByTestId('test-suffix');

		await expect.element(prefix).toHaveAttribute('data-len', '0');
		await expect.element(suffix).toHaveTextContent('EMPTY');

		const input = page.getByPlaceholder('Type here...');
		await input.fill('test');

		await expect.element(prefix).toHaveAttribute('data-len', '4');
		await expect.element(suffix).toHaveTextContent('LEN:4');
	});

	it('calls onValueChange callback on input', async () => {
		const onValueChange = vi.fn();
		render(TextFieldSemiHeadlessHarness, { onValueChange });

		const input = page.getByPlaceholder('Type here...');
		await input.fill('typed value');

		expect(onValueChange).toHaveBeenCalledWith('typed value');
	});
});
