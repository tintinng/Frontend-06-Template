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
    it('<a href ></a>', () => {
        const tree = parseHTML('<a href ></a>');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });
    it('<a href id></a>', () => {
        const tree = parseHTML('<a href id></a>');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });
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
        assert.equal(tree.children.length, 1);
    })
    it('<a id=\'abc\'/> test:', function() {
        let tree = parseHTML('<a id=\'abc\'/>');
        assert.equal(tree.children.length, 1);
    })
    it('<a /> test:', function() {
        let tree = parseHTML('<a />');
        assert.equal(tree.children.length, 1);
    })
    it('<A /> test:', function() {
        let tree = parseHTML('<A />');
        assert.equal(tree.children.length, 1);
    })
    it('<> test:', function() {
        let tree = parseHTML('<>');
        assert.equal(tree.children[0].type, "text");
    })
    it('<a id=abc></a>', () => {
        const tree = parseHTML('<a id=abc></a>');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
      });
    
      it('<a>test</a>', () => {
        const tree = parseHTML('<a>test</a>');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 1);
      });
    
      it('<a href= id>test</a>', () => {
        const tree = parseHTML('<a href= id>test</a>');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 1);
      });
})