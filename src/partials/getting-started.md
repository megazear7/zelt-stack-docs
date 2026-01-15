## Getting Started

The Zelt Stack is designed to provide a lightweight, type-safe full-stack framework for web applications, emphasizing consistency between frontend and backend through shared types, services, and utilities. It aims to simplify development by using
<a href="https://zod.dev/"><strong class="underline">Z</strong>od</a> for type definitions and run time validation,
<a href="https://expressjs.com/"><strong class="underline">E</strong>xpress</a> for the api backend,
<a href="https://lit.dev/"><strong class="underline">L</strong>it</a> for the user interface that is lightweight and close to the bare metal of the browser, and
<a href="https://www.typescriptlang.org/"><strong class="underline">T</strong>ypeScript</a> everywhere for consistency and compile time reliability.

The Zelt Stack uses Node.js for the backend and modern browsers for Lit. Ensure compatibility with Node.js 16+ and browsers supporting ES modules and web components.

## The Zelt Stack Template

The [Zelt Stack Template](https://github.com/megazear7/zelt-stack-template) uses the Zelt stack
and provides additional features like:

 - A set of shared services that define the functionality of api endpoints and are used in both the frontend and backend.
 - Types and utilities can be defined in a shared layer and used in both the frontend and backend.
 - Zod and TypeScript provides strong and strict typing that is consistent between the backend and frontend.

Choose the Zelt Stack for projects needing a minimal, customizable setup with strong TypeScript integration and shared code layers, especially for smaller to medium-sized applications where performance and simplicity are prioritized. The Zelt Stack is most effective for small to medium-scale applications, prototypes, and projects where rapid development with strong typing is valued. It may not be ideal for large-scale enterprise applications requiring heavy server-side rendering, complex state management, or extensive third-party integrations, as it focuses on simplicity and may require additional libraries for advanced features.

The Zelt Stack Template requires Node.js, npm package management, and a modern web browser.

To install and initialize a new project based on the Zelt Stack Template, you do a shallow clone of the repository,
rename the application and install the dependencies, and then you are ready to go. You can see the full steps below.

```sh
git clone --depth=1 git@github.com:megazear7/zelt-stack-template.git my-cool-project
cd my-cool-project
node rename.js my-cool-project
git init
nvm use 22
npm install
git add .
git commit -m "Init commit from the zelt template after project rename"
npm start
```

Zelt Stack Template also comes with a `cli` by default that you can customize as needed
based on the setup and initialization that your project may require.
The default cli init command asks to setup a local app config file that contains AI model connection details.
This is only suitable for local development, since the data is persisted on the local file system.
If you plan to deploy your project to the internet for others to use, you will likely need to modify or remove
the app config.

```sh
npm run build:cli
npm run init
```

## Shared

The shared layer in the zelt-stack-template acts as a central hub for code used by both the client and server, promoting consistency and reusability. It includes types, services, utilities, and prompts defined once and imported as needed, creating a unified architecture. This layer uses Zod for validation and TypeScript for strong typing, enabling smooth data flow between frontend and backend. The shared layer allows types, services, utilities, and prompts to be defined once and reused across client and server, eliminating duplication and ensuring changes in one place propagate consistently.

### Shared Types
Shared types in the zelt-stack-template define data structures and schemas with Zod for runtime validation and TypeScript type inference. Grouped by functionality in files like `type.<type-name>.ts`, they ensure client and server code work with the same validated data models. This prevents type mismatches and maintains data integrity across the stack. Zod defines schemas for runtime validation, and TypeScript infers types from these schemas, ensuring compile-time and runtime type safety across shared code. Shared types are defined once with Zod and imported into both client and server, guaranteeing identical data structures and validation. Zod provides runtime validation, which adds a small performance overhead for parsing and validating data. However, this is typically negligible for most applications and improves reliability by catching invalid data early.

```typescript
import z from "zod";

export const Health = z.object({
  healthy: z.boolean(),
});
export type Health = z.infer<typeof Health>;
```

### Shared Services
Shared services in the zelt-stack-template abstract API communication by defining routes, HTTP methods, request/response structures, and validation with Zod schemas from shared types. Implemented as classes for data fetching, they can be used by both client providers and server controllers. This abstraction simplifies API interactions and guarantees type-safe communication between frontend and backend. AbstractService provides a base for defining API routes, methods, and validation, extended by concrete services like HealthService for specific endpoints.

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

This service can easily be imported and used in the front end code under `client/` as seen below.
The service maps the function parameters of the `.fetch()` method into GET parameters and request
body parameters in the http request. 

```typescript
import { healthService } from "../shared/service.health.js"
healthService.fetch();
```

### Shared Utilities
Shared utilities in the zelt-stack-template are pure functions grouped by functionality in `util.<util-name>.ts` files. They perform common operations without side effects or environment-specific dependencies, and can be used by both client and server code. This promotes code reuse and consistency, with examples like route parameter helpers and time-related functions that work in both browser and Node.js. Shared utilities excel in cross-platform functions like time calculations or debouncing that work in both browser and Node.js. They fall short for environment-specific operations, which should use server utils instead. Shared utilities are environment-agnostic and reusable across client/server; server utils are Node.js-specific for backend operations.

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
Shared prompts in the zelt-stack-template are functions in `prompt.<prompt-name>.ts` files that return promises of chat completion message arrays for AI model interactions with OpenAI. They encapsulate prompt logic shared between client and server, ensuring consistent AI-driven features. Shared prompts generate message arrays for OpenAI API calls, ensuring consistent AI interactions shared between client and server. These prompts are templatized and flexible. Arrays and strict data structures with enums
allow for consistent function definitions that can be flexible, returning one or more templated prompts in a consistent way.

Shared prompts are suitable for applications integrating AI features, where consistent prompt logic is needed. They can be removed if AI integration is not need.

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

These prompts can then be used in flexible ways.

```typescript
const appConfig = await getAppConfig();
const messages: ChatCompletionMessageParam[] = [
  ...(await examplePrompt(bodyParams.instructions)),
  ...(await anotherExample(bodyParams.instructions)),
];
const result = await getTextCompletion<string>(messages, appConfig.model);
```

### Client Providers
Client providers in the zelt-stack-template manage data fetching and state with Lit's context system. They extend abstract providers to handle app-wide data like configuration, fetch data via shared services, and provide typed data to components through context for reactive updates. This centralizes state management and lets components focus on UI rendering. Providers fetch data via services and provide it through Lit's context system, with AppContext holding app-wide state like configuration.

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
Client pages in the zelt-stack-template are Lit components that extend providers and handle routing. They keep logic minimal, delegating UI tasks to components, and are defined in `page.<page-name>.ts` files. Registered in the routes config and app's render method, this keeps pages lightweight for dynamic navigation and data-driven rendering. Pages are Lit components registered in a routes config, rendered dynamically based on URL paths in the app's main render method. Routing is handled via Lit components and custom logic, which is flexible but may lack advanced features like nested routes or guards compared to dedicated routers like React Router. Avoid the Zelt Stack for applications needing extensive SSR or complex state management, as Lit focuses on client-side rendering and state is managed via context, which may not suffice for intricate needs without additional libraries.

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
Client components in the zelt-stack-template are reusable Lit elements in `component.<component-name>.ts` files. They consume context from providers for data, handle user interactions, and focus on UI rendering. Customizable with attributes for general use, examples include modals, toasts, and tooltips to improve the user experience. Components use Lit's context consumer to access provider data, common for displaying fetched data or handling user interactions.

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
Client styles in the zelt-stack-template use CSS variables from `static/app.css` for consistent theming without hardcoded values. Global styles live in `styles.global.ts`, and component-specific styles are embedded in component files via Lit's static styles property. This keeps the UI maintainable and easily themeable. Variables like `--color-1`, `--font-xl` are defined in `static/app.css`; customize by overriding them in component styles or a theme file. The template does not include built-in i18n support, but it can be added using libraries like `lit-translate` or custom utilities in the shared layer for managing translations.

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
Client events in the zelt-stack-template define custom event types and functions in `event.<event-name>.ts` files. Aggregated in `util.events.ts` and dispatched with a custom function, they enable decoupled communication between components—like modal interactions or navigation. This event-driven setup promotes modularity and reactive updates in the frontend. Events are custom Zod-defined objects dispatched via a utility function, enabling decoupled component communication like modal toggles.

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

The server layer in the zelt-stack-template runs on Express, handling API endpoints, data processing, and backend logic with TypeScript and shared types for validation. It processes requests via controllers, uses utilities for server-specific tasks, and integrates AI models for advanced features. This ensures secure, typed API responses and reliable data persistence. Express is flexible and lightweight, allowing custom setups, but lacks built-in features like dependency injection in NestJS. Choose Express for simplicity and control, NestJS for structured, scalable enterprise apps. The template does not include WebSocket support out of the box, but it can be added using Express-compatible libraries like `socket.io`, integrated into server controllers.

### Server Controllers
Server controllers in the zelt-stack-template extend an abstract controller class and implement handlers for API endpoints. They validate input and output with shared Zod schemas, defined in `controller.<controller-name>.ts` files, and register with the main router for Express routing. This ensures type-safe request handling and consistent API behavior. The handler validates input with shared schemas, processes logic, and returns typed responses, ensuring consistency. Input validation is handled through Zod schemas in shared types and services, ensuring data integrity. API protection relies on standard Express practices like middleware for authentication and rate limiting, which can be added as needed.

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
Server utils in the zelt-stack-template contain functions grouped by functionality in `util.<util-name>.ts` files for Node.js operations like file system interactions or model processing. Used by controllers and server code when environment-specific APIs are needed, they keep server-side logic organized and separate from shared utilities. Functions like `fileExists` use Node.js fs promises for operations like checking file presence or reading directories.

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

Data persistence in the zelt-stack-template organizes application data in a `data` directory. App data goes under `data/app/`, and specific data like books under `data/books/`, with subdirectories containing `index.json` files. Each data directory can include subfolders for related files like audio or references, managed via server-side file operations. This provides scalable, file-based storage with clear organization. Data is organized in `data/app/` and `data/books/`, with `index.json` files and subfolders for related assets, managed server-side. File-based persistence is simple and suitable for small applications but may not scale well for high-traffic sites due to file I/O limitations, lack of concurrency control, and potential performance issues with large datasets. Consider databases for larger applications.

## Development Practices

Development in the zelt-stack-template emphasizes automated tooling: `npm run fix` for linting and formatting, `npm run build` for compilation, and `npm start` for development serving. Large changes need work plans in `.github/prompts/work-plan.md` for review, with debugging relying on Chrome DevTools when necessary. This setup promotes code quality, consistency, and efficient development. `npm run fix` runs linting and formatting tools to enforce code style and catch errors, promoting consistency and reducing bugs. Document the plan in `.github/prompts/work-plan.md`, outlining steps, rationale, and potential impacts for review. The Zelt Stack enhances productivity through shared types and services, reducing boilerplate and errors, making it competitive for TypeScript-focused teams, though it may require more setup than batteries-included frameworks. Yes, it can integrate with libraries like databases (e.g., MongoDB), authentication (e.g., Passport), or UI libraries, as it's built on flexible foundations. Pitfalls include circular imports or environment mismatches; debug with Chrome DevTools and ensure shared code is truly environment-agnostic.


