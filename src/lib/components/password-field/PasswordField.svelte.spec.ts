import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import PasswordField from './PasswordField.svelte';
import BindingHarness from './BindingHarness.spec.svelte';

describe('PasswordField.svelte', () => {
	it('masks the value by default', async () => {
		render(PasswordField, { placeholder: 'Password' });

		await expect.element(page.getByPlaceholder('Password')).toHaveAttribute('type', 'password');
		await expect.element(page.getByRole('button', { name: 'Show password' })).toBeInTheDocument();
	});

	it('reveals the value when the toggle is clicked', async () => {
		render(PasswordField, { placeholder: 'Password' });

		await page.getByRole('button', { name: 'Show password' }).click();

		await expect.element(page.getByPlaceholder('Password')).toHaveAttribute('type', 'text');
		await expect.element(page.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();
	});

	it('hides the value again on a second click', async () => {
		render(PasswordField, { placeholder: 'Password' });

		await page.getByRole('button', { name: 'Show password' }).click();
		await page.getByRole('button', { name: 'Hide password' }).click();

		await expect.element(page.getByPlaceholder('Password')).toHaveAttribute('type', 'password');
	});

	it('keeps the typed value across a toggle', async () => {
		render(PasswordField, { placeholder: 'Password' });

		const input = page.getByPlaceholder('Password');
		await input.fill('hunter2');
		await page.getByRole('button', { name: 'Show password' }).click();

		await expect.element(input).toHaveValue('hunter2');
	});

	it('uses custom toggle labels', async () => {
		render(PasswordField, {
			placeholder: 'Kata sandi',
			labels: { show: 'Tampilkan kata sandi', hide: 'Sembunyikan kata sandi' }
		});

		await page.getByRole('button', { name: 'Tampilkan kata sandi' }).click();

		await expect
			.element(page.getByRole('button', { name: 'Sembunyikan kata sandi' }))
			.toBeInTheDocument();
	});

	it('does not submit the surrounding form when toggled', async () => {
		render(PasswordField, { placeholder: 'Password' });

		await expect
			.element(page.getByRole('button', { name: 'Show password' }))
			.toHaveAttribute('type', 'button');
	});

	it('disables the toggle along with the field', async () => {
		render(PasswordField, { placeholder: 'Password', disabled: true });

		await expect.element(page.getByRole('button', { name: 'Show password' })).toBeDisabled();
	});

	it('propagates bind:value out to the consumer', async () => {
		render(BindingHarness);

		await page.getByPlaceholder('Password').fill('hunter2');

		await expect.element(page.getByTestId('outer-value')).toHaveTextContent('hunter2');
	});

	it('propagates bind:visible out to the consumer', async () => {
		render(BindingHarness);

		await page.getByRole('button', { name: 'Show password' }).click();

		await expect.element(page.getByTestId('outer-visible')).toHaveTextContent('true');
	});
});
