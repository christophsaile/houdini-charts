const { Audit } = require('lighthouse');

class CustomAudit extends Audit {
  static get meta() {
    return {
      id: 'custom-audit',
      title: 'JavaScript execution time in ms',
      failureTitle: 'JavaScript execution time could not be measured',
      description: 'Used to measure time for executing JavaScript code of Chart',
      requiredArtifacts: ['CustomGatherer'],
    };
  }

  static audit(artifacts) {
    const measure = artifacts.CustomGatherer;
    const score = measure.performance ? 1 : 0;
    const value = Math.round(measure.performance * 100) / 100;

    return {
      numericValue: value,
      numericUnit: 'milliseconds',
      score: score,
      displayValue: `JavaScript execution time is: ${value} ms`,
    };
  }
}

module.exports = CustomAudit;
