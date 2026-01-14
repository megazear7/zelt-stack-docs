## Getting Started

The Zelt Stack is
<strong class="underline">Z</strong>od for type definitions and run time validation,
<strong class="underline">E</strong>xpress for the api backend,
<strong class="underline">L</strong>it for the user interface that is lightweight and close to the bare metal of the browser,
<strong class="underline">T</strong>ypeScript everywhere for consistency and compile time reliability.


## The Zelt Stack Template

The [Zelt Stack Template](https://github.com/megazear7/zelt-stack-template) uses the Zelt stack
and provides additional features like:

 - A shared layer that provides types, validators, services, and utilities 

 - Types, services, and utilities can be defined in a shared layer and used in both the frontend and backend.
 - Zod and TypeScript provides strong and strict typing that is consistent between the backend and frontend.

## Shared

The Shared layer in the zelt-stack-template serves as a central hub for code that can be utilized by both the client and server sides, ensuring consistency and reusability across the application. It includes types, services, utilities, and prompts that are defined once and imported wherever needed, promoting a unified architecture. This layer leverages Zod for validation and TypeScript for strong typing, allowing seamless data flow between frontend and backend.

### Shared Types
Shared Types in the zelt-stack-template define the data structures and schemas using Zod, which are used for runtime validation and TypeScript type inference throughout the application. They are grouped by functionality and stored in files like `type.<type-name>.ts`, ensuring that both client and server code operate with the same validated data models. This approach prevents type mismatches and enforces data integrity across the stack.

```typescript
import z from "zod";

export const Health = z.object({
  healthy: z.boolean(),
});
export type Health = z.infer<typeof Health>;
```

### Shared Services
Shared Services in the zelt-stack-template abstract API communication by defining routes, HTTP methods, request/response structures, and validation using Zod schemas from shared types. They handle data fetching and are implemented as classes that can be instantiated and used by both client providers and server controllers. This abstraction simplifies API interactions and ensures type-safe communication between frontend and backend.

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
Shared Utilities in the zelt-stack-template consist of pure functions grouped by functionality, stored in `util.<util-name>.ts` files, that perform common operations without side effects or reliance on environment-specific APIs. They can be imported and used by both client and server code, promoting code reuse and maintaining consistency. Examples include route parameter utilities and time-related functions that work in both browser and Node.js environments.

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
Shared Prompts in the zelt-stack-template are functions defined in `prompt.<prompt-name>.ts` files that return promises of chat completion message arrays, likely for AI model interactions using OpenAI. They encapsulate prompt logic that can be shared between client and server, ensuring consistent AI-driven features. This allows for reusable prompt templates that integrate seamlessly with the application's AI capabilities.

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
Client Providers in the zelt-stack-template manage data fetching and state using Lit's context system, extending abstract providers to handle application-wide data like app configuration. They fetch data via shared services and provide typed data to components through context, ensuring reactive updates. This pattern centralizes state management and keeps components focused on UI rendering.

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
Client Pages in the zelt-stack-template are Lit components that extend providers and handle routing, with minimal logic delegated to components for UI capabilities. They are defined in `page.<page-name>.ts` files and are registered in the routes configuration and app's render method. This structure keeps pages lightweight while enabling dynamic navigation and data-driven rendering.

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
Client Components in the zelt-stack-template are reusable Lit elements defined in `component.<component-name>.ts` files that consume context from providers for data and handle user interactions. They focus on UI rendering and can be customized with attributes for general-purpose use. Examples include modals, toasts, and tooltips that enhance the user experience.

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

### Client styles
Client styles in the zelt-stack-template use CSS variables defined in `static/app.css` for consistent theming, avoiding hardcoded values. Global styles are managed in `styles.global.ts`, while component-specific styles are embedded within component files using Lit's static styles property. This approach ensures maintainable, themeable UI across the application.

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
Client Events in the zelt-stack-template define custom event types and functions in `event.<event-name>.ts` files, which are aggregated in `util.events.ts` and dispatched using a custom dispatch function. They enable decoupled communication between components, such as modal interactions or navigation events. This event-driven architecture promotes modularity and reactive updates in the frontend.

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

The Server layer in the zelt-stack-template runs on Express and handles API endpoints, data processing, and backend logic using TypeScript and shared types for validation. It processes requests through controllers, utilizes utilities for server-specific operations, and integrates with AI models for advanced features. This layer ensures secure, typed API responses and data persistence.

### Server Controllers
Server Controllers in the zelt-stack-template extend an abstract controller class and implement handlers for API endpoints, validating input and output using shared Zod schemas. They are defined in `controller.<controller-name>.ts` files and registered in the main router for Express routing. This structure ensures type-safe request handling and consistent API behavior.

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
Server Utils in the zelt-stack-template contain functions grouped by functionality in `util.<util-name>.ts` files, specifically for Node.js operations like file system interactions or model processing. They are used by controllers and other server code when environment-specific APIs are required. This keeps server-side logic organized and separate from shared utilities.

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

Data Persistence in the zelt-stack-template organizes all application data in a `data` directory, with app data under `data/app/` and book data under `data/books/` in subdirectories with `index.json` files. Each book directory includes audio and references subfolders for related files, all managed through server-side file operations. This structure ensures scalable, file-based data storage with clear organization.

## Development Practices

Development Practices in the zelt-stack-template emphasize automated tooling with `npm run fix` for linting and formatting, `npm run build` for compilation, and `npm start` for development serving. Large changes require work plans in `.github/prompts/work-plan.md` for review, and debugging uses Chrome DevTools sparingly. This workflow promotes code quality, consistency, and efficient development cycles.
