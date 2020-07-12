const fs       = require('fs');
const jsonfile = require('jsonfile');
const path     = require('path');
const template = require('../template/publish.js');

describe("template", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("publish()", () => {
    fs.writeFile = jest.fn();

    template.publish(function () {
      return {
        each: function (func) {
          [
            { one   : 1, two  : 2 },
            { three : 3, four : 4 },
            { five  : 5, six  : 6 },
          ].forEach(d => func(d));
        }
      };
    });

    expect(fs.writeFile.mock.calls.length).toBe(1);
    expect(fs.writeFile.mock.calls[0][0]).toBe('jsdoc-data.json');
    expect(fs.writeFile.mock.calls[0][1]).toBe(
      '[{"one":1,"two":2},{"three":3,"four":4},{"five":5,"six":6}]',
    );
  });

  test("configure file", () => {
    jsonfile.readFileSync = jest.fn();
    fs.writeFile = jest.fn((fxn, txt, cb) => {
      cb("File writing error");
    });
    console.error = jest.fn();

    template.publish(
      function () {
        return {
          each: function (func) {
            [
              { one   : 1, two  : 2 },
              { three : 3, four : 4 },
              { five  : 5, six  : 6 },
            ].forEach(d => func(d));
          }
        };
      },
      // These are the options, like the command line options.
      {
        configure   : 'myconfig.json',
        destination : 'pub',
      }
    );

    // Test the config file
    expect(jsonfile.readFileSync.mock.calls.length).toBe(1);
    expect(
      path.relative(process.cwd(), jsonfile.readFileSync.mock.calls[0][0])
    ).toBe('myconfig.json');

    // Test the "destination" element of the config.
    expect(fs.writeFile.mock.calls.length).toBe(1);
    expect(fs.writeFile.mock.calls[0][0]).toBe('pub/jsdoc-data.json');

    // Test that we got the expected console error.
    expect(console.error.mock.calls.length).toBe(1);
    expect(console.error.mock.calls[0][0]).toBe('File writing error');
  });

  test("configure file", () => {
    console.log   = jest.fn();
    console.error = jest.fn();
    jsonfile.readFileSync = jest.fn();
    fs.writeFile = jest.fn((fxn, txt, cb) => {
      cb();
    });

    template.publish(
      function () {
        return {
          each: function (func) {
            [
              { one   : 1, two  : 2 },
              { three : 3, four : 4 },
              { five  : 5, six  : 6 },
            ].forEach(d => func(d));
          }
        };
      },
      // These are the options, like the command line options.
      {
        configure   : 'myconfig.json',
        destination : 'pub',
      }
    );

    // Test the config file
    expect(jsonfile.readFileSync.mock.calls.length).toBe(1);
    expect(
      path.relative(process.cwd(), jsonfile.readFileSync.mock.calls[0][0])
    ).toBe('myconfig.json');

    // Test the "destination" element of the config.
    expect(fs.writeFile.mock.calls.length).toBe(1);
    expect(fs.writeFile.mock.calls[0][0]).toBe('pub/jsdoc-data.json');

    // Test when file writing succeeds.  We don't get a filename here
    // because we're not using the internal enclosure in the module.  I
    // don't know how to test that with jest yet.
    expect(console.log.mock.calls.length).toBe(1);
    expect(console.log.mock.calls[0][0]).toBe('JSDoc data written to');
  });
});
