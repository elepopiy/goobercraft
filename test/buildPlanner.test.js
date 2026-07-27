const test = require('node:test');
const assert = require('node:assert/strict');
const { createBuildPlanSteps } = require('../dist/utils/buildPlanner.js');

test('builder flow creates a 10-step plan for a build request', () => {
  const steps = createBuildPlanSteps('kule yap', '1. Malzeme topla\n2. Temeli kur\n3. Duvarı yükselt');

  assert.equal(steps.length, 10);
  assert.ok(steps.some((step) => step.type === 'equip'));
  assert.ok(steps.some((step) => step.type === 'place'));
});

test('builder flow falls back to a structured plan when AI response is missing', () => {
  const steps = createBuildPlanSteps('ev yap');

  assert.equal(steps.length, 10);
  assert.equal(steps[0].type, 'chat');
  assert.equal(steps[1].type, 'look');
});
