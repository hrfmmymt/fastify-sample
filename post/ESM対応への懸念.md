# ESM対応への懸念

*date:2021-08-30*

*desc> esm*

## imagemin
画像の最適化で使っている imagemin 最新 ver. が ESM を使っているので、対応しなければならない。
[対応方法](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)

## 懸念
- 他の既存コードの修正がめんどくさそう
  - TS のとことか
  - 他の pkg は？
- Vercel でのデプロイ

## まあでも今後を考えるとやった方がよい