<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { radioVariants } from './Radio.variants.js';
	import Label from '../label/Label.svelte';
	import type { RadioProps } from './Radio.types.js';

	let {
		id,
		size = 'md',
		class: className,
		classes,
		ref = $bindable(null),
		rootRef = $bindable(null),
		fieldRef = $bindable(null),
		group = $bindable(),
		value,
		checked,
		disabled = false,
		invalid = false,
		indicator,
		label,
		description,
		...restProps
	}: RadioProps = $props();

	const generatedId = $props.id();
	const radioId = $derived(id ?? (label ? generatedId : undefined));
	const isChecked = $derived(group !== undefined ? group === value : Boolean(checked));
</script>

{#snippet radioControl()}
	<span
		bind:this={rootRef}
		data-slot="radio"
		data-state={isChecked ? 'checked' : 'unchecked'}
		data-checked={isChecked ? '' : undefined}
		data-disabled={disabled ? '' : undefined}
		data-invalid={invalid ? '' : undefined}
		data-size={size ?? 'md'}
		class={cn(radioVariants({ size }), className)}
	>
		{#if checked !== undefined && group === undefined}
			<input
				id={radioId}
				type="radio"
				bind:this={ref}
				{value}
				{checked}
				{disabled}
				class={cn(
					'peer absolute inset-0 size-full cursor-pointer appearance-none rounded-full border border-border bg-surface transition-colors duration-150 group-data-invalid:border-danger-border checked:border-primary hover:border-border-hover checked:hover:border-primary-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none group-data-invalid:focus-visible:ring-danger disabled:cursor-not-allowed',
					classes?.input
				)}
				{...restProps}
			/>
		{:else}
			<input
				id={radioId}
				type="radio"
				bind:this={ref}
				bind:group
				{value}
				{disabled}
				class={cn(
					'peer absolute inset-0 size-full cursor-pointer appearance-none rounded-full border border-border bg-surface transition-colors duration-150 group-data-invalid:border-danger-border checked:border-primary hover:border-border-hover checked:hover:border-primary-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none group-data-invalid:focus-visible:ring-danger disabled:cursor-not-allowed',
					classes?.input
				)}
				{...restProps}
			/>
		{/if}

		{#if indicator}
			<span
				data-slot="radio-indicator"
				aria-hidden="true"
				class={cn(
					'pointer-events-none absolute inset-0 flex items-center justify-center',
					classes?.indicator
				)}
			>
				{@render indicator({ checked: isChecked })}
			</span>
		{:else}
			<span
				data-slot="radio-indicator"
				aria-hidden="true"
				class={cn(
					'pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100',
					classes?.indicator
				)}
			>
				<span class={cn('size-[45%] rounded-full bg-primary', classes?.dot)}></span>
			</span>
		{/if}
	</span>
{/snippet}

{#if label || description}
	<div
		bind:this={fieldRef}
		data-slot="radio-field"
		data-disabled={disabled ? '' : undefined}
		data-invalid={invalid ? '' : undefined}
		class={cn('inline-flex gap-2', description ? 'items-start' : 'items-center', classes?.field)}
	>
		{@render radioControl()}
		<div class={cn('flex flex-col gap-0.5', description ? 'pt-0.5' : '', classes?.labelWrapper)}>
			{#if label}
				<Label
					for={radioId}
					disabled={Boolean(disabled)}
					class={cn('cursor-pointer select-none', classes?.label)}
				>
					{#if typeof label === 'string'}
						{label}
					{:else}
						{@render label({ checked: isChecked })}
					{/if}
				</Label>
			{/if}
			{#if description}
				<p
					data-slot="radio-description"
					class={cn('text-xs text-foreground-muted select-none', classes?.description)}
				>
					{#if typeof description === 'string'}
						{description}
					{:else}
						{@render description({ checked: isChecked })}
					{/if}
				</p>
			{/if}
		</div>
	</div>
{:else}
	{@render radioControl()}
{/if}
