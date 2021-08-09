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

async function sortPostsList() {
  const dist = path.join(__dirname, '../');
  const files = await fs.readdir(postDir);
  const posts = files.map((file) => getPostInfo(file));
  const postsList = await Promise.all(posts);

  const list = postsList.sort((a, b) => {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    if (a.title > b.title) return -1;
    if (a.title < b.title) return 1;
    return 0;
  });

  fs.writeFile(`${dist}posts-list.json`, JSON.stringify(list, null, '  '));
}

sortPostsList();
