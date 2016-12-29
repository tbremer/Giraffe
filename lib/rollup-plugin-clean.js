import { readFileSync as readFile } from 'fs';
import { resolve } from 'path';

export default function clean() {
  return ({
    name: 'Clean',
    banner() {
      const pkg = JSON.parse(readFile(resolve(process.env.PWD, 'package.json')));

      return `/**
 * Module: ${pkg.name}
 * Version: ${pkg.version}
 * By: ${pkg.author}
 * URL: ${pkg.homepage}
 */
`;
    },
    transformBundle(source) {
      let code = String(source);

      code = code.replace(/\r?\n{2,}/g, '\n\n');

      return ({ code });
    }
  });
}
