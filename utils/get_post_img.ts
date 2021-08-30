// @ts-ignore
const marked = require('marked');

const renderer = new marked.Renderer();

const sanitize = (str: string) => {
  return str.replace(/&<"/g, (m) => {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    return '&quot;';
  });
};

export function renderImage() {
  renderer.image = (src: string, _title: string, alt: string) => {
    const exec = /=\s*(\d*)\s*x\s*(\d*)\s*$/.exec(src);
    const regExp = exec && exec[0] ? new RegExp(exec[0], 'g') : '';
    const mySrc = src.replace(regExp, '');
    const mySrcRegex = mySrc.match(/(.*)(?:\.([^.]+$))/);
    const srcExec = mySrcRegex !== null ? mySrcRegex[1] : '';
    const fileName = srcExec.replace('public/img/post/', '');
    const webpSrc = `public/img/post/webp/${fileName}.webp`;
    const width = exec && exec[1] ? exec[1] : 0;
    const height = exec && exec[2] ? exec[2] : 0;
    return `<picture>
      <source srcset="${webpSrc}" type="image/webp">
      <source srcset="${mySrc}" type="image/jpeg">
      <img src="${mySrc}" alt="${sanitize(
      alt
    )}" width="${width}" height="${height}" />
    </picture>`;
  };
};