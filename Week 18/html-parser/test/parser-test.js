var assert = require('assert');

import { parseHTML } from '../src/parser';

describe("parse html testing:", function() {
    it('<a></a> test:', function() {
        let tree = parseHTML('<a></a>');
        assert.equal(tree.children[0].tagName, 'a');
        assert.equal(tree.children[0].children.length, 0);
    })
    it('<a href="//time.geekbang.org"></a> test:', function() {
        let tree = parseHTML('<a href="//time.geekbang.org"></a>');
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    })
    it('<a href="abc" id></a> test:', function() {
        let tree = parseHTML('<a href="abc" id></a>');
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    })
    it('<a id=abc ></a> test:', function() {
        let tree = parseHTML('<a id=abc ></a>');
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    })
    it('<a id=abc/> test:', function() {
        let tree = parseHTML('<a id=abc/>');
        assert.equal(tree.children.length, 0);
    })
    it('<a id=\'abc\'/> test:', function() {
        let tree = parseHTML('<a id=\'abc\'/>');
        assert.equal(tree.children.length, 0);
    })
    it('<a /> test:', function() {
        let tree = parseHTML('<a />');
        assert.equal(tree.children.length, 0);
    })
    it('<A /> test:', function() {
        let tree = parseHTML('<A />');
        assert.equal(tree.children.length, 0);
    })
    it('<> test:', function() {
        let tree = parseHTML('<>');
        assert.equal(tree.children[0].type, "text");
    })
})