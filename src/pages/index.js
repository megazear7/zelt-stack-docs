import { html } from 'orison';

export default context => html`
  <section>${context.mdFile('./src/partials/getting-started.md')}</section>
  <section>
    <h3>Here are some example pages</h3>
  </section>
`;
