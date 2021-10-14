const Gatherer = require('lighthouse').Gatherer;

/**
 * @fileoverview Extracts `window.myData` from the test page.
 */

class CustomGatherer extends Gatherer {
  afterPass(options) {
    const driver = options.driver;
    return driver.evaluateAsync('window.myData').then((result) => {
      if (!result || result.performance === undefined) {
        throw new Error('Unable to find performance metric in page');
      }
      return result;
    });
  }
}

module.exports = CustomGatherer;
