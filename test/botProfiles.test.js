const test = require('node:test');
const assert = require('node:assert/strict');

const { parseBotProfileAction } = require('../dist/utils/botProfiles.js');

test('combat profile keeps combat action', () => {
  assert.deepEqual(parseBotProfileAction('combat', ''), { type: 'combat' });
});

test('builder profile reacts to !yap commands', () => {
  assert.deepEqual(parseBotProfileAction('builder', '!yap kule'), {
    type: 'build',
    detail: 'kule',
  });
});

test('chatter profile reacts to !sor commands', () => {
  assert.deepEqual(parseBotProfileAction('chatter', '!sor nasılsın'), {
    type: 'chat',
    detail: 'nasılsın',
  });
});

test('stable profile stays passive', () => {
  assert.deepEqual(parseBotProfileAction('stable', 'hello'), { type: 'stable' });
});
