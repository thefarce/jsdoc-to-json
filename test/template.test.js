const publish = require('../template/publish.js').publish;
const fs      = require('fs');

describe("template", () => {
  test("publish()", () => {
    console.log = jest.fn();
    let promise = publish(function () {
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

    promise.then(doclets => {
        expect(doclets.length).toBe(3);
        expect(console.log).toHaveBeenCalledWith('Output written.');
        fs.readFile('jsdoc.json', (err, data) => {
          if (err) {
            fail('Cannot test whether jsdoc.json was written:  file cannot be opened');
            fail(err);
          }

          expect(data.toString())
            .toBe('[{"one":1,"two":2},{"three":3,"four":4},{"five":5,"six":6}]');

          fs.unlink('jsdoc.json', err => {

          });
        });
      })
      .catch(err => {
        expect(console.log).toHaveBeenCalledWith('Output written.');
      })
    ;

    expect(promise)
      .resolves
      .toMatchObject([{"one":1,"two":2},{"three":3,"four":4},{"five":5,"six":6}]);
  });
});

