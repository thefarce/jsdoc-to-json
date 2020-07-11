const fs   = require('fs');

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
  const doclets = [];
  jsdocs().each(d => { doclets.push(d) });

  fs.writeFile(
    'jsdoc.json',
    JSON.stringify(doclets),
    console.log
  );
}

module.exports = {
  publish,
};
