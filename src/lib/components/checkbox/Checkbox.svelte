<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { checkboxVariants } from './Checkbox.variants.js';
	import Label from '../label/Label.svelte';
	import type { CheckboxProps } from './Checkbox.types.js';

	let {
		id,
		size = 'md',
		class: className,
		classes,
		ref = $bindable(null),
		rootRef = $bindable(null),
		fieldRef = $bindable(null),
		checked = $bindable(false),
		indeterminate = $bindable(false),
		disabled = false,
		invalid = false,
		indicator,
		label,
		description,
		...restProps
	}: CheckboxProps = $props();

	const generatedId = $props.id();
	const checkboxId = $derived(id ?? (label ? generatedId : undefined));
</script>

{#snippet checkboxControl()}
	<span
		bind:this={rootRef}
		data-slot="checkbox"
		data-state={indeterminate ? 'indeterminate' : checked ? 'checked' : 'unchecked'}
		data-checked={checked ? '' : undefined}
		data-indeterminate={indeterminate ? '' : undefined}
		data-disabled={disabled ? '' : undefined}
		data-invalid={invalid ? '' : undefined}
		data-size={size ?? 'md'}
		class={cn(checkboxVariants({ size }), className)}
	>
		<input
			id={checkboxId}
			type="checkbox"
			bind:this={ref}
			bind:checked
			bind:indeterminate
			{disabled}
			aria-invalid={invalid || undefined}
			class={cn(
				'peer absolute inset-0 size-full cursor-pointer appearance-none rounded-md border border-border bg-surface transition-colors duration-150 group-data-invalid:border-danger-border checked:border-primary checked:bg-primary indeterminate:border-primary indeterminate:bg-primary hover:border-border-hover checked:hover:border-primary-hover checked:hover:bg-primary-hover indeterminate:hover:border-primary-hover indeterminate:hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none group-data-invalid:focus-visible:ring-danger disabled:cursor-not-allowed',
				classes?.input
			)}
			{...restProps}
		/>

		{#if indicator}
			<span
				data-slot="checkbox-indicator"
				aria-hidden="true"
				class={cn(
					'pointer-events-none absolute inset-0 flex items-center justify-center text-primary-foreground',
					classes?.indicator
				)}
			>
				{@render indicator({ checked, indeterminate })}
			</span>
		{:else}
			<span
				data-slot="checkbox-indicator"
				aria-hidden="true"
				class={cn(
					'pointer-events-none absolute inset-0 flex items-center justify-center text-primary-foreground opacity-0 peer-checked:opacity-100 peer-indeterminate:opacity-0',
					classes?.indicator
				)}
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
					class={classes?.icon}
				>
					<path d="m5 13 4 4 10-10" />
				</svg>
			</span>

			<span
				data-slot="checkbox-indicator"
				aria-hidden="true"
				class={cn(
					'pointer-events-none absolute inset-0 flex items-center justify-center text-primary-foreground opacity-0 peer-indeterminate:opacity-100',
					classes?.indicator
				)}
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					class={classes?.icon}
				>
					<path d="M6 12h12" />
				</svg>
			</span>
		{/if}
	</span>
{/snippet}

{#if label || description}
	<div
		bind:this={fieldRef}
		data-slot="checkbox-field"
		class={cn(
			'inline-flex gap-2',
			description ? 'items-start' : 'items-center',
			classes?.field
		)}
	>
		{@render checkboxControl()}
		<div class={cn('flex flex-col gap-0.5', description ? 'pt-0.5' : '', classes?.labelWrapper)}>
			{#if label}
				<Label
					for={checkboxId}
					disabled={Boolean(disabled)}
					class={cn('cursor-pointer select-none', classes?.label)}
				>
					{#if typeof label === 'string'}
						{label}
					{:else}
						{@render label({ checked, indeterminate })}
					{/if}
				</Label>
			{/if}
			{#if description}
				<p
					data-slot="checkbox-description"
					class={cn('text-xs text-foreground-muted select-none', classes?.description)}
				>
					{#if typeof description === 'string'}
						{description}
					{:else}
						{@render description({ checked, indeterminate })}
					{/if}
				</p>
			{/if}
		</div>
	</div>
{:else}
	{@render checkboxControl()}
{/if}
