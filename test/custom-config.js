module.exports = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'custom'],
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
