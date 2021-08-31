import * as fs from 'fs';
import * as path from 'path';
import { PostInfo } from './types';
// @ts-ignore
const marked = require('marked');

import { markedCustomRender } from './marked_custom_render';

const postDir = path.join(__dirname, '../post/');
const renderer = markedCustomRender();

export const getPostInfo = function ({
  fileName,
  withHtml,
}: {
  fileName: string;
  withHtml: boolean;
}): Promise<PostInfo> {
  return new Promise((resolve, reject) => {
    fs.readFile(postDir + fileName, 'utf-8', (err, md) => {
      if (err) return reject(err);

      const h1 = md.match(/^#\s.+\n/);
      const postTitle = h1 ? h1[0].match(/[^#\n]+/) : null;
      const title = postTitle ? postTitle[0].trim() : '';

      const desc = md.match(/\n\*desc>\s(.)+\n/);
      const postDescription = desc
        ? /\n\*desc>\s((?:(?!\*\n)[^\s　])+)/g.exec(desc[0])
        : null;
      const description = postDescription ? postDescription[1] : '';

      const postDate = /\*date\:((?:(?!\*)[^\s　])+)/g.exec(md);
      const date = postDate ? postDate[1] : '';

      const url = encodeURI(fileName.replace(/.md/g, ''));
      const html = withHtml ? marked(md, { renderer }) : null;

      marked.setOptions({
        gfm: true,
        highlight: (code: any, lang: any) => {
          const hljs = require('highlight.js');
          const language = hljs.getLanguage(lang) ? lang : 'plaintext';
          return hljs.highlight(code, { language }).value;
        },
      });

      resolve({
        title,
        description,
        date,
        url,
        html,
      });
    });
  });
};
