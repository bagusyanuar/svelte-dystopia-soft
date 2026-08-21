import type { Preview } from '@storybook/sveltekit';
import '../src/lib/index.css';
import './storybook-theme.css';

const preview: Preview = {
	globalTypes: {
		theme: {
			description: 'Theme token set applied to the story canvas',
			toolbar: {
				title: 'Theme',
				icon: 'paintbrush',
				items: [
					{ value: 'light', title: 'Light' },
					{ value: 'dark', title: 'Dark' }
				],
				dynamicTitle: true
			}
		}
	},

	initialGlobals: {
		theme: 'light'
	},

	decorators: [
		(story, context) => {
			// Tokens are inherited, so setting data-theme on <html> themes the whole
			// canvas — including anything a component portals outside the story root.
			const root = document.documentElement;
			if (context.globals.theme === 'dark') {
				root.setAttribute('data-theme', 'dark');
			} else {
				root.removeAttribute('data-theme');
			}
			return story();
		}
	],

	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},

		a11y: {
			// 'todo' - show a11y violations in the test UI only
			// 'error' - fail CI on a11y violations
			// 'off' - skip a11y checks entirely
			test: 'error'
		}
	}
};

export default preview;
