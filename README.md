# vue-geometry

This library provides geometric primitives wrapping the excellent geometry
library [flatten-js](https://github.com/alexbol99/flatten-js). It adds support
for objects living in different (Cartesian) coordinate systems.

The principal use case is defining objects in an ideal positive coordinate
system, i.e., y coordinates grow going North, and transforming these
coordinates into a negative coordinate system, i.e., y coordinates grow going
South.

This library also provides some Vue components to work with such coordinate
systems such as a pan-and-zoom component.

## Project Setup

```sh
yarn
```

### Compile and Hot-Reload Demo Application for Development

```sh
yarn dev
```

### Type-Check, Compile and Minify for Production

```sh
yarn build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
yarn test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
yarn lint
```
