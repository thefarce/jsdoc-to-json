const fs       = require('fs');
const path     = require('path');
const jsonfile = require('jsonfile');

/**
 * Publish JSDoc data as JSON data.  In this template, command line takes
 * priority over config and config takes priority over default.
 *
 * @param jsdocs {TaffyDB} A Taffy DB data object representing the JSDoc
 * data.
 * @param options {Object} An object representing command line and
 * config-based options.
 * @returns {Promise} A promise object that accepts when the file is written
 * as expected and rejects when there's an error creating the JSON file.
 */
function publish (jsdocs, options, tutorials) {
  let fn_dest  = 'jsdoc-data.json';
  let config   = {};
  let defaults = {
    debug       : false,
    config      : "conf.json",
    destination : "./out",
    readme      : "README.md",
  };

  if (options && typeof options.configure === "string") {
    // I know, I know.  Sync is bad mojo.  But this JSDoc template isn't in
    // a hurry, so ... fork it and write your own if you want it async =)
    config = jsonfile.readFileSync(
      path.normalize(process.cwd() + '/' + options.configure)
    );
  }

  // We merge the three objects into a new parameters.
  //    <-- Defaults <-- config <-- cmdline
  let params = Object.assign({}, defaults, config, options);

  // In the params, we want to normalize the output directory.
  if (options && typeof options.destination === "string") {
    fn_dest = path.normalize(params.destination + "/" + fn_dest);
  }

  const doclets = [];
  jsdocs().each(d => { doclets.push(d) });

  fs.writeFile(fn_dest, JSON.stringify(doclets), err => {
    if (err) {
      console.error(err);
    } else {
      console.log("JSDoc data written to", fn_dest);
    }
  });
}

module.exports = {
  publish,
};
