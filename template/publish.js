const fs   = require('fs');
const path = require('path');

/**
 * Publish JSDoc data as JSON data.
 *
 * @param jsdocs {TaffyDB} A Taffy DB data object representing the JSDoc
 * data.
 * @param options {Object} An object representing command line and
 * config-based options.
 * @returns {Promise} A promise object that accepts when the file is written
 * as expected and rejects when there's an error creating the JSON file.
 */
function publish (jsdocs, options) {
  return new Promise((accept, reject) => {
    const doclets = [];
    jsdocs().each(d => { doclets.push(d) });

    fs.writeFile(
      path.join('jsdoc.json'),
      JSON.stringify(doclets),
      err => {
        if (err) {
          console.log("An error occurred while writing the json data file.");
          return reject(err);
        }

        console.log("Output written.");
        return accept(doclets);
      }
    );
  });
}

module.exports = {
  publish
};
