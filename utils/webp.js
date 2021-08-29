import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';

(async () => {
  await imagemin(['./public/img/post/*.{jpg,png}'], {
    destination: './public/img/post/webp/',
    plugins: [imageminWebp({ quality: 100 })],
  });
})();
