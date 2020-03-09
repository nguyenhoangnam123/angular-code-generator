import {
  Rule,
  SchematicContext,
  Tree,
  Source,
  noop,
  filter,
  template,
  move,
  url,
  chain
} from '@angular-devkit/schematics';
import { setupOptions } from '../utils/setup';
import { pathToMove } from '../utils/movePath';
import { applyWithOverwrite } from '../utils/mergeStrategy';
import { strings } from '../utils/strings';
import { Path } from '@angular-devkit/core/src/virtual-fs';
import objInterface from '../model/model';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function crud(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);

    // setup move path
    const movePath = pathToMove(options);

    let componentTemplate: Source = url('../../component/files');
    let htmlTemplate: Source = url('../../html/files');
    const moduleTemplate: Source = url('../../module/files');
    const serviceTemplate: Source = url('../../service/files');
    const modelTemplate: Source = url('../../model/files');
    const dataSourceTemplate: Source = url('../../datasource/files');

    if (options.action === 'edit') {
      componentTemplate = url('../../component/files/edit');
      htmlTemplate = url('../../html/files/edit');
    }
    if (options.action === 'detail') {
      componentTemplate = url('../../component/files/detail');
      htmlTemplate = url('../../html/files/detail');
    }
    if (options.action === 'list') {
      componentTemplate = url('../../component/files/list');
      htmlTemplate = url('../../html/files/list');
    }

    //setup json model for obj
    options.obj = objInterface ? JSON.stringify(objInterface) : options.obj;

    const moduleRule = ruleFactory(options, moduleTemplate, movePath);
    const componentRule = ruleFactory(options, componentTemplate, movePath);
    const htmlRule = ruleFactory(options, htmlTemplate, movePath);
    const serviceRule = ruleFactory(options, serviceTemplate, movePath);
    const modelRule = ruleFactory(options, modelTemplate, movePath);
    const datasourceRule = ruleFactory(options, dataSourceTemplate, movePath);

    const rule = chain([
      modelRule,
      serviceRule,
      datasourceRule,
      componentRule,
      htmlRule,
      moduleRule
    ]);

    return rule(host, context);
  };
}

function ruleFactory(options: any, source: Source, movePath: Path): Rule {
  return applyWithOverwrite(source, [
    options.spec ? noop() : filter(path => !path.endsWith('.spec.ts')),
    template({
      ...strings,
      ...options
    }),
    move(movePath)
  ]);
}
