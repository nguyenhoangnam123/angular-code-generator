import { normalize } from '@angular-devkit/core';
import { strings } from './strings';

export const pathToMove = (options: any) => {
  let direction = strings.dasherize(
    strings.singularize(`views/pages/${options.name}`)
  );
  if (options.action === 'edit') {
    direction = `${direction}/${strings.singularize(options.name)}-edit`;
  }
  if (options.action === 'detail') {
    direction = `${direction}/${strings.singularize(options.name)}-detail`;
  }
  const movePath = options.flat
    ? normalize(options.path)
    : normalize(options.path + '/' + direction);
  return movePath;
};
