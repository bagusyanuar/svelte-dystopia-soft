import { page, userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Textarea from './Textarea.svelte';
import BindingHarness from './BindingHarness.spec.svelte';

describe('Textarea.svelte', () => {
	it('renders a textarea with the given placeholder', async () => {
		render(Textarea, { placeholder: 'Bio' });

		await expect.element(page.getByPlaceholder('Bio')).toBeInTheDocument();
	});

	it('updates value as the user types', async () => {
		render(Textarea, { placeholder: 'Bio' });

		const textarea = page.getByPlaceholder('Bio');
		await textarea.fill('Hello there');

		await expect.element(textarea).toHaveValue('Hello there');
	});

	it('is disabled when the disabled prop is set', async () => {
		render(Textarea, { placeholder: 'Bio', disabled: true });

		await expect.element(page.getByPlaceholder('Bio')).toBeDisabled();
	});

	it('marks the textarea as invalid', async () => {
		render(Textarea, { placeholder: 'Bio', invalid: true });

		await expect.element(page.getByPlaceholder('Bio')).toHaveAttribute('aria-invalid', 'true');
	});

	it('renders no counter when maxlength is not set', async () => {
		render(Textarea, { placeholder: 'Bio' });

		const root = page.getByPlaceholder('Bio').element().closest('div');

		expect(root?.textContent?.trim()).toBe('');
	});

	it('shows a 0/max counter before anything is typed', async () => {
		render(Textarea, { placeholder: 'Bio', maxlength: 100 });

		await expect.element(page.getByText('0/100')).toBeInTheDocument();
	});

	it('propagates typed value back to the consumer and updates the counter', async () => {
		render(BindingHarness);

		await userEvent.type(page.getByPlaceholder('Bio').element(), 'hello');

		await expect.element(page.getByTestId('outer-value')).toHaveTextContent('hello');
		await expect.element(page.getByText('5/10')).toBeInTheDocument();
	});

	it('stops accepting keystrokes once maxlength is reached', async () => {
		render(Textarea, { placeholder: 'Bio', maxlength: 5 });

		const textarea = page.getByPlaceholder('Bio');
		await userEvent.type(textarea.element(), '1234567890');

		await expect.element(textarea).toHaveValue('12345');
		await expect.element(page.getByText('5/5')).toBeInTheDocument();
	});

	it('grows with content and drops manual drag-resize when autoResize is set', async () => {
		render(Textarea, { placeholder: 'Bio', autoResize: true });

		const textarea = page.getByPlaceholder('Bio').element();

		expect(textarea.className).toContain('field-sizing-content');
		expect(textarea.className).toContain('resize-none');
		expect(textarea.className).not.toContain('resize-y');
	});

	it('lets a consumer class override an internal one', async () => {
		render(Textarea, { placeholder: 'Bio', class: 'w-96' });

		const root = page.getByPlaceholder('Bio').element().closest('div');

		expect(root?.className).toContain('w-96');
	});

	it('forwards unrecognized attributes', async () => {
		render(Textarea, { placeholder: 'Bio', rows: 6 });

		await expect.element(page.getByPlaceholder('Bio')).toHaveAttribute('rows', '6');
	});
});
