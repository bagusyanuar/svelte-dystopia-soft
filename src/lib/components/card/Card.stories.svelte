<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Card from './Card.svelte';
	import CardHeader from './CardHeader.svelte';
	import CardTitle from './CardTitle.svelte';
	import CardDescription from './CardDescription.svelte';
	import CardContent from './CardContent.svelte';
	import CardFooter from './CardFooter.svelte';
	import Button from '../button/Button.svelte';
	import Badge from '../badge/Badge.svelte';

	const componentDescription = [
		'Keluarga komponen kontainer kartu dengan estetika **SaaS Compact Minimalist** (mengikuti model densitas Linear). Menyediakan struktur visual modular untuk mengelompokkan konten terkait, metrik, formulir, atau aksi.',
		'',
		'### Fitur Utama & Prinsip Semi-Headless',
		'- **Border-Driven Separation Tanpa Resting Shadow**: Kartu mengandalkan garis pembatas halus (`border border-border`) dan permukaan `bg-surface` tanpa bayangan melayang saat istirahat, menciptakan tampilan yang tenang dan tidak berantakan.',
		'- **Modular Compound Architecture**: Terdiri dari 6 subkomponen terpisah (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`) yang dapat dirakit, diatur ulang, atau dihilangkan sesuai kebutuhan tampilan.',
		'- **Fleksibilitas Semantik HTML (`as` prop)**: `Card` dapat dialihkan menjadi `<article>` atau `<section>`, `CardTitle` dapat menjadi heading semantik (`h1`–`h6`), dan `CardDescription` dapat menjadi `<p>` untuk memenuhi standar WAI-ARIA dan struktur dokumen semantik.',
		'- **Akses DOM Ref (`bind:ref`)**: Seluruh subkomponen mendukung prop `ref = $bindable(null)` untuk integrasi dengan animasi, resize observer, maupun fokus.',
		'- **Penargetan CSS via `data-slot`**: Setiap subkomponen mengekspos atribut `data-slot="card|card-header|card-title|..."` sehingga konsumen dapat menerapkan penataan bersarang tanpa coupling ke class internal.'
	].join('\n');

	const { Story } = defineMeta({
		title: 'Components/Card',
		component: Card,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: componentDescription
				}
			}
		},
		argTypes: {
			as: {
				control: 'select',
				options: ['div', 'article', 'section'],
				description: 'Tag elemen HTML pembungkus kartu root.'
			},
			class: {
				control: 'text',
				description: 'Class override tambahan pada root elemen kartu.'
			}
		}
	});
</script>

<Story name="Default" asChild>
	<div class="w-80">
		<Card>
			<CardHeader>
				<CardTitle>Team plan</CardTitle>
				<CardDescription>Everything your team needs to ship faster.</CardDescription>
			</CardHeader>
			<CardContent>
				<p class="text-sm text-foreground-muted">
					Unlimited projects, priority support, and access to every component in the library.
				</p>
			</CardContent>
			<CardFooter>
				<Button class="w-full">Upgrade</Button>
			</CardFooter>
		</Card>
	</div>
</Story>

<Story name="Header and content only" asChild>
	<div class="w-80">
		<Card>
			<CardHeader>
				<CardTitle>No footer</CardTitle>
				<CardDescription>Not every card needs an action row.</CardDescription>
			</CardHeader>
			<CardContent>
				<p class="text-sm text-foreground-muted">
					Compose only the parts you actually need — every section is optional.
				</p>
			</CardContent>
		</Card>
	</div>
</Story>

<Story name="With a footer of multiple actions" asChild>
	<div class="w-80">
		<Card>
			<CardHeader>
				<CardTitle>Delete project</CardTitle>
				<CardDescription>This action cannot be undone.</CardDescription>
			</CardHeader>
			<CardFooter class="justify-end">
				<Button variant="outline">Cancel</Button>
				<Button>Delete</Button>
			</CardFooter>
		</Card>
	</div>
</Story>

<Story name="With a header badge" asChild>
	<div class="w-80">
		<Card>
			<CardHeader class="flex-row items-center justify-between">
				<CardTitle>Storage</CardTitle>
				<Badge variant="secondary">80% used</Badge>
			</CardHeader>
			<CardContent>
				<p class="text-sm text-foreground-muted">12.4 GB of 15 GB used.</p>
			</CardContent>
		</Card>
	</div>
</Story>

<Story name="Semantic HTML & headings" asChild>
	<div class="w-80">
		<Card as="article">
			<CardHeader>
				<CardTitle as="h3">Security advisory</CardTitle>
				<CardDescription as="p">Published 2 hours ago by SecOps team</CardDescription>
			</CardHeader>
			<CardContent>
				<p class="text-sm text-foreground-muted">
					All API keys rotated successfully. No further manual intervention required.
				</p>
			</CardContent>
		</Card>
	</div>
</Story>

<Story name="Interactive clickable card" asChild>
	<div class="w-80">
		<a
			href="#analytics-detail"
			class="group block rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
		>
			<Card
				class="transition-colors duration-150 group-hover:border-border-hover group-hover:bg-surface-subtle/50"
			>
				<CardHeader>
					<div class="flex items-center justify-between">
						<CardTitle>View Analytics</CardTitle>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="size-4 text-foreground-subtle transition-transform duration-150 group-hover:translate-x-0.5"
							aria-hidden="true"
						>
							<path d="m9 18 6-6-6-6" />
						</svg>
					</div>
					<CardDescription>Traffic, conversion rates, and churn overview.</CardDescription>
				</CardHeader>
				<CardContent>
					<p class="text-sm text-foreground-muted">
						Updated live across all regional edge servers.
					</p>
				</CardContent>
			</Card>
		</a>
	</div>
</Story>

<Story name="Stat metric card" asChild>
	<div class="w-72">
		<Card>
			<CardHeader class="pb-2">
				<div class="flex items-center justify-between">
					<CardDescription class="font-medium">Total Monthly Revenue</CardDescription>
					<Badge variant="success">+14.2%</Badge>
				</div>
				<CardTitle class="text-2xl font-semibold tracking-tight">$48,250.00</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-xs text-foreground-subtle">+$6,120 compared to last month</p>
			</CardContent>
		</Card>
	</div>
</Story>
