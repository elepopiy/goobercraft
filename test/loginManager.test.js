const test = require('node:test');
const assert = require('node:assert/strict');
const { LoginManager } = require('../dist/managers/LoginManager.js');
const { EventBus } = require('../dist/core/EventBus.js');

test('configuration state sends client_information and finish_configuration packets', () => {
  const bus = new EventBus();
  const writes = [];
  const protocol = {
    write(name, params) {
      writes.push({ name, params });
    }
  };

  const manager = new LoginManager(bus, protocol, {
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

  bus.emit('_raw_state', 'configuration');

  assert.ok(writes.some((entry) => entry.name === 'settings'));
  assert.ok(writes.some((entry) => entry.name === 'finish_configuration'));
});
