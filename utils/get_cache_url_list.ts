import * as fs from 'mz/fs';
import * as glob from 'glob';

import { PostInfo } from './types';

const PUBLIC_DIR = 'public/';
const STATIC_CACHE_URL_LIST = ['./', './offline'];

const getCacheUrlList = (): void => {
  const postList = JSON.parse(fs.readFileSync('./post-list.json', 'utf8'));
  const postFiles = postList.map((item: PostInfo) => `./${item.url}`);
  const publicFiles = glob.sync(
    PUBLIC_DIR + '**/*.{css,js,json,png,jpg,webp,ico}'
  );
  const staticFiles = publicFiles.map((item: string) => `./${item}`);
  const postAndStaticFiles = postFiles.concat(staticFiles);

  const cacheUrlList = STATIC_CACHE_URL_LIST.concat(postAndStaticFiles);
  const cacheUrlListString = JSON.stringify(cacheUrlList, null, '  ');

  fs.readFile('./public/sw.js', 'utf8', (err, data) => {
    if (err) return console.log(err);

    const existingList =
      data.match(/const URLS_TO_CACHE = ([\s\S]*?.+)\;/) ?? [];
    const replaceCacheUrlResult = data.replace(
      existingList[1],
      cacheUrlListString
    );

    fs.writeFile('./public/sw.js', replaceCacheUrlResult, 'utf8', (err) => {
      if (err) return console.log(err);
    });
  });
};

getCacheUrlList();
