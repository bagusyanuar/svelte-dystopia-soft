<script lang="ts">
	import HelperText from './HelperText.svelte';
	import TextField from '../text-field/TextField.svelte';
</script>

<TextField id="email" aria-describedby="email-error" invalid placeholder="you@company.com" />
<HelperText id="email-error" invalid>Enter a valid email address.</HelperText>
