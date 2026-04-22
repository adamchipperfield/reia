# Styling (CSS)

## Global styles

All global stylesheets and CSS custom properties are included through the [theme-styles.liquid](/snippets/theme-styles.liquid) snippet.

For better performance, add all base styles to [base.css](/assets/base.css). Layout styles are written in [layout.css](/assets/layout.css), including the container and grid classes.

## Component styles

Any component specific styles should be defined in a [`{% stylesheet %}`](https://shopify.dev/docs/api/liquid/tags/stylesheet) tag inside the component's snippet or section file. See [Shopify's documentation](https://shopify.dev/docs/storefronts/themes/best-practices/javascript-and-stylesheet-tags#stylesheet) on how this tag is loaded.

## Scaled spacing and font sizes

Scaled spacing and font size values are defined using the _--spacing-\*_ and _--font-size-\*_ custom properties. These are based on the [Carbon Design System](https://carbondesignsystem.com/):

- [Spacing scale](https://carbondesignsystem.com/elements/spacing/overview/#spacing-scale)
- [Typography scale](https://carbondesignsystem.com/elements/typography/overview/#scale)

The properties are named based on their pixel values (based on a 16px base). For example, `--spacing-12` means 12px.

> _These properties provide a consistent starting point for spacing and typography throughout the theme. However, they are optional and unique inline values can be used where required._
