import { normalize } from '@angular-devkit/core';
import { strings } from './strings';

export const pathToMove = (options: any) => {
  const movePath = options.flat
    ? normalize(options.path)
    : normalize(
        options.path +
          '/' +
          strings.dasherize(strings.singularize(`views/pages/${options.name}`))
      );
  return movePath;
};
