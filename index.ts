import fastify, { FastifyInstance } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';

import getPostInfo from './utils/get_post_info';

const f: FastifyInstance = fastify({
  logger: true,
  ignoreTrailingSlash: true,
});

const config = {
  postDir: path.join(__dirname, '/post/'),
  postsList: JSON.parse(
    fs.readFileSync(path.join(__dirname, './posts-list.json'), 'utf8')
  ),
};

const metadata = {
  author: 'hrfmmymt',
  copyright:
    'Copyright &copy; 2021 fastify-sample of hrfmmymt All Rights Reserved.',
  ogImage: 'og_img.jpg',
  twitterSite: '@hrfmmymt',
  twitterCard: 'summary',
};

const schema = {
  querystring: {
    name: { type: 'string' },
    excitement: { type: 'integer' },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        title: { type: 'string' },
      },
    },
  },
};

f.register(require('point-of-view'), {
  engine: {
    nunjucks: require('nunjucks'),
  },
});

f.get('/', { schema }, (_req: any, reply: any) => {
  reply.view('./templates/index.njk', {
    head: {
      title: 'headTtl',
      url: '',
      description: '',
      ogImage: metadata.ogImage,
      twitterSite: metadata.twitterSite,
      twitterCard: metadata.twitterSite,
    },
    postList: config.postsList,
  });
});

f.get('/:post', (req: any, reply: any) => {
  const fileName = path.format({
    name: req.params.post,
    ext: '.md',
  });

  try {
    fs.statSync(config.postDir + fileName);
  } catch (err) {
    if (err.code === 'ENOENT') reply.code(404).send(new Error('Missing this'));
  }

  getPostInfo({ fileName, withHtml: true }).then((postInfo) => {
    reply.view('./templates/post.njk', {
      postList: null,
      head: {
        title: postInfo.title,
        url: postInfo.url,
        description: postInfo.description,
        ogImage: metadata.ogImage,
        twitterSite: metadata.twitterSite,
        twitterCard: metadata.twitterSite,
      },
      post: {
        contents: postInfo.html,
      },
    });
  });
});

f.listen(3000, (err: Error) => {
  if (err) throw err;
});
