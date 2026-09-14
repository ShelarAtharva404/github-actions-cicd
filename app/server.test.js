const test = require("node:test");
const assert = require("node:assert");

test("basic application test", () => {
  const result = 2 + 2;

  assert.strictEqual(result, 4);
});
