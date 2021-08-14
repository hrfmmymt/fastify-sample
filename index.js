"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const get_post_info_1 = require("./utils/get_post_info");
const f = fastify_1.default({
    logger: true,
    ignoreTrailingSlash: true,
});
const config = {
    postDir: path.join(__dirname, '/post/'),
    postsList: JSON.parse(fs.readFileSync(path.join(__dirname, './posts-list.json'), 'utf8')),
};
const metadata = {
    author: 'hrfmmymt',
    copyright: 'Copyright &copy; 2021 fastify-sample of hrfmmymt All Rights Reserved.',
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
f.get('/', { schema }, (_req, reply) => {
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
f.get('/:post', (req, reply) => {
    const fileName = path.format({
        name: req.params.post,
        ext: '.md',
    });
    try {
        fs.statSync(config.postDir + fileName);
    }
    catch (err) {
        if (err.code === 'ENOENT')
            reply.code(404).send(new Error('Missing this'));
    }
    get_post_info_1.getPostInfo({ fileName, withHtml: true }).then((postInfo) => {
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
f.get('/api', (req, reply) => {
    reply.send(config.postsList);
});
f.get('/favicon.ico', (_req, reply) => {
    reply.code(404).send();
});
f.listen(3000, (err) => {
    if (err)
        throw err;
});
