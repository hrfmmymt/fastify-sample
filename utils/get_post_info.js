const fs = require('mz/fs');
const path = require('path');
const marked = require('marked');

const postDir = path.join(__dirname, '../post/');

const getPostInfo = (fileName, withHtml) => {
  return new Promise((resolve, reject) => {
    fs.readFile(postDir + fileName, 'utf-8', (err, md) => {
      if (err) return reject(err);

      const postTitle = md.match(/^#\s.+\n/)[0].match(/[^#\n]+/);
      const postDescription = /\n\*desc>\s((?:(?!\*\n)[^\s　])+)/g.exec(
        md.match(/\n\*desc>\s(.)+\n/)[0]
      );
      const postDate = /\*date\:((?:(?!\*)[^\s　])+)/g.exec(md);

      marked.setOptions({
        gfm: true,
      });

      resolve({
        title: postTitle[0].trim(),
        description: postDescription[1],
        date: postDate[1],
        url: fileName.replace(/.md/g, ''),
        html: withHtml ? marked(md) : null,
      });
    });
  });
};

module.exports = getPostInfo;
