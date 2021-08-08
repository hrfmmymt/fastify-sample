const fs = require('fs');
const path = require('path');

const fastify = require('fastify')({
  logger: true,
  ignoreTrailingSlash: true,
});
const marked = require('marked');

const config = {
  postDir: path.join(__dirname, '/post/'),
};

const metadata = {
  author: 'hrfmmymt',
  copyright:
    'Copyright &copy; 2021 fastify-sample of hrfmmymt All Rights Reserved.',
  ogImage: 'og_img.jpg',
  twitterSite: '@hrfmmymt',
  twitterCard: 'summary',
};

marked.setOptions({
  gfm: true,
});

function getPostInfo(fileName, withHtml) {
  return new Promise((resolve, reject) => {
    fs.readFile(config.postDir + fileName, 'utf-8', (err, md) => {
      if (err) reject(err);

      const postTitle = md.match(/^#\s(.)+\n/)[0].match(/[^#\n\s]+/);
      const postDate = /\*date\:((?:(?!\*)[^\s　])+)/g.exec(md);
      const postDescription = md.match(/\n\*desc>(.)+\n/)[0].match(/[^>\n\s]+/);

      marked.setOptions({
        gfm: true,
      });

      resolve({
        title: postTitle[0],
        date: postDate ?? postDate[1],
        description: postDescription ?? postDescription[1],
        url: fileName.replace(/.md/g, ''),
        html: withHtml ? marked(md) : null,
      });
    });
  });
}

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
  return new Promise((resolve, reject) => {
    fs.readdir(config.postDir, (err, mdFiles) => {
      if (err) throw err;
      const postsInfo = [];
      mdFiles.forEach((_, i) => {
        getPostInfo(mdFiles[i], false).then((postInfo) => {
          postsInfo.push(postInfo);
          if (i === mdFiles.length - 1) {
            reply.view('./templates/index.njk', {
              head: {
                title: 'headTtl',
                url: '',
                description: '',
                ogImage: metadata.ogImage,
                twitterSite: metadata.twitterSite,
                twitterCard: metadata.twitterSite,
              },
              postList: postsInfo,
            });
          }
        });
      });
    });
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
