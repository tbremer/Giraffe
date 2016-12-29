import { readFileSync as readFile } from 'fs';
import { resolve } from 'path';

export default function clean() {
  return ({
    name: 'Clean',
    banner() {
      const { name, version, author, homepage } = JSON.parse(readFile(resolve(process.env.PWD, 'package.json')));

      return `/**
 * Module: ${name}
 * Version: ${version}
 * By: ${author}
 * URL: ${homepage}
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
