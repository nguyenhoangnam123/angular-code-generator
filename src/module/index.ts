import {
  Rule,
  SchematicContext,
  Tree,
  filter,
  noop,
  template,
  move,
  chain,
  url
} from '@angular-devkit/schematics';
import { setupOptions } from '../utils/setup';
import { normalize } from '@angular-devkit/core';
import { strings } from '../utils/strings';
import { applyWithOverwrite } from '../utils/mergeStrategy';
import {
  findRoutingModuleFromOptions,
  addRouteToAppRoutingModule
} from '../utils/module-utils';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function module(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);

    // setup move path
    const movePath = options.flat
      ? normalize(options.path)
      : normalize(
          options.path +
            '/' +
            strings.dasherize(
              strings.singularize(`views/pages/${options.name}`)
            )
        );

    // get rule for model, apply with override if file exists
    const moduleRule = applyWithOverwrite(url('./files'), [
      options.spec ? noop() : filter(path => !path.endsWith('.spec.ts')),
      template({
        ...strings,
        ...options
      }),
      move(movePath)
    ]);

    const rule = chain([moduleRule, addToAppRouting(options)]);
    return rule(host, context);
  };
}

function addToAppRouting(options: any): Rule {
  return (host: Tree) => {
    options.module = findRoutingModuleFromOptions(host, options);
    addRouteToAppRoutingModule(host, options);
    return host;
  };
}
