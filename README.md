# VJ Tumblr

VJ software using Tumblr API.

![vjtumblr_demo](https://cloud.githubusercontent.com/assets/945841/11456504/c9431a0a-96ce-11e5-9383-2092d0abf6b2.gif)

## Download

[👉Download VJ Tumblr v1.0.1 for macOS](https://github.com/putchom/vjtumblr/releases)

## Building

You first need to make `app_config.coffee` file to `gulp/`.

```js
data =
  api_key: 'yourConsumerKey'

module.exports =
  data: data
```

The following commands will then be available from the repository root:

```
$ yarn              # install node dependencies
$ yarn run watch    # watch for changes and build automatically
$ yarn run start    # start app
```

## Release

```
$ yarn run release
```
