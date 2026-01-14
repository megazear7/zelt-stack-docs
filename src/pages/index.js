import { html } from 'orison';

export default context => html`
  <section>${context.mdFile('./src/partials/getting-started.md')}</section>
`;
