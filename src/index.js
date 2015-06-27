import {extname, resolve, normalize, dirname} from 'path';
import findAssets from 'find-assets';

export default function () {
  let Promise;

  return function exhibitIncludeAssets(path, contents) {
    Promise = this.Promise;

    const results = {};

    const type = extname(path).substring(1);

    const handleFile = (filePath, fileContents, htmlOrCSS) => {
      // add the file itself
      results[filePath] = fileContents;

      fileContents = fileContents.toString();

      // find and add all the assets it references, asynchronously
      const assetGroups = findAssets[htmlOrCSS](fileContents, 1);
      console.assert(Array.isArray(assetGroups), 'Expected an array');

      return Promise.map(assetGroups, ([asset]) => {
        let assetPath;
        if (asset.url.charAt(0) === '/') {
          // it's absolute from the root of the HTML file that includes this one...
          throw new Error('not yet implemented: root-relative paths');
        }
        else {
          assetPath = resolve(dirname(normalize(filePath)), normalize(asset.url));
        }

        return this.import(assetPath)
          .catch(error => {
            if (error.code === 'EXHIBITNOTFOUND') {
              // couldn't import this asset.
              // don't bail; just emit the error so it gets reported

              const linesUntilAsset = fileContents.substring(0, asset.start).split('\n');
              const line = linesUntilAsset.length;
              const column = linesUntilAsset[line - 1].length + 1;

              this.emit('error', new this.SourceError({
                warning: true,
                message: `Asset missing: ${asset.url}`,
                path: filePath,
                contents: fileContents,
                line,
                column,
              }));
            }
            else throw error;
          })
          .then(result => {
            if (result) {
              // add the imported asset
              results[assetPath] = result.contents;

              // if it's a stylesheet, scan it for assets too (TEMP DISABLED)
              // if (asset.type === 'stylesheet') {
              //   return handleFile(assetPath, result.contents, 'css');
              // }

              // otherwise we're done.
            }
          });
      }).then(() => {
        return results;
      });
    }

    // handle HTML and CSS files
    if (type === 'html' /*|| type === 'css'*/) { // TEMP until find-assets is updated to work with CSS
      return handleFile(path, contents, type);
    }

    // other filetypes: pass through unchanged
    return contents;
  };
}

