import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  schematic
} from '@angular-devkit/schematics';

export function crud(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    const modelRule = ruleFactory('model', options);
    const serviceRule = ruleFactory('service', options);
    const datasourceRule = ruleFactory('datasource', options);
    const componentRule = schematic('component', options);
    const htmlRule = schematic('html', options);
    const moduleRule = schematic('module', options);
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

function ruleFactory(schematics: string, options: any) {
  const { project, path, name, spec, flat } = options;
  return schematic(schematics, { project, path, name, spec, flat });
}
