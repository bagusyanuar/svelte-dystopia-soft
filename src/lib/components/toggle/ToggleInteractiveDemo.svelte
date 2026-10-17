<script lang="ts">
	import Toggle from './Toggle.svelte';

	let isBold = $state(true);
	let isItalic = $state(false);
	let isUnderline = $state(false);
	let isCode = $state(false);

	let isBookmarked = $state(false);
	let isMuted = $state(true);
</script>

<div class="flex w-full max-w-lg flex-col gap-6">
	<!-- Rich Text Toolbar Demo -->
	<div class="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4 shadow-xs">
		<span class="text-xs font-medium text-foreground-muted">Editor Formatting Toolbar</span>
		<div class="flex items-center gap-1 border-b border-border pb-3">
			<Toggle
				variant="outline"
				size="sm"
				bind:pressed={isBold}
				aria-label="Toggle Bold"
				title="Bold"
			>
				<span class="text-xs font-bold">B</span>
			</Toggle>
			<Toggle
				variant="outline"
				size="sm"
				bind:pressed={isItalic}
				aria-label="Toggle Italic"
				title="Italic"
			>
				<span class="font-serif text-xs italic">I</span>
			</Toggle>
			<Toggle
				variant="outline"
				size="sm"
				bind:pressed={isUnderline}
				aria-label="Toggle Underline"
				title="Underline"
			>
				<span class="text-xs underline">U</span>
			</Toggle>
			<Toggle
				variant="outline"
				size="sm"
				bind:pressed={isCode}
				aria-label="Toggle Monospace Code"
				title="Code"
			>
				<span class="font-mono text-xs">&lt;/&gt;</span>
			</Toggle>
		</div>
		<div
			class="min-h-16 p-3 text-sm text-foreground-soft transition-all"
			class:font-bold={isBold}
			class:italic={isItalic}
			class:underline={isUnderline}
			class:font-mono={isCode}
		>
			The quick brown fox jumps over the lazy dog.
		</div>
	</div>

	<!-- Dynamic Payload & Icon Snippet Demo -->
	<div class="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 shadow-xs">
		<span class="text-xs font-medium text-foreground-muted">Snippet State Payload (`pressed`)</span>
		<div class="flex items-center gap-4">
			<Toggle variant="outline" bind:pressed={isBookmarked} class="gap-2">
				{#snippet children({ pressed })}
					<svg
						viewBox="0 0 24 24"
						class="size-4 transition-transform duration-200"
						class:scale-110={pressed}
						fill={pressed ? 'currentColor' : 'none'}
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
					</svg>
					<span>{pressed ? 'Bookmarked' : 'Bookmark'}</span>
				{/snippet}
			</Toggle>

			<Toggle variant="default" bind:pressed={isMuted} class="gap-2">
				{#snippet children({ pressed })}
					{#if pressed}
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="size-4"
							aria-hidden="true"
						>
							<line x1="1" y1="1" x2="23" y2="23" />
							<path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
							<path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
							<line x1="12" y1="19" x2="12" y2="23" />
							<line x1="8" y1="23" x2="16" y2="23" />
						</svg>
						<span>Muted</span>
					{:else}
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="size-4"
							aria-hidden="true"
						>
							<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
							<path d="M19 10v2a7 7 0 0 1-14 0v-2" />
							<line x1="12" y1="19" x2="12" y2="23" />
							<line x1="8" y1="23" x2="16" y2="23" />
						</svg>
						<span>Unmuted</span>
					{/if}
				{/snippet}
			</Toggle>
		</div>
	</div>
</div>
