# Node + Express Web Server

A small web server built with **Node.js**, **Express 5**, **TypeScript**, and
**Handlebars**. It demonstrates server-rendered pages, reusable partials,
static asset delivery, route aliases, environment variables, and custom 404
handling.

## Features

- TypeScript with native ES modules.
- Express 5 HTTP server.
- Handlebars (`hbs`) view rendering.
- Shared header, navigation, and footer partials.
- Static CSS, JavaScript, font, and image files.
- Multiple URLs for the same rendered page.
- Environment-based port configuration.
- Automatic development restarts with Nodemon.
- TypeScript execution through `tsx` without a build step.

## Requirements

- Node.js 20 or newer.
- Yarn Classic 1.x.

## Installation

Install the dependencies:

```bash
yarn install
```

Create the local environment file from the example:

```bash
cp .env.example .env
```

Set the server port in `.env`:

```env
PORT=8081
```

The `.env` file is ignored by Git. Commit `.env.example`, but do not commit
private environment files.

## Running the application

Start the development server:

```bash
yarn start
```

The script runs:

```text
nodemon --exec "node --env-file=.env --import tsx" index.ts
```

- `nodemon` watches TypeScript and JSON files and restarts after changes.
- `node --env-file=.env` loads environment variables before the application
  starts.
- `--import tsx` lets Node execute `index.ts` directly.

Open the URL printed in the terminal, normally:

```text
http://localhost:8081
```

Stop the server with `Ctrl+C`.

## Available routes

| URL | Response |
| --- | --- |
| `/`, `/home`, `/home.html`, `/index.html` | Renders `views/home.hbs` |
| `/generic`, `/generic.html` | Renders `views/generic.hbs` |
| `/elements`, `/elements.html` | Renders `views/elements.hbs` |
| `/hello-world` | Returns the plain text `hello-world` |
| Any unmatched GET URL | Returns the custom 404 page with status 404 |

The `.html` aliases are route names only. Handlebars still renders `.hbs`
templates from the `views` directory.

## Project structure

```text
.
├── index.ts                 # Express configuration and routes
├── package.json             # Scripts and dependencies
├── tsconfig.json            # TypeScript configuration
├── .env.example             # Environment variable template
├── public/                  # Files served directly by Express
│   └── assets/
│       ├── css/main.css     # Custom responsive design
│       └── js/main.js       # Navigation and copy interactions
└── views/
    ├── home.hbs
    ├── generic.hbs
    ├── elements.hbs
    └── partials/
        ├── header.hbs
        ├── navbar.hbs
        └── footer.hbs
```

## Implementation details

### Application and port

The Express application is created in `index.ts`:

```ts
const app = express();
const port = process.env.PORT;
```

`PORT` comes from `.env`. The application starts listening only after all
middleware and routes have been registered.

### Handlebars views

Handlebars is configured as the Express view engine:

```ts
app.set("view engine", "hbs");
```

Calling `res.render("home")` makes Express resolve `views/home.hbs`. Data sent
as the second argument becomes available inside the template:

```ts
res.render("home", {
  name: "Sebastian",
  title: "Node course",
});
```

The values can be printed with Handlebars expressions such as `{{title}}` and
`{{name}}`.

### Partials

Reusable template fragments are registered from `views/partials`:

```ts
hbs.registerPartials(
  path.join(import.meta.dirname, "views", "partials"),
);
```

`import.meta.dirname` is used because this project uses ES modules and does not
have the CommonJS `__dirname` global. Templates include partials with:

```hbs
{{> header}}
{{> navbar}}
{{> footer}}
```

### Static files

Express exposes the `public` directory through:

```ts
app.use(express.static("public"));
```

The directory name is omitted from public URLs. For example:

```text
public/assets/css/main.css -> /assets/css/main.css
```

Use root-relative URLs in templates so assets work from every route:

```hbs
<link rel="stylesheet" href="/assets/css/main.css" />
<script src="/assets/js/main.js"></script>
```

### Route aliases

Express accepts an array of paths. Each path must begin with `/`:

```ts
app.get(["/generic", "/generic.html"], (_req, res) => {
  res.render("generic");
});
```

This allows clean URLs while retaining `.html` compatibility.

### Custom 404 handler

The final route uses the Express 5 named wildcard syntax:

```ts
app.get("/{*splat}", (req, res) => {
  res.status(404).render("404", {
    title: "Page not found",
    name: "Sebastian",
    requestedUrl: req.originalUrl,
  });
});
```

It must remain after all other routes. The handler returns the correct HTTP
status and renders `views/404.hbs` with the URL that could not be matched.

## Adding a page

1. Create `views/about.hbs`.
2. Reuse the registered partials inside the template.
3. Add a route before the wildcard handler:

```ts
app.get(["/about", "/about.html"], (_req, res) => {
  res.render("about", {
    title: "About",
    name: "Sebastian",
  });
});
```

4. Add a root-relative navigation link:

```hbs
<a href="/about">About</a>
```

Nodemon restarts the server after the TypeScript route changes. Template edits
can normally be checked by refreshing the browser.

## Type checking

Run TypeScript without generating output:

```bash
yarn tsc --noEmit
```

The project uses strict checking, Node's `NodeNext` module resolution, and an
ES2020 compilation target.

## Notes

- `dotenv` is installed, but the current start script loads `.env` through
  Node's `--env-file` option; no `dotenv.config()` call is required.
- `ts-node` remains installed, but the current development script uses `tsx`.
- The contact form is visual only because no POST route or persistence layer is
  implemented.
- No automated tests are currently configured.

## Library references

### Runtime libraries

| Library | Purpose | Reference |
| --- | --- | --- |
| Node.js | JavaScript runtime, ES modules, `process.env`, and `--env-file` | [Node.js documentation](https://nodejs.org/docs/latest/api/) · [CLI documentation](https://nodejs.org/api/cli.html) |
| Express 5 | HTTP server, routing, responses, middleware, static files, and view rendering | [Express 5 API](https://expressjs.com/en/api/) · [Routing guide](https://expressjs.com/en/guide/routing.html) · [Static files guide](https://expressjs.com/en/starter/static-files.html) |
| Handlebars | HTML templating and reusable partials | [Handlebars guide](https://handlebarsjs.com/guide/) · [Partials](https://handlebarsjs.com/guide/partials.html) |
| `hbs` | Express view-engine adapter used to render `.hbs` files and register partial directories | [`hbs` package](https://www.npmjs.com/package/hbs) · [`hbs` repository](https://github.com/pillarjs/hbs) |
| `dotenv` | Optional `.env` file loader; installed but not called directly by the current implementation | [`dotenv` repository](https://github.com/motdotla/dotenv) · [`dotenv` package](https://www.npmjs.com/package/dotenv) |

### Development tools

| Tool | Purpose | Reference |
| --- | --- | --- |
| TypeScript | Static type checking and `NodeNext` module configuration | [TypeScript documentation](https://www.typescriptlang.org/docs/) · [TSConfig reference](https://www.typescriptlang.org/tsconfig/) |
| `tsx` | Executes TypeScript directly in Node.js during development | [`tsx` documentation](https://tsx.is/) · [`tsx` package](https://www.npmjs.com/package/tsx) |
| Nodemon | Watches project files and restarts the server after changes | [Nodemon documentation](https://github.com/remy/nodemon#readme) · [`nodemon` package](https://www.npmjs.com/package/nodemon) |
| Yarn Classic | Installs dependencies and runs project scripts | [Yarn Classic CLI](https://classic.yarnpkg.com/en/docs/cli/) · [`yarn install`](https://classic.yarnpkg.com/en/docs/cli/install) |
| `ts-node` | Alternative TypeScript executor; installed but replaced by `tsx` in the current start script | [`ts-node` documentation](https://typestrong.org/ts-node/) · [`ts-node` package](https://www.npmjs.com/package/ts-node) |

### Type definitions

The project uses the DefinitelyTyped packages
[`@types/node`](https://www.npmjs.com/package/@types/node),
[`@types/express`](https://www.npmjs.com/package/@types/express), and
[`@types/hbs`](https://www.npmjs.com/package/@types/hbs) to provide TypeScript
declarations for Node.js and third-party libraries.

## License and template credits

The project package is licensed under ISC. The current interface is a custom
design created for this Node.js course project.
