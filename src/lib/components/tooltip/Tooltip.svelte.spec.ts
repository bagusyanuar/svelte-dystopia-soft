import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Tooltip from './Tooltip.svelte';
import BindingHarness from './BindingHarness.spec.svelte';

const content = createRawSnippet(() => ({
	render: () => `<span>Saves your changes</span>`
}));

function trigger() {
	return page.getByRole('button', { name: 'Save' });
}

describe('Tooltip.svelte', () => {
	it('renders the trigger content', async () => {
		render(Tooltip, {
			content,
			children: createRawSnippet(() => ({ render: () => `<button>Save</button>` }))
		});

		await expect.element(trigger()).toBeInTheDocument();
	});

	it('is closed by default', async () => {
		render(Tooltip, {
			content,
			children: createRawSnippet(() => ({ render: () => `<button>Save</button>` }))
		});

		await expect.element(page.getByRole('tooltip')).not.toBeInTheDocument();
	});

	it('shows on hover once the delay elapses', async () => {
		render(Tooltip, {
			content,
			delayDuration: 30,
			children: createRawSnippet(() => ({ render: () => `<button>Save</button>` }))
		});

		await trigger().hover();

		await expect.element(page.getByRole('tooltip')).toBeInTheDocument();
		await expect.element(page.getByRole('tooltip')).toHaveTextContent('Saves your changes');
	});

	it('does not show before the hover delay elapses', async () => {
		render(Tooltip, {
			content,
			delayDuration: 10_000,
			children: createRawSnippet(() => ({ render: () => `<button>Save</button>` }))
		});

		await trigger().hover();

		await expect.element(page.getByRole('tooltip')).not.toBeInTheDocument();
	});

	it('shows immediately on focus, without waiting for the hover delay', async () => {
		render(Tooltip, {
			content,
			delayDuration: 10_000,
			children: createRawSnippet(() => ({ render: () => `<button>Save</button>` }))
		});

		await trigger().element().focus();

		await expect.element(page.getByRole('tooltip')).toBeInTheDocument();
	});

	it('hides when the pointer leaves the trigger', async () => {
		render(Tooltip, {
			content,
			delayDuration: 0,
			children: createRawSnippet(() => ({ render: () => `<button>Save</button>` }))
		});

		await trigger().hover();
		await expect.element(page.getByRole('tooltip')).toBeInTheDocument();

		await trigger().unhover();

		await expect.element(page.getByRole('tooltip')).not.toBeInTheDocument();
	});

	it('hides on blur', async () => {
		render(Tooltip, {
			content,
			delayDuration: 0,
			children: createRawSnippet(() => ({ render: () => `<button>Save</button>` }))
		});

		await trigger().element().focus();
		await expect.element(page.getByRole('tooltip')).toBeInTheDocument();

		trigger().element().blur();

		await expect.element(page.getByRole('tooltip')).not.toBeInTheDocument();
	});

	it('hides on Escape while visible', async () => {
		render(Tooltip, {
			content,
			delayDuration: 0,
			children: createRawSnippet(() => ({ render: () => `<button>Save</button>` }))
		});

		await trigger().element().focus();
		await expect.element(page.getByRole('tooltip')).toBeInTheDocument();

		await trigger()
			.element()
			.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

		await expect.element(page.getByRole('tooltip')).not.toBeInTheDocument();
	});

	it('puts aria-describedby on the focusable child, not the wrapping span, so a screen reader announces it on focus', async () => {
		render(Tooltip, {
			content,
			delayDuration: 0,
			children: createRawSnippet(() => ({ render: () => `<button>Save</button>` }))
		});

		const button = trigger().element();
		const describedBy = button.getAttribute('aria-describedby');
		expect(describedBy).toBeTruthy();
		expect(button.parentElement?.hasAttribute('aria-describedby')).toBe(false);

		await trigger().hover();
		await expect.element(page.getByRole('tooltip')).toHaveAttribute('id', describedBy!);
	});

	it('falls back to describing the wrapper itself when the trigger has no focusable descendant', async () => {
		render(Tooltip, {
			content,
			delayDuration: 0,
			children: createRawSnippet(() => ({ render: () => `<span>Draft</span>` }))
		});

		const wrapper = page.getByText('Draft').element().parentElement;
		expect(wrapper?.getAttribute('aria-describedby')).toBeTruthy();
	});

	it('portals the tooltip out of the component container', async () => {
		const { container } = render(Tooltip, {
			content,
			delayDuration: 0,
			children: createRawSnippet(() => ({ render: () => `<button>Save</button>` }))
		});

		await trigger().hover();
		await expect.element(page.getByRole('tooltip')).toBeInTheDocument();

		const tooltipEl = page.getByRole('tooltip').element();
		expect(tooltipEl.parentElement).toBe(document.body);
		expect(container.contains(tooltipEl)).toBe(false);
	});

	it('propagates the open state back to the consumer', async () => {
		render(BindingHarness);

		await trigger().hover();

		await expect.element(page.getByTestId('outer-open')).toHaveTextContent('true');
	});

	it('lets a consumer class override the internal content class', async () => {
		render(Tooltip, {
			content,
			delayDuration: 0,
			classes: { content: 'rounded-lg' },
			children: createRawSnippet(() => ({ render: () => `<button>Save</button>` }))
		});

		await trigger().hover();

		const tooltipEl = page.getByRole('tooltip').element();
		expect(tooltipEl.className).toContain('rounded-lg');
		expect(tooltipEl.className).not.toContain('rounded-md');
	});
});
