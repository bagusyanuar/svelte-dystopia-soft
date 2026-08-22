<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Alert from './Alert.svelte';

	const { Story } = defineMeta({
		title: 'Components/Alert',
		component: Alert,
		tags: ['autodocs']
	});
</script>

<Story name="Default" asChild>
	<div class="w-96">
		<Alert>
			{#snippet title()}
				Heads up
			{/snippet}
			{#snippet description()}
				You can add components to your app using the CLI.
			{/snippet}
		</Alert>
	</div>
</Story>

<Story name="Danger" asChild>
	<div class="w-96">
		<Alert variant="danger">
			{#snippet title()}
				Payment failed
			{/snippet}
			{#snippet description()}
				Your card was declined. Try another payment method.
			{/snippet}
		</Alert>
	</div>
</Story>

<Story name="Warning" asChild>
	<div class="w-96">
		<Alert variant="warning">
			{#snippet title()}
				Storage almost full
			{/snippet}
			{#snippet description()}
				You've used 90% of your available storage.
			{/snippet}
		</Alert>
	</div>
</Story>

<Story name="Success" asChild>
	<div class="w-96">
		<Alert variant="success">
			{#snippet title()}
				Changes saved
			{/snippet}
			{#snippet description()}
				Your changes have been published successfully.
			{/snippet}
		</Alert>
	</div>
</Story>

<Story name="With an icon" asChild>
	<div class="w-96 space-y-4">
		<Alert>
			{#snippet icon()}
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="size-5"
				>
					<circle cx="12" cy="12" r="10" />
					<path d="M12 16v-4" />
					<path d="M12 8h.01" />
				</svg>
			{/snippet}
			{#snippet title()}
				Heads up
			{/snippet}
			{#snippet description()}
				You can add components to your app using the CLI.
			{/snippet}
		</Alert>
		<Alert variant="danger">
			{#snippet icon()}
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="size-5"
				>
					<circle cx="12" cy="12" r="10" />
					<path d="M12 8v4" />
					<path d="M12 16h.01" />
				</svg>
			{/snippet}
			{#snippet title()}
				Payment failed
			{/snippet}
			{#snippet description()}
				Your card was declined. Try another payment method.
			{/snippet}
		</Alert>
	</div>
</Story>

<Story name="Title only" asChild>
	<div class="w-96">
		<Alert>
			{#snippet title()}
				Changes saved
			{/snippet}
		</Alert>
	</div>
</Story>

<Story name="With an action" asChild>
	<div class="w-96">
		<Alert variant="danger">
			{#snippet title()}
				Payment failed
			{/snippet}
			{#snippet description()}
				Your card was declined.
			{/snippet}
			<button
				type="button"
				class="mt-2 inline-flex h-8 cursor-pointer items-center rounded-lg border border-border px-3 text-sm font-medium text-foreground-soft transition-colors duration-150 hover:bg-surface-subtle"
			>
				Retry payment
			</button>
		</Alert>
	</div>
</Story>

<Story name="Custom styling" asChild>
	<div class="w-96">
		<Alert
			class="border-transparent bg-primary text-primary-foreground"
			classes={{ title: 'text-primary-foreground', description: 'text-primary-foreground/90' }}
		>
			{#snippet title()}
				Accent-styled alert
			{/snippet}
			{#snippet description()}
				Styled via the class and classes props — overriding the background means the title and
				description colors need to follow, since they don't inherit it automatically.
			{/snippet}
		</Alert>
	</div>
</Story>
