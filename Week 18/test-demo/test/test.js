var assert = require('assert');
import { add } from '../add.js';

describe("add function testing:", function() {
    it('1 + 2 should be 3', function() {
        assert.equal(add(1, 2), 3);
    });
    it('10 + 2 should be 12', function() {
        assert.equal(add(10, 2), 12);
    });
    it('-1 + -2 should be -3', function() {
        assert.equal(add(-1, -2), -3);
    });
})