import {
  Rule,
  SchematicContext,
  Tree,
  url,
  noop,
  filter,
  template,
  move
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { Schema } from './schema';
import { setupOptions } from '../utils/setup';
import { applyWithOverwrite } from '../utils/mergeStrategy';
import { pathToMove } from '../utils/movePath';

export function service(options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    // setup options for tree, return tree
    setupOptions(tree, options);
    // setup move path
    const movePath = pathToMove(options);
    // template source, inject template options including strings helpers and then move to movePath
    const rule = applyWithOverwrite(url('./files'), [
      options.spec ? noop() : filter(path => !path.endsWith('.spec.ts')),
      template({
        ...strings,
        ...options
      }),
      move(movePath)
    ]);
    // setup merge rule then return it
    return rule(tree, _context);
  };
}
