import { normalize, strings } from "@angular-devkit/core";
import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
} from "@angular-devkit/schematics";
import { parseName } from "@schematics/angular/utility/parse-name";
import {
  buildDefaultPath,
  getWorkspace,
} from "@schematics/angular/utility/workspace";
import { parseOptional, fromPath } from "./utils";

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function generate(options: any): Rule {
  return async (host: Tree, _context: SchematicContext) => {
    const workspace = await getWorkspace(host);
    const project = workspace.projects.get(options.project as string);

    if (options.path === undefined && project) {
      options.path = buildDefaultPath(project);
    }

    options.template = normalize(options.template);

    const parsedPath = parseName(options.path as string, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    const optionalOptions = parseOptional(options);

    const source =
      fromPath(host, options.template) ||
      fromPath(host, normalize("/generators/" + options.template));
    if (source === null) {
      throw new SchematicsException(
        `❌ No templates to scaffold found in '${options.template}'`
      );
    }
    const templateSource = apply(source, [
      applyTemplates({
        ...strings,
        ...optionalOptions,
        ...options,
      }),
      move(parsedPath.path),
    ]);

    return chain([mergeWith(templateSource)]);
  };
}
