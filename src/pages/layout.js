import { html } from 'orison';
import header from '../partials/header.js';
import nav from '../partials/nav.js';
import footer from '../partials/footer.js';

export default context => html`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${context.root.data.title}</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script src="/app.js"></script>
    <link rel="stylesheet" type="text/css" href="/app.css">
    <meta name="description" content="${context.root.data.description}">
    <link rel="icon" href="/logo/favicon.ico">
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="${context.root.data.primaryColor}">
    <!-- Add to homescreen for Chrome on Android. Fallback for manifest.json -->
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="application-name" content="${context.root.data.title}">

    <!-- Add to homescreen for Safari on iOS -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="${context.root.data.title}">

    <!-- Homescreen icons -->
    <link rel="apple-touch-icon" href="/logo/logo-256x256.png">
    <link rel="apple-touch-icon" sizes="512x512" href="/logo/logo-512x512.png">

    <!-- Tile icon for Windows 8 (144x144 + tile color) -->
    <meta name="msapplication-TileImage" content="/logo/logo-512x512.png">
    <meta name="msapplication-TileColor" content="${context.root.data.primaryColor}">
    <meta name="msapplication-tap-highlight" content="no">

    <!-- Default twitter cards -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:site" content="@username">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${context.root.data.shortTitle}">
    <meta property="og:site_name" content="${context.root.data.shortTitle}">
    <meta property="og:description" content="${context.root.data.description}">
    <meta property="og:image" content="/logo/logo-512x512.png" />
  </head>
  <body>
    ${header(context.root.data.title)}
    <main>
      ${context.page.html}
    </main>
    ${footer()}
  </body>
</html>
`;
