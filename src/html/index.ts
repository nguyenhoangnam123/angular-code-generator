import {
  Rule,
  SchematicContext,
  Tree,
  noop,
  filter,
  template,
  move,
  url,
  chain,
  Source
} from '@angular-devkit/schematics';
import { setupOptions } from '../utils/setup';
import { pathToMove } from '../utils/movePath';
import { applyWithOverwrite } from '../utils/mergeStrategy';
import { strings } from '../utils/strings';
import objInterface from '../model/model';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function html(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);

    // setup move path
    const movePath = pathToMove(options);

    let source: Source = url('./files');
    if (options.action === 'edit') {
      source = url('./files/edit');
    }
    if (options.action === 'detail') {
      source = url('./files/detail');
    }
    if (options.action === 'list') {
      source = url('./files/list');
    }

    //setup json model for obj
    options.obj = objInterface ? JSON.stringify(objInterface) : options.obj;

    // get rule for model, apply with override if file exists
    const modelRule = applyWithOverwrite(source, [
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
