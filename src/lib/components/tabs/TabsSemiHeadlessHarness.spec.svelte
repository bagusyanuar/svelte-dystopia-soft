<script lang="ts">
	import Tabs from './Tabs.svelte';
	import TabsList from './TabsList.svelte';
	import TabsTrigger from './TabsTrigger.svelte';
	import TabsContent from './TabsContent.svelte';
	import type { TabsOrientation, TabsVariant } from './Tabs.types.js';

	let {
		value = $bindable('tab1'),
		variant = 'pill',
		orientation = 'horizontal',
		forceMount = false,
		useCustomTrigger = false,
		useChildTrigger = false,
		onValueChange = undefined
	}: {
		value?: string;
		variant?: TabsVariant;
		orientation?: TabsOrientation;
		forceMount?: boolean;
		useCustomTrigger?: boolean;
		useChildTrigger?: boolean;
		onValueChange?: (val: string) => void;
	} = $props();

	let tabsRef = $state<HTMLDivElement | null>(null);
	let listRef = $state<HTMLDivElement | null>(null);
	let trigger1Ref = $state<HTMLButtonElement | null>(null);
	let content1Ref = $state<HTMLDivElement | null>(null);

	let callbackCount = $state(0);
	let lastCallbackValue = $state<string | null>(null);

	function handleValueChange(val: string) {
		callbackCount += 1;
		lastCallbackValue = val;
		onValueChange?.(val);
	}
</script>

<Tabs
	bind:ref={tabsRef}
	bind:value
	{variant}
	{orientation}
	onValueChange={handleValueChange}
	data-testid="semi-tabs-root"
>

	<TabsList bind:ref={listRef} data-testid="semi-tabs-list">
		{#if useChildTrigger}
			<TabsTrigger value="tab1">
				{#snippet child({ props, active })}
					<a href="#tab1" {...props} data-testid="child-anchor-trigger" data-anchor-active={active}>
						Anchor Tab 1
					</a>
				{/snippet}
			</TabsTrigger>
		{:else if useCustomTrigger}
			<TabsTrigger value="tab1" bind:ref={trigger1Ref}>
				{#snippet children({ active, disabled })}
					<span data-testid="custom-trigger-text" data-is-active={active} data-is-disabled={disabled}>
						Custom Tab 1 ({active ? 'ACTIVE' : 'INACTIVE'})
					</span>
				{/snippet}
			</TabsTrigger>
		{:else}
			<TabsTrigger value="tab1" bind:ref={trigger1Ref}>Tab 1</TabsTrigger>
		{/if}

		<TabsTrigger value="tab2">Tab 2</TabsTrigger>
		<TabsTrigger value="tab3" disabled>Tab 3 Disabled</TabsTrigger>
	</TabsList>

	<TabsContent value="tab1" bind:ref={content1Ref} {forceMount}>
		{#snippet children({ active })}
			<div data-testid="panel-content-1" data-panel-active={active}>
				Content for tab 1
			</div>
		{/snippet}
	</TabsContent>

	<TabsContent value="tab2" {forceMount}>
		{#snippet children({ active })}
			<div data-testid="panel-content-2" data-panel-active={active}>
				Content for tab 2
			</div>
		{/snippet}
	</TabsContent>

	<TabsContent value="tab3" {forceMount}>
		Content for tab 3
	</TabsContent>
</Tabs>

<div data-testid="harness-meta">
	<span data-testid="has-tabs-ref">{Boolean(tabsRef)}</span>
	<span data-testid="has-list-ref">{Boolean(listRef)}</span>
	<span data-testid="has-trigger1-ref">{Boolean(trigger1Ref)}</span>
	<span data-testid="has-content1-ref">{Boolean(content1Ref)}</span>
	<span data-testid="callback-count">{callbackCount}</span>
	<span data-testid="callback-val">{lastCallbackValue}</span>
	<span data-testid="bound-value">{value}</span>
</div>
