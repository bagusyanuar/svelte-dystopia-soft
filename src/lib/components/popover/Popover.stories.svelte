<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Popover from './Popover.svelte';
	import Button from '../button/Button.svelte';
	import TextField from '../text-field/TextField.svelte';
	import Label from '../label/Label.svelte';

	const componentDescription = [
		'Komponen dialog mengambang (Popover) berbasis floating-ui dan portal dengan estetika **SaaS Compact Minimalist** (terinspirasi dari Linear). Membuka panel konten fleksibel terhadap pemicu (trigger) dengan penanganan dismiss otomatis (Esc & Outside-click).',
		'',
		'### Fitur Utama & Prinsip Semi-Headless',
		'- **Multi DOM Refs**: Mendukung `bind:ref` / `bind:triggerRef` (tombol pemicu) dan `bind:contentRef` (kontainer dialog mengambang).',
		'- **Snippet State Payload**: Meneruskan `{ open, close }` ke snippet `trigger` dan `children` (konten), memungkinkan penutupan popover secara langsung dari tombol aksi internal ("Simpan", "Batal", dll).',
		'- **Granular Styling (`classes`)**: Mendukung kustomisasi sub-bagian `classes.trigger` dan `classes.content`, serta prop utama `class` pada tombol trigger.',
		'- **State via Data-Attributes**: Mengekspos hook `data-slot="popover-trigger"`, `data-slot="popover-content"`, `data-state="open" | "closed"`, dan `data-placement`.',
		'- **Animasi Exit Teruji**: Menggunakan `createPresence` sehingga panel tetap berada di DOM hingga animasi exit CSS konsumen selesai.'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/Popover',
		component: Popover,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: componentDescription
				}
			}
		},
		argTypes: {
			placement: {
				control: 'select',
				options: [
					'top',
					'top-start',
					'top-end',
					'bottom',
					'bottom-start',
					'bottom-end',
					'left',
					'left-start',
					'left-end',
					'right',
					'right-start',
					'right-end'
				],
				description: 'Posisi penempatan floating dialog relatif terhadap trigger.'
			},
			offset: {
				control: 'number',
				description: 'Jarak offset dalam pixel antara trigger dan floating content.'
			}
		}
	});
</script>

<Story name="Default" asChild>
	<div class="flex w-80 justify-center p-16">
		<Popover>
			{#snippet trigger()}
				Open popover
			{/snippet}
			<p class="w-56 text-sm">
				Popovers position themselves against the trigger and stay clear of clipping ancestors.
			</p>
		</Popover>
	</div>
</Story>

<Story name="Snippet payload (internal close)" asChild>
	<div class="flex w-80 justify-center p-16">
		<Popover>
			{#snippet trigger({ open })}
				<span class="flex items-center gap-1.5">
					Filter Options
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="size-3.5 transition-transform duration-150 {open ? 'rotate-180' : ''}"
					>
						<path d="m6 9 6 6 6-6" stroke-linecap="round" />
					</svg>
				</span>
			{/snippet}
			{#snippet children({ close })}
				<div class="w-64 space-y-3">
					<div class="border-b border-border pb-2">
						<h4 class="text-xs font-semibold tracking-wider text-foreground uppercase">
							Filter Data
						</h4>
						<p class="text-xs text-foreground-muted">Sesuaikan parameter filter pencarian.</p>
					</div>
					<div class="space-y-1.5">
						<Label for="query-filter" class="text-xs">Keyword</Label>
						<TextField id="query-filter" size="sm" placeholder="e.g. pending" />
					</div>
					<div class="flex justify-end gap-2 border-t border-border pt-2">
						<Button variant="ghost" size="xs" onclick={close}>Batal</Button>
						<Button variant="default" size="xs" onclick={close}>Terapkan</Button>
					</div>
				</div>
			{/snippet}
		</Popover>
	</div>
</Story>

<Story name="Custom sub-parts styling" asChild>
	<div class="flex w-80 justify-center p-16">
		<Popover
			classes={{
				trigger: 'border-primary/40 bg-surface-subtle font-mono text-xs hover:border-primary',
				content: 'bg-surface border-primary/30 shadow-lg p-3 w-60 rounded-md font-mono text-xs'
			}}
		>
			{#snippet trigger()}
				#POP-CUSTOM: Click me
			{/snippet}
			{#snippet children({ close })}
				<div class="space-y-2">
					<p class="text-foreground">Custom styled floating content with mono theme.</p>
					<button
						type="button"
						class="cursor-pointer text-xs text-primary underline"
						onclick={close}
					>
						[Dismiss]
					</button>
				</div>
			{/snippet}
		</Popover>
	</div>
</Story>

<Story name="Placements" asChild>
	<div class="flex w-full flex-wrap justify-center gap-16 p-24">
		<Popover placement="top">
			{#snippet trigger()}
				Top
			{/snippet}
			<p class="w-48">Top placement.</p>
		</Popover>
		<Popover placement="right">
			{#snippet trigger()}
				Right
			{/snippet}
			<p class="w-48">Right placement.</p>
		</Popover>
		<Popover placement="bottom">
			{#snippet trigger()}
				Bottom
			{/snippet}
			<p class="w-48">Bottom placement.</p>
		</Popover>
		<Popover placement="left">
			{#snippet trigger()}
				Left
			{/snippet}
			<p class="w-48">Left placement.</p>
		</Popover>
	</div>
</Story>

<Story name="Inside a scroll container (table)" asChild>
	<div class="w-96 overflow-x-auto rounded-lg border border-border">
		<table class="w-160 text-sm">
			<thead>
				<tr class="border-b border-border text-left text-foreground-soft">
					<th class="p-3">Name</th>
					<th class="p-3">Email</th>
					<th class="p-3">Role</th>
					<th class="p-3">Details</th>
				</tr>
			</thead>
			<tbody>
				<tr class="border-b border-border">
					<td class="p-3">Ada Lovelace</td>
					<td class="p-3">ada@example.com</td>
					<td class="p-3">Admin</td>
					<td class="p-3">
						<Popover placement="bottom-end">
							{#snippet trigger()}
								View
							{/snippet}
							<div class="w-48 space-y-1">
								<p class="font-medium text-foreground">Ada Lovelace</p>
								<p class="text-foreground-muted">Admin since Jan 2024. Last active 2 hours ago.</p>
							</div>
						</Popover>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</Story>

<Story name="Custom enter and exit animation" asChild>
	<div class="flex w-80 justify-center p-16">
		<Popover classes={{ content: 'popover-animated' }}>
			{#snippet trigger()}
				Animated
			{/snippet}
			{#snippet children({ close })}
				<div class="w-56 space-y-2">
					<p class="text-xs font-medium text-foreground">Custom Animation</p>
					<p class="text-xs text-foreground-muted">
						Panel ini tetap berada di DOM hingga animasi keluar (<code>data-state="closed"</code>)
						selesai sebelum di-unmount oleh <code>createPresence</code>.
					</p>
					<button
						type="button"
						class="cursor-pointer text-xs font-medium text-primary hover:underline"
						onclick={close}
					>
						Tutup Popover
					</button>
				</div>
			{/snippet}
		</Popover>
	</div>
</Story>

<style>
	/*
	  The panel is portalled to <body>, so it never carries this component's
	  scope class — the selectors have to be global. Positioning is driven by
	  floating-ui (`left`/`top`), which leaves `transform` free for the consumer.

	  `-global-` belongs on the @keyframes declaration only: Svelte strips it
	  from the emitted name but does NOT rewrite references inside :global(),
	  so spelling it here too would point at a name that no longer exists,
	  and the animation would silently never run.
	*/
	:global(.popover-animated[data-state='open']) {
		animation: popover-in 200ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	:global(.popover-animated[data-state='closed']) {
		animation: popover-out 150ms ease-in;
	}

	@keyframes -global-popover-in {
		from {
			opacity: 0;
			transform: scale(0.95) translateY(-6px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	@keyframes -global-popover-out {
		from {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
		to {
			opacity: 0;
			transform: scale(0.95) translateY(-6px);
		}
	}
</style>
