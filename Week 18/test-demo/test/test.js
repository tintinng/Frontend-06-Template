var assert = require('assert');

// var add = require('../add').add;
// var mul = require('../add').mul;
import { add, mul } from '../add.js';

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

describe("mul function testing:", function() {
    it('2 * 2 should be 4', function() {
        assert.equal(mul(2, 2), 4);
    })
})