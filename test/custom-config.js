module.exports = {
  extends: 'lighthouse:default',
  settings: {
    onlyAudits: [
      'custom-audit',
      'dom-size',
      'speed-index',
      'first-contentful-paint',
      'interactive',
      'total-blocking-time',
    ],
    throttlingMethod: 'devtools',
  },
  passes: [
    {
      passName: 'defaultPass',
      gatherers: ['custom-gatherer'],
    },
  ],
  audits: ['custom-audit'],
  categories: {
    custom: {
      title: 'custom metrics',
      description: 'custom metrics',
      auditRefs: [{ id: 'custom-audit', weight: 1 }],
    },
  },
};
