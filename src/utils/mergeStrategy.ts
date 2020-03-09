import {
  Source,
  Rule,
  SchematicContext,
  Tree,
  forEach,
  apply,
  mergeWith
} from '@angular-devkit/schematics';

export function applyWithOverwrite(source: Source, rules: Rule[]): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const rule = mergeWith(
      apply(source, [
        ...rules,
        forEach(fileEntry => {
          if (tree.exists(fileEntry.path)) {
            tree.overwrite(fileEntry.path, fileEntry.content);
            return null;
          }
          return fileEntry;
        })
      ])
    );

    return rule(tree, _context);
  };
}
