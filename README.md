# exhibit-include-assets

This plugin lets you refer to assets in your [load paths](#) as if they are part of your project. Just by adding a stylesheet, script or image tag in your HTML (or a `url()` in your CSS), it will be pulled in automatically from your load paths.

## Install

```sh
$ npm install --save exhibit-include-assets
```

## Example: using Bootstrap

We're going to install Bootstrap as a Bower component. Then the exhibit-include-assets plugin will allow us to use it as if it's part of our project.


## Usage

```js
var exhibit = require('exhibit');
var $ = exhibit.plugins();

exhibit('src', 'bower_components')
  .use($.includeAssets())
  .build('dist');
```


Say you're using Bower, so you've got a `bower_components` directory (next to your `src` directory). And you've done `bower install normalize-css`, so you've got that next to you.

You can now just load a stylesheet from that component as if it were inside your source directory:

```html
<link rel="stylesheet" href="normalize-css/normalize.css">
```

The include-assets plugin will automatically import that file and output it.


To build it:




For example:


This plugin lets you include things like `<script src="some/component/script.js"></script>` in your HTML – if it's not found in your project, it will be pulled in from any [load paths](#) (e.g. `./bower_components` in the above example).

How it works:

- Any HTML and CSS files are passed through, but also scanned for asset references (see below)

- All other file types are just passed through without any scanning.
- But HTML and CSS files are also scanned for things scripts, stylesheets and images, and these are imported and passed through as extra files.

## Assets covered

In HTML:

- `<script src="_________"></script>`
- `<link rel="stylesheet" href="_________">`
- `<img src="_________">`

In CSS:

- `url(_________)`

Assets with different kinds of URLs are handled in the following way:

- file-relative URLs (`foo.js`, `foo/bar.js`, `../foo/bar.js`) are taken as relative from the file that refers to them.
- root-relative URLs (`/foo.js`, `/foo/bar.js`) are loaded relative to the root of the source directory (this could be incorrect in some cases, if you have included a `<base>` tag, which we could perhaps take into account with the HTML, but if we did then we'd have ).
- URLs that are not on the same domain/host are
