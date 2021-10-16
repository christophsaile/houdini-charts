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
    // desktop config, no throtteling (default mobile, 4x throtteling)
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10 * 1024,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0, // 0 means unset
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    emulatedUserAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4590.2 Safari/537.36 Chrome-Lighthouse',
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
