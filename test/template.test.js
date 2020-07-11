const fs       = require('fs');
const template = require('../template/publish.js');

describe("template", () => {
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
    expect(fs.writeFile.mock.calls[0][0]).toBe('jsdoc.json');
    expect(fs.writeFile.mock.calls[0][1]).toBe(
      '[{"one":1,"two":2},{"three":3,"four":4},{"five":5,"six":6}]',
    );
  });
});

