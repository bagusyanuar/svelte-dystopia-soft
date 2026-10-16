<script lang="ts">
	import IMask from 'imask';
	import TextField from '../text-field/TextField.svelte';
	import type { MaskedFieldProps } from './MaskedField.types.js';

	let {
		pattern,
		blocks,
		value = $bindable(''),
		unmaskedValue = $bindable(),
		ref = $bindable(null),
		inputRef = $bindable(null),
		classes,
		prefix,
		suffix,
		onValueChange,
		...restProps
	}: MaskedFieldProps = $props();

	type MaskInstance = InstanceType<typeof IMask.InputMask>;

	function maskOptions() {
		return {
			mask: pattern ?? '',
			definitions: { '#': /\d/ },
			...(blocks ? { blocks } : {})
		};
	}

	let masked: MaskInstance | undefined;
	let lastCommitted = value;

	$effect(() => {
		inputRef = ref;
	});

	// `imask` owns the input's DOM value directly (via `ref`) rather than going
	// through TextField's own `bind:value` — masking needs full control over
	// every keystroke (caret position, paste, backspace across literals) that a
	// plain Svelte binding can't give it.
	$effect(() => {
		const input = ref ?? inputRef;
		if (!input || !pattern) return;

		const instance = IMask(input, maskOptions()) as MaskInstance;
		instance.value = value;
		lastCommitted = instance.value;
		unmaskedValue = instance.unmaskedValue;
		masked = instance;

		function handleAccept(): void {
			value = instance.value;
			unmaskedValue = instance.unmaskedValue;
			lastCommitted = instance.value;
			onValueChange?.(instance.value, instance.unmaskedValue);
		}
		instance.on('accept', handleAccept);

		return () => {
			instance.destroy();
			masked = undefined;
		};
	});

	$effect(() => {
		// `pattern` or `blocks` changed after mount — reconfigure the existing instance
		// instead of tearing it down and losing focus/caret state.
		if (masked) masked.updateOptions(maskOptions() as never);
	});

	$effect(() => {
		// Reflect an externally-set `value` (e.g. a form reset) into the mask.
		// Guarded against our own commits so this doesn't race with typing —
		// the same fix `NumberField`'s `lastCommitted` tracking needed.
		if (value === lastCommitted) return;
		lastCommitted = value;
		if (masked) masked.value = value;
	});
</script>

{#snippet renderPrefix()}
	{@render prefix?.({ value, unmaskedValue })}
{/snippet}

{#snippet renderSuffix()}
	{@render suffix?.({ value, unmaskedValue })}
{/snippet}

<TextField
	{...restProps}
	bind:ref
	{classes}
	prefix={prefix ? renderPrefix : undefined}
	suffix={suffix ? renderSuffix : undefined}
	data-slot="masked-field"
	data-masked=""
/>
