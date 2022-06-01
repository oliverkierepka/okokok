# OKOKOK Designsystem (NX Monorepo)

This monorepo is the home of the okokok designsystem.
It contains okokok elements – the component library for okokok, the okokok icon library, themes ("okokok" is the default theme for elements) and designtokens which contain all the colors, sizes, fonts, icons, etc. that are used throughout the whole okokok ecosystem.

-   [OKOKOK Designsystem Monorepo](#okokok-designsystem-monorepo)
    -   [Development workflow](#development-workflow)
        -   [Creating new components](#creating-new-components)
    -   [Quick Start & Documentation](#quick-start--documentation)
    -   [Generate a new application](#generate-a-new-application)
    -   [Generate a new library](#generate-a-new-library)
    -   [Development server](#development-server)
    -   [Code scaffolding](#code-scaffolding)
    -   [Build](#build)
    -   [Running unit tests](#running-unit-tests)
    -   [Running end-to-end tests](#running-end-to-end-tests)
    -   [Understand your workspace](#understand-your-workspace)
    -   [Further help](#further-help)

## Development workflow

The app documenting all libraries is hosted under /src/app/designsystem
The component library called @okokok/elements is hosted under /src/libs/elements.

1. Run <code>nx serve</code> to start the development server serving the default project which is <code>designsystem</code>. Navigate to http://localhost:4200
2. Make some changes to an existing component
3. See the design system automatically reflect your changes.
4. Commit your changes

### Creating new components

To create a new component run <code>nx g component [componentname] --project=@okokok/components --export</code>. The new component is scaffoled into the folder <code>/src/lib/components</code>.

## Quick Start & Documentation

[Nx Documentation](https://nx.dev/angular)

[10-minute video showing all Nx features](https://nx.dev/getting-started/intro)

[Interactive Tutorial](https://nx.dev/tutorial/01-create-application)

## Generate a new application

Run `ng g @nrwl/angular:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a new library

Run `ng g @nrwl/angular:lib my-lib` to generate a library.

`nx g lib --importPath=@okokok/mylib --name=mylib --tags=scope:mylib`

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@okokok/mylib`.

## Development server

Run `ng serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng g component my-component --project=my-app` to generate a new component. The new app will be scaffoled in the <code>/src/app</code> folder.

## Build

Run `ng build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev/angular) to learn more.

This project was generated using [Nx](https://nx.dev).

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Smart, Fast and Extensible Build System**
