import fastify from 'fastify';
import * as fs from 'fs';
import * as path from 'path';

import { getPostInfo } from '../utils/get_post_info';

const config = {
  postDir: path.join(__dirname, '../post/'),
  postsList: JSON.parse(
    fs.readFileSync(path.join(__dirname, '../posts-list.json'), 'utf8')
  ),
};

const metadata = {
  author: 'hrfmmymt',
  copyright:
    'Copyright &copy; 2021 fastify-sample of hrfmmymt All Rights Reserved.',
  ogImage: 'og_img.jpg',
  title: "hrfmmymt's fastify-sample",
  twitterSite: '@hrfmmymt',
  twitterCard: 'summary',
};

function build(opts = {}) {
  const app = fastify(opts);

  app.register(require('point-of-view'), {
    engine: {
      nunjucks: require('nunjucks'),
    },
  });

  app.register(require('fastify-static'), {
    root: path.join(__dirname, '../public'),
    prefix: '/public/',
  });

  app.get('/', (_req, reply: any) => {
    reply.view('./templates/index.njk', {
      head: {
        title: metadata.title,
        url: '',
        description: '',
        ogImage: metadata.ogImage,
        twitterSite: metadata.twitterSite,
        twitterCard: metadata.twitterSite,
      },
      postList: config.postsList,
    });
  });

  app.get('/:post', (req: any, reply: any) => {
    const { post } = req.params;
    const fileName = path.format({
      name: post,
      ext: '.md',
    });

    try {
      fs.statSync(config.postDir + fileName);
    } catch (err) {
      if (err.code === 'ENOENT')
        reply.code(404).view('./templates/page/404.njk');
    }

    getPostInfo({ fileName, withHtml: true }).then((postInfo) => {
      reply.view('./templates/page/post.njk', {
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

  app.get('/api', (_req, reply) => {
    reply.send(config.postsList);
  });

  app.get('/favicon.ico', (_req, reply) => {
    reply.code(404).send();
  });

  return app;
}

module.exports = build;
