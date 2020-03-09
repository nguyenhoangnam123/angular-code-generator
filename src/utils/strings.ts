import * as stringUtil from '@angular-devkit/core';
import * as pluralUtil from 'pluralize';

function classify(value: string): string {
  return stringUtil.strings.classify(value);
}

function dasherize(value: string): string {
  return stringUtil.strings.dasherize(value);
}

function camelize(value: string): string {
  return stringUtil.strings.camelize(value);
}

function capitalize(value: string): string {
  return stringUtil.strings.capitalize(value);
}

function decamelize(value: string): string {
  return stringUtil.strings.decamelize(value);
}

function underscore(value: string): string {
  return stringUtil.strings.underscore(value);
}

function pluralize(value: string): string {
  return pluralUtil.plural(value);
}

function singularize(value: string): string {
  return pluralUtil.singular(value);
}

function absolutePath(value: string): string {
  const index = /[a-z]/i.exec(value).index;
  if (index >= 1) {
    return value.substr(index);
  }
  return value;
}

function absoluteSrcPath(value: string): string {
  const index = value.indexOf('src');
  if (index >= 1) {
    return value.substr(index);
  }
  return value;
}

export const strings = {
  classify,
  dasherize,
  camelize,
  capitalize,
  decamelize,
  underscore,
  pluralize,
  singularize,
  absolutePath,
  absoluteSrcPath
};
