// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://kmalakoff.github.io',
	base: '/knockback',
	integrations: [
		starlight({
			title: 'Knockback.js',
			description: 'Knockout.js magic for Backbone.js Models and Collections',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/kmalakoff/knockback' },
			],
			sidebar: [
				{ label: 'Introduction', slug: 'intro' },
				{ label: 'Installation', slug: 'install' },
				{
					label: 'Getting Started',
					items: [
						{ label: 'Knockout Basics', slug: 'getting-started/knockout-basics' },
						{ label: 'Knockback Basics', slug: 'getting-started/knockback-basics' },
						{ label: 'Views & ViewModels', slug: 'getting-started/views-viewmodels' },
						{ label: 'Memory Management', slug: 'getting-started/memory-management' },
					],
				},
				{
					label: 'Tutorials',
					items: [
						{ label: 'kb.Observable', slug: 'tutorials/observable' },
						{ label: 'kb.ViewModel', slug: 'tutorials/viewmodel' },
						{ label: 'kb.CollectionObservable', slug: 'tutorials/collection-observable' },
						{ label: 'Localization', slug: 'tutorials/localization' },
						{ label: 'Nested Models', slug: 'tutorials/nested-models' },
					],
				},
				{
					label: 'API Reference',
					autogenerate: { directory: 'api' },
				},
			],
		}),
	],
});
