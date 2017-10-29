# VJ Tumblr

VJ software using Tumblr API.

![vjtumblr_demo](https://cloud.githubusercontent.com/assets/945841/11456504/c9431a0a-96ce-11e5-9383-2092d0abf6b2.gif)

## 開発環境とか

以下の様な`app_config.coffee`という設定ファイルを作って`gulp/`下に保存する。

```js
data =
  api_key: 'yourConsumerKey'

module.exports =
  data: data
```
以下のコマンドをポチポチする。

```
$ npm install -g gulp
$ npm install
$ gulp watch
$ yarn run build
```

```
$ yarn run release
```

でアプリ化できる（はず）。
