import {
  Rule,
  SchematicContext,
  Tree,
  url,
  template,
  noop,
  filter,
  move,
  chain
} from '@angular-devkit/schematics';
import { setupOptions } from '../utils/setup';
import { pathToMove } from '../utils/movePath';
import { applyWithOverwrite } from '../utils/mergeStrategy';
import { strings } from '../utils/strings';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function datasource(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);

    // setup move path
    const movePath = pathToMove(options);
    const datasourceRule = applyWithOverwrite(url('./files'), [
      options.spec ? noop() : filter(path => !path.endsWith('.spec.ts')),
      template({
        ...strings,
        ...options
      }),
      move(movePath)
    ]);

    const rule = chain([datasourceRule]);
    return rule(host, context);
  };
}
