# Angular Local Schematics

This schematic allow code generation to your
[Angular](https://angular.io) application using project-local templates.

## Versions

- support AngularCLI >= 11.2.x

## Usage

```
ng g @trash-maker/local-schematics:generate template path [options]
```

### `template`

Project path to the folder containing the schematics templates to use for generation,
if no path is found try to search for a conventional folder inside `/generators`.

### `path`

Project path where generate the code.

### `options`

A set of option values in the form:

```
--option1 value1 --option2 value2 ...
```

- Each option key must match used properties in the templates.
- numeric values are considered as `number` type
- `true` and `false` values are considered as `boolean` type
- other values are considered as `string` type
- missing values are considered as `undefined`
  > `--opt1 --opt2 true` ➡ `{ opt1: undefined, opt2: true}`
