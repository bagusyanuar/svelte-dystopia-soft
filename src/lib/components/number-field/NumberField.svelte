<script lang="ts">
	import { tick } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import TextField from '../text-field/TextField.svelte';
	import type { NumberFieldProps } from './NumberField.types.js';

	let {
		value = $bindable(),
		ref = $bindable(null),
		hideSpinner = true,
		thousandSeparator = false,
		classes,
		onValueChange,
		...restProps
	}: NumberFieldProps = $props();

	/** Groups the integer part with `.` and marks the fraction with `,` (Indonesian style), preserving every typed digit exactly — unlike `Intl.NumberFormat`, which rounds long fraction parts. */
	function format(canonical: string): string {
		if (!thousandSeparator || !canonical) return canonical;
		const negative = canonical.startsWith('-');
		const unsigned = negative ? canonical.slice(1) : canonical;
		const [intPart, ...fracParts] = unsigned.split('.');
		const groupedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
		const frac =
			fracParts.length > 0 ? ',' + fracParts.join('') : unsigned.endsWith('.') ? ',' : '';
		return (negative ? '-' : '') + groupedInt + frac;
	}

	/** Inverse of `format` — drops the `.` grouping and turns the `,` decimal mark back into `.`, so the result is a plain string `Number()` can parse. */
	function sanitize(display: string): string {
		const negative = display.trimStart().startsWith('-');
		const kept = display.replace(/[^\d.,]/g, '').replace(/\./g, '');
		const [intPart, ...fracParts] = kept.split(',');
		const cleaned =
			fracParts.length > 0
				? `${intPart}.${fracParts.join('')}`
				: kept.endsWith(',')
					? `${intPart}.`
					: intPart;
		return (negative ? '-' : '') + cleaned;
	}

	function toDisplay(next: number | undefined): string {
		return next === undefined ? '' : format(String(next));
	}

	function toNumber(display: string): number | undefined {
		const canonical = thousandSeparator ? sanitize(display) : display;
		if (canonical === '' || canonical === '-') return undefined;
		const n = Number(canonical);
		return Number.isNaN(n) ? undefined : n;
	}

	let displayValue = $state(toDisplay(value));
	// Tracks the last `value` this component itself committed, so the effect
	// below only reacts to a change that came from *outside* (e.g. a parent
	// resetting the bound value). Comparing against `displayValue` instead
	// races with `handleInput` — the two are updated by separate statements,
	// and the effect can observe the moment between them — which used to
	// reset the field to blank on every keystroke.
	let lastCommitted = value;

	$effect(() => {
		if (value === lastCommitted) return;
		lastCommitted = value;
		displayValue = toDisplay(value);
	});

	function digitsBefore(str: string, pos: number): number {
		let count = 0;
		for (let i = 0; i < pos && i < str.length; i++) {
			if (str[i] >= '0' && str[i] <= '9') count++;
		}
		return count;
	}

	/** Inverse of `digitsBefore` — the caret index landing just after the `digitCount`-th digit, so re-grouping doesn't shift the caret relative to what the user was typing. */
	function positionAfterDigits(str: string, digitCount: number): number {
		if (digitCount <= 0) return 0;
		let count = 0;
		for (let i = 0; i < str.length; i++) {
			if (str[i] >= '0' && str[i] <= '9') {
				count++;
				if (count === digitCount) return i + 1;
			}
		}
		return str.length;
	}

	async function handleInput(event: Event & { currentTarget: HTMLInputElement }): Promise<void> {
		const input = event.currentTarget;
		const raw = input.value;

		if (thousandSeparator) {
			const caretDigits = digitsBefore(raw, input.selectionStart ?? raw.length);
			displayValue = format(sanitize(raw));
			await tick();
			const caretPos = positionAfterDigits(displayValue, caretDigits);
			input.setSelectionRange(caretPos, caretPos);
		} else {
			displayValue = raw;
		}

		const next = toNumber(displayValue);
		value = next;
		lastCommitted = next;
		onValueChange?.(next);
	}
</script>

<TextField
	{...restProps}
	bind:ref
	type={thousandSeparator ? 'text' : 'number'}
	inputmode={thousandSeparator ? 'decimal' : undefined}
	bind:value={displayValue}
	oninput={handleInput}
	classes={{
		...classes,
		input: cn(
			hideSpinner &&
				!thousandSeparator &&
				'[-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
			classes?.input
		)
	}}
/>
