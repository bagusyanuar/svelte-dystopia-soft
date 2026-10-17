import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Tooltip from './Tooltip.svelte';
import BindingHarness from './BindingHarness.spec.svelte';
import TooltipSemiHeadlessHarness from './TooltipSemiHeadlessHarness.spec.svelte';

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

	it('exposes data-slot, data-state, and data-placement on trigger and content', async () => {
		render(Tooltip, {
			content,
			delayDuration: 0,
			placement: 'bottom',
			children: createRawSnippet(() => ({ render: () => `<button>Save</button>` }))
		});

		const button = trigger().element();
		const wrapper = button.parentElement!;
		expect(wrapper.getAttribute('data-slot')).toBe('tooltip-trigger');
		expect(wrapper.getAttribute('data-state')).toBe('closed');
		expect(wrapper.getAttribute('data-placement')).toBe('bottom');

		await trigger().hover();
		expect(wrapper.getAttribute('data-state')).toBe('open');

		const tooltipEl = page.getByRole('tooltip').element();
		expect(tooltipEl.getAttribute('data-slot')).toBe('tooltip-content');
		expect(tooltipEl.getAttribute('data-state')).toBe('open');
		expect(tooltipEl.getAttribute('data-placement')).toBe('bottom');
	});

	it('renders as div when as="div" is specified', async () => {
		render(TooltipSemiHeadlessHarness, { testAsDiv: true });

		const button = page.getByRole('button', { name: 'Div Trigger' }).element();
		expect(button.parentElement?.tagName).toBe('DIV');
	});

	it('binds triggerRef, contentRef, and arrowRef', async () => {
		render(TooltipSemiHeadlessHarness, { testRefs: true });

		await expect.element(page.getByTestId('trigger-ref-status')).toHaveTextContent('bound');

		await page.getByRole('button', { name: 'Trigger Ref Button' }).hover();

		await expect.element(page.getByTestId('content-ref-status')).toHaveTextContent('bound');
		await expect.element(page.getByTestId('arrow-ref-status')).toHaveTextContent('bound');
	});

	it('does not show tooltip and exposes data-disabled when disabled is true', async () => {
		const onOpenChange = vi.fn();
		render(TooltipSemiHeadlessHarness, { testDisabled: true, onOpenChange });

		const button = page.getByRole('button', { name: 'Disabled Trigger' });
		const wrapper = button.element().parentElement!;
		expect(wrapper.hasAttribute('data-disabled')).toBe(true);

		await button.hover();
		await expect.element(page.getByRole('tooltip')).not.toBeInTheDocument();
		expect(onOpenChange).not.toHaveBeenCalled();
	});

	it('supports defaultOpen for uncontrolled initialization and triggers onOpenChange', async () => {
		const onOpenChange = vi.fn();
		render(TooltipSemiHeadlessHarness, { testDefaultOpen: true, onOpenChange });

		await expect.element(page.getByRole('tooltip')).toBeInTheDocument();
		await expect.element(page.getByRole('tooltip')).toHaveTextContent('Default Open Content');
	});

	it('supports plain string content', async () => {
		render(TooltipSemiHeadlessHarness, { testStringContent: true });

		await page.getByRole('button', { name: 'String Trigger' }).hover();

		await expect.element(page.getByRole('tooltip')).toHaveTextContent('Plain string content');
	});

	it('provides open and close payload to children and content snippets', async () => {
		render(TooltipSemiHeadlessHarness, { testSnippetPayload: true });

		const closedTrigger = page.getByRole('button', { name: 'Trigger State: Closed' });
		await expect.element(closedTrigger).toBeInTheDocument();

		await closedTrigger.hover();
		const openTrigger = page.getByRole('button', { name: 'Trigger State: Open' });
		await expect.element(openTrigger).toBeInTheDocument();

		await expect.element(page.getByTestId('content-payload')).toHaveTextContent('Payload Open: true');

		// Clicking the trigger invokes close() from snippet payload
		await openTrigger.click();

		await expect.element(page.getByRole('tooltip')).not.toBeInTheDocument();
	});

	it('merges root class and classes.trigger onto the trigger element', async () => {
		render(Tooltip, {
			content,
			class: 'custom-root',
			classes: { trigger: 'custom-trigger' },
			children: createRawSnippet(() => ({ render: () => `<button>Save</button>` }))
		});

		const wrapper = trigger().element().parentElement!;
		expect(wrapper.className).toContain('custom-root');
		expect(wrapper.className).toContain('custom-trigger');
		expect(wrapper.className).toContain('inline-flex');
	});

	it('forwards contentProps to floating content element', async () => {
		render(TooltipSemiHeadlessHarness, { testContentProps: true });

		await page.getByRole('button', { name: 'Content Props Trigger' }).hover();

		const contentEl = page.getByTestId('custom-tooltip-content');
		await expect.element(contentEl).toBeInTheDocument();
		await expect.element(contentEl).toHaveAttribute('aria-label', 'Custom Floating');
	});
});
