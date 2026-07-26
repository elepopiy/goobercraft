const test = require('node:test');
const assert = require('node:assert/strict');
const { parseBotProfileAction } = require('../dist/utils/botProfiles.js');

test('builder profile can still react to !yap commands in creative flow', () => {
  assert.deepEqual(parseBotProfileAction('builder', '!yap kule'), {
    type: 'build',
    detail: 'kule',
  });
});
