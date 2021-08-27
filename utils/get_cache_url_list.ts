import * as fs from 'mz/fs';
import * as path from 'path';
import * as glob from 'glob';

import { PostInfo } from './types';

const PUBLIC_DIR = 'public/';
const DIST = './utils/';

const getCacheUrlList = (): void => {
  const postList = JSON.parse(fs.readFileSync('./post-list.json', 'utf8'));
  const postFiles = postList.map((item: PostInfo) => `./${item.url}`);
  const publicFiles = glob.sync(
    PUBLIC_DIR + '**/*.{css,js,json,png,jpg,webp,ico}'
  );
  const staticFiles = publicFiles.map((item: string) => `./${item}`);
  const postAndStaticFiles = postFiles.concat(staticFiles);

  const array = JSON.stringify(postAndStaticFiles, null, '  ');
  fs.writeFile(
    `${DIST}cache-url-list.ts`,
    `export const CACHE_URL_LIST = ${array};`
  );
};

getCacheUrlList();
