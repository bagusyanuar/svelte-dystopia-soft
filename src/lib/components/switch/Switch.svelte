<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { switchVariants, switchThumbVariants } from './Switch.variants.js';
	import Label from '../label/Label.svelte';
	import type { SwitchProps } from './Switch.types.js';

	let {
		id,
		size = 'md',
		class: className,
		classes,
		ref = $bindable(null),
		rootRef = $bindable(null),
		fieldRef = $bindable(null),
		checked = $bindable(false),
		disabled = false,
		invalid = false,
		onCheckedChange,
		thumb,
		label,
		description,
		onchange,
		...restProps
	}: SwitchProps = $props();

	const generatedId = $props.id();
	const switchId = $derived(id ?? (label ? generatedId : undefined));

	function handleChange(event: Event & { currentTarget: HTMLInputElement }) {
		onchange?.(event);
		onCheckedChange?.(event.currentTarget.checked);
	}
</script>

{#snippet switchControl()}
	<span
		bind:this={rootRef}
		data-slot="switch"
		data-state={checked ? 'checked' : 'unchecked'}
		data-checked={checked ? '' : undefined}
		data-disabled={disabled ? '' : undefined}
		data-invalid={invalid ? '' : undefined}
		data-size={size ?? 'md'}
		class={cn(switchVariants({ size }), classes?.root, className)}
	>
		<input
			id={switchId}
			type="checkbox"
			role="switch"
			bind:this={ref}
			bind:checked
			{disabled}
			aria-invalid={invalid || undefined}
			onchange={handleChange}
			class={cn(
				'peer absolute inset-0 size-full cursor-pointer appearance-none rounded-full border border-border bg-surface-subtle transition-colors duration-150 group-data-invalid:border-danger-border checked:border-primary checked:bg-primary hover:bg-surface-hover checked:hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none group-data-invalid:focus-visible:ring-danger disabled:cursor-not-allowed',
				classes?.input
			)}
			{...restProps}
		/>

		<span
			data-slot="switch-thumb"
			aria-hidden="true"
			class={cn(
				switchThumbVariants({ size }),
				'flex items-center justify-center',
				classes?.thumb
			)}
		>
			{#if thumb}
				{@render thumb({ checked: Boolean(checked), disabled: Boolean(disabled) })}
			{/if}
		</span>
	</span>
{/snippet}

{#if label || description}
	<div
		bind:this={fieldRef}
		data-slot="switch-field"
		class={cn(
			'inline-flex gap-2',
			description ? 'items-start' : 'items-center',
			classes?.field
		)}
	>
		{@render switchControl()}
		<div class={cn('flex flex-col gap-0.5', description ? 'pt-0.5' : '', classes?.labelWrapper)}>
			{#if label}
				<Label
					for={switchId}
					disabled={Boolean(disabled)}
					class={cn('cursor-pointer select-none', classes?.label)}
				>
					{#if typeof label === 'string'}
						{label}
					{:else}
						{@render label({ checked: Boolean(checked) })}
					{/if}
				</Label>
			{/if}
			{#if description}
				<p
					data-slot="switch-description"
					class={cn('text-xs text-foreground-muted select-none', classes?.description)}
				>
					{#if typeof description === 'string'}
						{description}
					{:else}
						{@render description({ checked: Boolean(checked) })}
					{/if}
				</p>
			{/if}
		</div>
	</div>
{:else}
	{@render switchControl()}
{/if}
