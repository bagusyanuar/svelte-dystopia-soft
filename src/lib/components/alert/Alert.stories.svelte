<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Alert from './Alert.svelte';

	const componentDescription = [
		'Komponen alert/banner notifikasi kontekstual dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear). Memiliki integrasi aksesibilitas ARIA, visual tone feedback, serta hierarki props semi-headless yang fleksibel.',
		'',
		'### Fitur Utama',
		'- **4 Varian Semantik**: `default` (informasi netral), `danger` (kesalahan kritis & gagal bayar), `warning` (peringatan batas kuota), dan `success` (konfirmasi berhasil).',
		'- **Struktur Modular Semi-Headless**: Memisahkan bagian konten menjadi snippet opsional: `icon`, `title`, `description`, serta `children` (untuk call-to-action button atau link aksi).',
		'- **Snippet Context Payload**: Meneruskan `{ variant }` ke seluruh snippet (`icon`, `title`, `description`, `children`) untuk mempermudah rendering dinamis berdasarkan varian aktif.',
		'- **Sub-part Styling via `classes`**: Mendukung penyesuaian class granular untuk setiap sub-bagian: `classes.icon`, `classes.title`, `classes.description`, dan wrapper layout `classes.content`.',
		'- **State via Data Attributes**: Mengekspos atribut `data-variant` langsung pada root DOM element untuk mempermudah targeting selector CSS kustom (`[data-variant="danger"]`).',
		'- **Aksesibilitas & DOM Ref**: Default `role="alert"` dengan isolasi assistive technology pada ikon (`aria-hidden="true"`), dukungan override atribut via `...restProps`, serta eksposisi DOM ref via `$bindable(ref)`.'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/Alert',
		component: Alert,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: componentDescription
				}
			}
		},
		argTypes: {
			variant: {
				control: 'select',
				options: ['default', 'danger', 'warning', 'success'],
				description: 'Varian semantik gaya visual alert.'
			},
			class: {
				control: 'text',
				description: 'Class override atau tambahan pada elemen container root alert.'
			},
			classes: {
				control: 'object',
				description: 'Class override untuk sub-bagian internal: icon, title, description, content.'
			}
		}
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

<Story name="Dynamic snippet payload" asChild>
	<div class="w-96 space-y-4">
		<Alert variant="danger">
			{#snippet icon({ variant })}
				<span class="rounded bg-danger/10 px-1 py-0.5 text-xs font-semibold uppercase">
					{variant}
				</span>
			{/snippet}
			{#snippet title({ variant })}
				Action required: {variant}
			{/snippet}
			{#snippet description()}
				Snippets receive <code>&#123; variant &#125;</code> as context for dynamic rendering.
			{/snippet}
		</Alert>
		<Alert variant="success">
			{#snippet icon({ variant })}
				<span class="rounded bg-success/10 px-1 py-0.5 text-xs font-semibold uppercase">
					{variant}
				</span>
			{/snippet}
			{#snippet title({ variant })}
				Operation result: {variant}
			{/snippet}
			{#snippet description()}
				Snippets adapt seamlessly to whatever variant is currently set on the component.
			{/snippet}
		</Alert>
	</div>
</Story>
