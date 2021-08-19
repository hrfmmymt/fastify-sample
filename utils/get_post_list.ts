import * as fs from 'mz/fs';
import * as path from 'path';

import { getPostInfo } from './get_post_info';
import { PostInfo } from './types';

// @ts-ignore: Identifier '__dirname' has already been declared
const postDir = path.join(__dirname, '../post/');

async function sortPostsList() {
  // @ts-ignore: Identifier '__dirname' has already been declared
  const dist = path.join(__dirname, '../');
  const files = await fs.readdir(postDir);
  const posts = files.map((file: string) =>
    getPostInfo({ fileName: file, withHtml: true })
  );
  const postsList: PostInfo[] = await Promise.all(posts);

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
