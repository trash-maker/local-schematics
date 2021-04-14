import { Tree, Source, source } from "@angular-devkit/schematics";

/**
 * Define a source returning files under the given host path
 *
 * @param host
 * @param path
 * @returns the source
 */
export function fromPath(host: Tree, path: string): Source | null {
  const tree = Tree.empty();
  const dir = host.getDir(path);
  let count = 0;
  dir.visit((filePath, file) => {
    tree.create(filePath.substr(dir.path.length), file?.content as Buffer);
    count++;
  });
  return count > 0 ? source(tree) : null;
}

/**
 * Check given value for leading '--'
 *
 * @param value
 * @returns `true` if `value` has leading dashes, `false` otherwise
 */
function leadingDashes(value: string): boolean {
  return value != null && value != undefined && value.startsWith("--");
}

/**
 * Collect "additional" options in a key-value map fashion.
 *
 * Attempt to parse `number` and `boolean` values
 *
 * Consider "additional" options in the following form:
 *   - option keys has 2 leading dashes (`--`)
 *   - option key without corresponding value have `null` value
 * ```
 * > ng g collection:schematic --option-1-key option-1-value --option-null-value --option-2-key option-2-value
 * ```
 *
 * @param options the schematics options
 * @returns a key-value map containing parsed `options['--']` values
 */
export function parseOptional(options: any): any {
  let args: string[] = options["--"] || [];
  let arg;
  const optionals: any = {};
  while ((arg = args.shift())) {
    if (leadingDashes(arg)) {
      const argValue: string = (args[0] == null || leadingDashes(args[0])
        ? null
        : args[0]) as string;
      switch (true) {
        case argValue === null:
          optionals[arg.substr(2)] = argValue;
          break;
        case /^(true|false)$/.test(argValue):
        case /^[0-9]+$/.test(argValue):
        case /^"[^"]*"$/.test(argValue):
          optionals[arg.substr(2)] = eval(argValue);
          break;
        default:
          optionals[arg.substr(2)] = argValue;
      }
    } else {
      // skipped
    }
  }
  return optionals;
}
