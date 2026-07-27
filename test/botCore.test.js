const test = require('node:test');
const assert = require('node:assert/strict');
const { BotCore } = require('../dist/core/BotCore.js');

test('bot core emits end when a connection error occurs', () => {
  const core = new BotCore({
    host: '127.0.0.1',
    username: 'tester',
    password: '',
    port: 25565,
    auth: 'offline',
    version: 'auto',
    viewDistance: 8,
    checkTimeoutInterval: 30000,
    respawnOnDeath: true,
    profile: 'stable'
  });

  let ended = false;
  core.bus.on('end', () => {
    ended = true;
  });

  core.bus.emit('_raw_error', new Error('read ECONNRESET'));

  assert.equal(ended, true);
});
