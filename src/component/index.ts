import {
  Rule,
  SchematicContext,
  Tree,
  noop,
  filter,
  move,
  template,
  chain,
  url,
  Source
} from '@angular-devkit/schematics';
import { setupOptions } from '../utils/setup';
import { pathToMove } from '../utils/movePath';
import { applyWithOverwrite } from '../utils/mergeStrategy';
import { strings } from '../utils/strings';
import objInterface from '../model/model';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function component(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);
    // setup move path
    const movePath = pathToMove(options);
    //setup json model for obj
    options.obj = objInterface ? JSON.stringify(objInterface) : options.obj;

    const ruleList: Rule[] = [];
    const { name, path, flat } = options;
    const detailRule: Rule = ruleFactory(
      url('./files/detail'),
      options,
      pathToMove({ name, path, flat, action: 'detail' })
    );
    const editRule: Rule = ruleFactory(
      url('./files/edit'),
      options,
      pathToMove({ name, path, flat, action: 'edit' })
    );
    const listRule: Rule = ruleFactory(url('./files/list'), options, movePath);

    switch (options.action) {
      case 'edit': {
        ruleList.push(editRule);
        break;
      }
      case 'list': {
        ruleList.push(listRule);
        break;
      }
      case 'detail': {
        ruleList.push(detailRule);
        break;
      }
      case 'all': {
        ruleList.push(listRule);
        ruleList.push(detailRule);
        ruleList.push(editRule);
        break;
      }
      default: {
        ruleList.push(listRule);
        break;
      }
    }

    const rule = chain(ruleList);
    return rule(host, context);
  };
}

function ruleFactory(source: Source, options: any, movePath: string): Rule {
  return applyWithOverwrite(source, [
    options.spec ? noop() : filter(path => !path.endsWith('.spec.ts')),
    template({
      ...strings,
      ...options
    }),
    move(movePath)
  ]);
}
