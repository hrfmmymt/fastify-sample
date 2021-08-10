const fs = require('mz/fs');
const path = require('path');

const getPostInfo = require('./get_post_info');

const postDir = path.join(__dirname, '../post/');

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
