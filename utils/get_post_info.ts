import * as fs from 'fs';
import * as path from 'path';
import { PostInfo } from './types';
// @ts-ignore
const marked = require('marked');
// import { renderImage } from './get_post_img';

const postDir = path.join(__dirname, '../post/');
const renderer = new marked.Renderer();

const sanitize = (str: string) => {
  return str.replace(/&<"/g, (m) => {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    return '&quot;';
  });
};

renderer.image = (src: string, _title: string, alt: string) => {
  const exec = /=\s*(\d*)\s*x\s*(\d*)\s*$/.exec(src);
  const regExp = exec && exec[0] ? new RegExp(exec[0], 'g') : '';
  const mySrc = src.replace(regExp, '');
  const mySrcRegex = mySrc.match(/(.*)(?:\.([^.]+$))/);
  const srcExec = mySrcRegex !== null ? mySrcRegex[1] : '';
  const fileName = srcExec.replace('public/img/post/', '');
  const webpSrc = `public/img/post/webp/${fileName}.webp`;
  const width = exec && exec[1] ? exec[1] : 0;
  const height = exec && exec[2] ? exec[2] : 0;
  return `<picture>
    <source srcset="${webpSrc}" type="image/webp">
    <source srcset="${mySrc}" type="image/jpeg">
    <img src="${mySrc}" alt="${sanitize(
    alt
  )}" width="${width}" height="${height}" />
  </picture>`;
};

// renderImage();

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
        html: html ?? '',
      });
    });
  });
};
