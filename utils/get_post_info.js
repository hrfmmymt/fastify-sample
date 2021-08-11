"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const marked_1 = __importDefault(require("marked"));
const postDir = path_1.default.join(__dirname, '../post/');
function getPostInfo(fileName, withHtml) {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(postDir + fileName, 'utf-8', (err, md) => {
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
            marked_1.default.setOptions({
                gfm: true,
            });
            resolve({
                title,
                description,
                date: postDate ? postDate[1] : '',
                url: fileName.replace(/.md/g, ''),
                html: withHtml ? marked_1.default(md) : null,
            });
        });
    });
}
exports.default = getPostInfo;
// module.exports = getPostInfo;
