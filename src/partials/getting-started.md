## Getting Started

The Zelt Stack includes
<a href="https://zod.dev/"><strong class="underline">Z</strong>od</a> for type definitions and run time validation,
<a href="https://expressjs.com/"><strong class="underline">E</strong>xpress</a> for the api backend,
<a href="https://lit.dev/"><strong class="underline">L</strong>it</a> for the user interface that is lightweight and close to the bare metal of the browser,
<a href="https://www.typescriptlang.org/"><strong class="underline">T</strong>ypeScript</a> everywhere for consistency and compile time reliability.


## The Zelt Stack Template

The [Zelt Stack Template](https://github.com/megazear7/zelt-stack-template) uses the Zelt stack
and provides additional features like:

 - A shared layer that provides types, validators, services, and utilities 

 - Types, services, and utilities can be defined in a shared layer and used in both the frontend and backend.
 - Zod and TypeScript provides strong and strict typing that is consistent between the backend and frontend.

## Shared

The shared layer in the zelt-stack-template acts as a central hub for code used by both the client and server, promoting consistency and reusability. It includes types, services, utilities, and prompts defined once and imported as needed, creating a unified architecture. This layer uses Zod for validation and TypeScript for strong typing, enabling smooth data flow between frontend and backend.

### Shared Types
Shared types in the zelt-stack-template define data structures and schemas with Zod for runtime validation and TypeScript type inference. Grouped by functionality in files like `type.<type-name>.ts`, they ensure client and server code work with the same validated data models. This prevents type mismatches and maintains data integrity across the stack.

```typescript
import z from "zod";

export const Health = z.object({
  healthy: z.boolean(),
});
export type Health = z.infer<typeof Health>;
```

### Shared Services
Shared services in the zelt-stack-template abstract API communication by defining routes, HTTP methods, request/response structures, and validation with Zod schemas from shared types. Implemented as classes for data fetching, they can be used by both client providers and server controllers. This abstraction simplifies API interactions and guarantees type-safe communication between frontend and backend.

```typescript
import { AbstractService, NoBodyParams, NoPathParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { Health } from "./type.health.js";

export class HealthService extends AbstractService<NoBodyParams, NoPathParams, Health> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.get;
  readonly path = "/api/health";
}

export const healthService = new HealthService(NoBodyParams, NoPathParams, Health);
```

### Shared Utilities
Shared utilities in the zelt-stack-template are pure functions grouped by functionality in `util.<util-name>.ts` files. They perform common operations without side effects or environment-specific dependencies, and can be used by both client and server code. This promotes code reuse and consistency, with examples like route parameter helpers and time-related functions that work in both browser and Node.js.

```typescript
export const ONE_SECOND_IN_MS = 1000;
export const ONE_MINUTE_IN_MS = 60 * ONE_SECOND_IN_MS;
export const ONE_HOUR_IN_MS = 60 * ONE_MINUTE_IN_MS;
export const ONE_DAY_IN_MS = 24 * ONE_HOUR_IN_MS;
export const ONE_WEEK_IN_MS = 7 * ONE_DAY_IN_MS;
export const STANDARD_DEBOUNCE_DURATION = 1 * ONE_SECOND_IN_MS;
export const STANDARD_FORCE_DURATION = 10 * ONE_SECOND_IN_MS;
export const ANIMATION_SPEED_IN_MS = 350;
```

### Shared Prompts
Shared prompts in the zelt-stack-template are functions in `prompt.<prompt-name>.ts` files that return promises of chat completion message arrays for AI model interactions with OpenAI. They encapsulate prompt logic shared between client and server, ensuring consistent AI-driven features. This enables reusable prompt templates that integrate smoothly with the app's AI capabilities.

```typescript
import { ChatCompletionMessageParam } from "openai/resources";
import { MessageType } from "../shared/type.model.js";

export const examplePrompt = async (instructions: string): Promise<ChatCompletionMessageParam[]> => {
  return [
    {
      role: MessageType.enum.user,
      content: "Say hello to the world.",
    },
    {
      role: MessageType.enum.user,
      content: `Please follow these instructions: ${instructions}`,
    },
  ];
};
```

### Client Providers
Client providers in the zelt-stack-template manage data fetching and state with Lit's context system. They extend abstract providers to handle app-wide data like configuration, fetch data via shared services, and provide typed data to components through context for reactive updates. This centralizes state management and lets components focus on UI rendering.

```typescript
import { provide } from "@lit/context";
import { property } from "lit/decorators.js";
import { AppContext, appContext } from "./context.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { getAppConfigService } from "../shared/service.get-app-config.js";
import { ZeltTemplateAbstractProvider } from "./provider.abstract.js";

export abstract class ZeltTemplateAppProvider extends ZeltTemplateAbstractProvider {
  @provide({ context: appContext })
  @property({ attribute: false })
  appContext: AppContext = {
    status: LoadingStatus.enum.idle,
  };

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();
    this.load();
  }

  async load(): Promise<void> {
    this.appContext = {
      app: await getAppConfigService.fetch(),
      status: LoadingStatus.enum.success,
    };
  }
}
```

### Client Pages
Client pages in the zelt-stack-template are Lit components that extend providers and handle routing. They keep logic minimal, delegating UI tasks to components, and are defined in `page.<page-name>.ts` files. Registered in the routes config and app's render method, this keeps pages lightweight for dynamic navigation and data-driven rendering.

```typescript
import { css, html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";
import { ZeltTemplateAppProvider } from "./provider.app.js";

@customElement("zelt-template-home-page")
export class ZeltTemplateHomePage extends ZeltTemplateAppProvider {
  static override styles = [
    globalStyles,
    css`
      main {
        text-align: center;
      }
    `,
  ];

  override render(): TemplateResult {
    return html`
      <main>
        <img src="/logo/logo-512x512.png" alt="Zelt Stack Logo" width="200" />
        <h1>Welcome to the Zelt Stack Template!</h1>
        <p>This is a template project to help you get started with Zelt Stack.</p>
        <p><a href="/example/123" class="standalone">Go to Example Page</a></p>
        <p><a href="https://zelt.alexlockhart.me" class="standalone">Read more in the documentation</a></p>
      </main>
    `;
  }
}
```

### Client Components
Client components in the zelt-stack-template are reusable Lit elements in `component.<component-name>.ts` files. They consume context from providers for data, handle user interactions, and focus on UI rendering. Customizable with attributes for general use, examples include modals, toasts, and tooltips to improve the user experience.

```typescript
import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";
import { xIcon } from "./icons.js";

@customElement("zelt-template-toast")
export class ZeltTemplateToast extends LitElement {
  static override styles = [
    globalStyles,
    css`
      :host {
        padding: var(--size-medium);
        border-radius: var(--radius-medium);
        box-shadow: var(--shadow-active);
        color: var(--color-primary-text);
        font-size: var(--font-medium);
      }
    `,
  ];

  @property({ type: String })
  message = "";

  @property({ type: String, reflect: true })
  type = "info";

  @property({ type: Boolean, reflect: true })
  visible = false;

  override render(): TemplateResult {
    return html`
      <div class="toast-content">
        <div>${this.message}</div>
        <button class="close-button" @click=${this.handleClose}>${xIcon}</button>
      </div>
    `;
  }

  private handleClose(): void {
    this.visible = false;
    this.dispatchEvent(new CustomEvent("close"));
  }
}
```

### Client Styles
Client styles in the zelt-stack-template use CSS variables from `static/app.css` for consistent theming without hardcoded values. Global styles live in `styles.global.ts`, and component-specific styles are embedded in component files via Lit's static styles property. This keeps the UI maintainable and easily themeable.

```typescript
import { css } from "lit";

export const globalStyles = css`
  h1 {
    font-size: var(--font-xl);
    margin-bottom: 1rem;
  }

  h2 {
    font-size: var(--font-large);
    margin-bottom: 0.75rem;
  }

  p {
    font-size: var(--font-medium);
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  a {
    color: var(--color-2);
    text-decoration: none;
    transition: var(--transition-all);
    display: inline-flex;
    align-items: center;
  }

  a:hover {
    color: var(--color-1);
  }
`;
```

### Client Events
Client events in the zelt-stack-template define custom event types and functions in `event.<event-name>.ts` files. Aggregated in `util.events.ts` and dispatched with a custom function, they enable decoupled communication between components—like modal interactions or navigation. This event-driven setup promotes modularity and reactive updates in the frontend.

```typescript
import z from "zod";

export const ModelOpeningEventName = z.literal("ModelOpening");
export type ModelOpeningEventName = z.infer<typeof ModelOpeningEventName>;

export const ModelOpeningEventDetail = z.object({});
export type ModelOpeningEventDetail = z.infer<typeof ModelOpeningEventDetail>;

export const ModelOpeningEventData = z.object({
  name: ModelOpeningEventName,
  detail: ModelOpeningEventDetail,
});
export type ModelOpeningEventData = z.infer<typeof ModelOpeningEventData>;

export const ModelOpeningEvent = (): ModelOpeningEventData => ({
  name: ModelOpeningEventName.value,
  detail: {},
});
```

## Server

The server layer in the zelt-stack-template runs on Express, handling API endpoints, data processing, and backend logic with TypeScript and shared types for validation. It processes requests via controllers, uses utilities for server-specific tasks, and integrates AI models for advanced features. This ensures secure, typed API responses and reliable data persistence.

### Server Controllers
Server controllers in the zelt-stack-template extend an abstract controller class and implement handlers for API endpoints. They validate input and output with shared Zod schemas, defined in `controller.<controller-name>.ts` files, and register with the main router for Express routing. This ensures type-safe request handling and consistent API behavior.

```typescript
import { NoBodyParams, NoPathParams } from "../shared/main.service.js";
import { healthService } from "../shared/service.health.js";
import { Health } from "../shared/type.health.js";
import { AbstractController } from "./main.controller.js";

export class HealthController extends AbstractController<NoBodyParams, NoPathParams, Health> {
  async handler(): Promise<Health> {
    return { healthy: true };
  }
}

export const healthController = new HealthController(healthService);
```

### Server Utils
Server utils in the zelt-stack-template contain functions grouped by functionality in `util.<util-name>.ts` files for Node.js operations like file system interactions or model processing. Used by controllers and server code when environment-specific APIs are needed, they keep server-side logic organized and separate from shared utilities.

```typescript
import { promises as fs } from "fs";

export async function fileExists(path: string): Promise<boolean> {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
}
```

## Data Persistence

Data persistence in the zelt-stack-template organizes application data in a `data` directory. App data goes under `data/app/`, and specific data like books under `data/books/`, with subdirectories containing `index.json` files. Each data directory can include subfolders for related files like audio or references, managed via server-side file operations. This provides scalable, file-based storage with clear organization.

## Development Practices

Development in the zelt-stack-template emphasizes automated tooling: `npm run fix` for linting and formatting, `npm run build` for compilation, and `npm start` for development serving. Large changes need work plans in `.github/prompts/work-plan.md` for review, with debugging relying on Chrome DevTools when necessary. This setup promotes code quality, consistency, and efficient development.
