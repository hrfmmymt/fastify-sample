import fs from 'fs';
import path from 'path';
import marked from 'marked';

const postDir = path.join(__dirname, '../post/');

export default function getPostInfo({
  fileName,
  withHtml,
}: {
  fileName: string;
  withHtml: boolean;
}) {
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

      marked.setOptions({
        gfm: true,
      });

      resolve({
        title,
        description,
        date: postDate ? postDate[1] : '',
        url: fileName.replace(/.md/g, ''),
        html: withHtml ? marked(md) : null,
      });
    });
  });
}
