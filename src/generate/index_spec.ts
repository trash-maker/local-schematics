import {
  SchematicTestRunner,
  UnitTestTree,
} from "@angular-devkit/schematics/testing";
import {
  Schema as ApplicationOptions,
  Style,
} from "@schematics/angular/application/schema";
import { Schema as WorkspaceOptions } from "@schematics/angular/workspace/schema";

describe("generate", () => {
  const schematicRunner = new SchematicTestRunner(
    "generate",
    require.resolve("../collection.json")
  );

  const workspaceOptions: WorkspaceOptions = {
    name: "workspace",
    newProjectRoot: "projects",
    version: "6.0.0",
  };

  const appOptions: ApplicationOptions = {
    name: "bar",
    projectRoot: "",
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    style: Style.Css,
    skipTests: false,
    skipPackageJson: false,
  };

  const defaultOptions = {
    project: "bar",
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await schematicRunner
      .runExternalSchematicAsync(
        "@schematics/angular",
        "workspace",
        workspaceOptions
      )
      .toPromise();
    appTree = await schematicRunner
      .runExternalSchematicAsync(
        "@schematics/angular",
        "application",
        appOptions,
        appTree
      )
      .toPromise();
  });

  it("works", async () => {
    appTree.create(
      "/template/sample/__name__/__name__.txt.template",
      "Hello <%= name %>"
    );
    const options = {
      ...defaultOptions,
      template: "/template/sample",
      name: "foo",
    };
    const tree = await schematicRunner
      .runSchematicAsync("generate", options, appTree)
      .toPromise();

    expect(tree.files).toContain("/src/app/foo/foo.txt");
    expect(tree.readContent("/src/app/foo/foo.txt")).toBe("Hello foo");
  });

  it("fails missing templates", async () => {
    const options = {
      ...defaultOptions,
      template: "/template/sample",
      name: "foo",
    };
    let thrownError: Error | null = null;
    try {
      await schematicRunner
        .runSchematicAsync("generate", options, appTree)
        .toPromise();
    } catch (err) {
      thrownError = err;
    }
    expect(thrownError).toBeDefined();
  });
});
