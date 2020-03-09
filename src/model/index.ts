import {
  Rule,
  SchematicContext,
  Tree,
  noop,
  filter,
  template,
  move,
  chain,
  url
} from '@angular-devkit/schematics';
import { normalize } from '@angular-devkit/core';
import { strings } from '../utils/strings';
import objInterface from './model';
import { applyWithOverwrite } from '../utils/mergeStrategy';
import { setupOptions } from '../utils/setup';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function model(options: any): Rule {
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

    //setup json model for obj
    options.obj = objInterface ? JSON.stringify(objInterface) : options.obj;

    // get rule for model, apply with override if file exists
    const modelRule = applyWithOverwrite(url('./files'), [
      options.spec ? noop() : filter(path => !path.endsWith('.spec.ts')),
      template({
        ...strings,
        ...options
      }),
      move(movePath)
    ]);

    const rule = chain([modelRule]);
    return rule(host, context);
  };
}
