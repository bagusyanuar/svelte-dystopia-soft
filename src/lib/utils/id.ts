/**
 * Derives a stable set of related DOM ids from one `$props.id()` call, so a
 * component needs only one call site to hand out `aria-labelledby`,
 * `aria-controls`, etc. targets without risking an SSR/hydration mismatch
 * from a module-level counter.
 */
export function createIds<const Parts extends readonly string[]>(
	base: string,
	...parts: Parts
): { [K in Parts[number]]: string } {
	const ids = {} as { [K in Parts[number]]: string };
	for (const part of parts) {
		ids[part as Parts[number]] = `${base}-${part}`;
	}
	return ids;
}

/** Composes an id from a base and dynamic segments, e.g. a tab's index. */
export function idFor(base: string, ...segments: (string | number)[]): string {
	return [base, ...segments].join('-');
}
