const fs = require('fs');
const path = require('path');

const fastify = require('fastify')({
  logger: true,
  ignoreTrailingSlash: true,
});
const marked = require('marked');

const getPostInfo = require('./utils/get_post_list');

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

fastify.register(require('point-of-view'), {
  engine: {
    nunjucks: require('nunjucks'),
  },
});

fastify.get('/', { schema }, (_req, reply) => {
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

fastify.get('/:post', (req, reply) => {
  const file = path.format({
    name: req.params.post,
    ext: '.md',
  });

  try {
    fs.statSync(config.postDir + file);
  } catch (err) {
    if (err.code === 'ENOENT') reply.code(404).send(new Error('Missing this'));
  }

  getPostInfo(file, true).then((postInfo) => {
    console.log(postInfo);
    reply.view('./templates/post.njk', {
      postList: false,
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

fastify.listen(3000, (err) => {
  if (err) throw err;
  console.log(`server listening on ${fastify.server.address().port}`);
});
