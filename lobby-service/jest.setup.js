require('reflect-metadata');

const { Test, TestingModule } = require('@nestjs/testing');
global.Test = Test;
global.TestingModule = TestingModule;

// Add Jest globals explicitly
global.describe = describe;
global.it = it;
global.expect = expect;
global.beforeEach = beforeEach;
global.afterEach = afterEach;
global.beforeAll = beforeAll;
global.afterAll = afterAll;

// Add custom matchers
global.expect.extend({
  toBeInstanceOf(received, expected) {
    const pass = received instanceof expected;
    return {
      message: () =>
        `expected ${received} ${pass ? 'not ' : ''}to be instance of ${expected}`,
      pass,
    };
  },
});
