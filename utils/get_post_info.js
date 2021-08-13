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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const marked = require('marked');
const postDir = path.join(__dirname, '../post/');
const renderer = new marked.Renderer();
function getPostInfo({ fileName, withHtml, }) {
    return new Promise((resolve, reject) => {
        fs.readFile(postDir + fileName, 'utf-8', (err, md) => {
            if (err)
                return reject(err);
            const h1 = md.match(/^#\s.+\n/);
            const postTitle = h1 ? h1[0].match(/[^#\n]+/) : null;
            const title = postTitle ? postTitle[0].trim() : '';
            const desc = md.match(/\n\*desc>\s(.)+\n/);
            const postDescription = desc
                ? /\n\*desc>\s((?:(?!\*\n)[^\s　])+)/g.exec(desc[0])
                : null;
            const description = postDescription ? postDescription[1] : '';
            const postDate = /\*date\:((?:(?!\*)[^\s　])+)/g.exec(md);
            marked.setOptions({
                gfm: true,
            });
            resolve({
                title,
                description,
                date: postDate ? postDate[1] : '',
                url: fileName.replace(/.md/g, ''),
                html: marked(md, { renderer }),
            });
        });
    });
}
exports.default = getPostInfo;
