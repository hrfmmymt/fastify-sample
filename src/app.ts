import fastify, { FastifyInstance } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';

import { getPostInfo } from '../utils/get_post_info';
import { checkFileExistence } from '../utils/check_file_existence';

const config = {
  postDir: path.join(__dirname, '../post/'),
  postList: JSON.parse(
    fs.readFileSync(path.join(__dirname, '../post-list.json'), 'utf8')
  ),
};

const metadata = {
  author: 'hrfmmymt',
  copyright:
    'Copyright &copy; 2021 fastify-sample of hrfmmymt All Rights Reserved.',
  ogImage: 'public/img/icons/icon.png',
  favicon: 'public/img/icons/favicon.ico',
  title: "hrfmmymt's fastify-sample",
  twitterSite: '@hrfmmymt',
  twitterCard: 'summary',
};

function build(opts = {}) {
  const app: FastifyInstance = fastify(opts);

  app.register(require('point-of-view'), {
    engine: {
      nunjucks: require('nunjucks'),
    },
  });

  app.register(require('fastify-static'), {
    root: path.join(__dirname, '../'),
    prefix: '/',
  });

  app.get('/', (_req, reply: any) => {
    reply.view('./templates/index.njk', {
      head: {
        title: metadata.title,
        url: '',
        description: '',
        favicon: metadata.favicon,
        ogImage: metadata.ogImage,
        twitterSite: metadata.twitterSite,
        twitterCard: metadata.twitterSite,
      },
      postList: config.postList,
    });
  });

  app.get('/:post', (req: any, reply: any) => {
    const { post } = req.params;
    const fileName = path.format({
      name: post,
      ext: '.md',
    });

    const filePath = config.postDir + fileName;

    checkFileExistence({ filePath, reply });

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
    reply.send(config.postList);
  });

  app.get('/sw.js', (_req, reply) => {
    fs.readFile('./sw.js', 'utf-8', (err, fileBuffer) => {
      reply.type('text/javascript').send(err || fileBuffer)
    })
  })

  return app;
}

module.exports = build;
