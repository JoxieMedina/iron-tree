const Node = require('../src/node');
const Tree = require('../src/tree');
const showTree = require('../utils/show-tree');
const compareById = require('../utils/node-compare-by-id');
const generateTreeDefault = require('../fakes/generate-tree-default');

const chai = require('chai')
  , assert = chai.assert
  , expect = chai.expect
  , should = chai.should();

let object = { id: 1, title: 'Root' };
let tree = new Tree(object);

describe('Tree', function() {
  beforeEach(function() {
    object = { id: 1, title: 'Root' };
    tree = new Tree(object);
  });

  describe('Constructor', function() {

    it('It exists', function() {
      expect(tree instanceof Tree).to.equal(true);
    });

    it('With params', function() {
      expect(tree.rootNode instanceof Node).to.equal(true);
    });

    it('Without params', function() {
      const tree = new Tree();

      expect(tree.rootNode instanceof Node).to.equal(false);
      expect(tree.rootNode).to.equal(null);
    });

  });


  describe('Add', function() {

    it('Add root', function() {
      const tree = new Tree();
      const resultTree = tree.add('root', object);

      expect(resultTree instanceof Tree).to.equal(true);
      expect(resultTree.rootNode instanceof Node).to.equal(true);
    });

    it('Add regular node', function() {
      const regularObject = { id:2, title: 'Node 2'}
      const resultTree = tree.add((parentNode) => {
        return parentNode.get('id') === 1;
      }, regularObject);

      expect(resultTree instanceof Tree).to.equal(true);
      expect(resultTree.rootNode instanceof Node).to.equal(true);

      expect(resultTree.rootNode.children).to.have.lengthOf(1);
      expect(resultTree.rootNode.children[0].get('id')).to.equal(2);
    });

    it('Add many nodes', function() {
      tree = generateTreeDefault();

      expect(tree instanceof Tree).to.equal(true);
      expect(tree.rootNode instanceof Node).to.equal(true);

      expect(tree.rootNode.get('id')).to.equal(1);
      expect(tree.rootNode.children[0].get('id')).to.equal(2);
      expect(tree.rootNode.children[1].get('id')).to.equal(3);

      expect(tree.rootNode.children[1].children[0].get('id')).to.equal(4);
      expect(tree.rootNode.children[1].children[0].children[0].get('id')).to.equal(5);
      expect(tree.rootNode.children[1].children[0].children[0].children[0].get('id')).to.equal(6);

      // showTree(tree);
    });
  });


  describe('Contains', function() {

    it('Search element when he does exists', function() {
      tree = generateTreeDefault();
      const targetNode = tree.contains((currentNode) => {
        return currentNode.get('id') === 7;
      });

      expect(targetNode instanceof Node).to.equal(true);
      expect(targetNode.get('id')).to.equal(7);
    });

    it('Search element when he does not exists', function() {
      tree = generateTreeDefault();
      const targetNode = tree.contains((currentNode) => {
        return currentNode.get('id') === 100;
      });

      expect(targetNode).to.equal(undefined);
    });

  });


  describe('Remove', function() {

    it('Remove correct criteria', function() {
      tree = generateTreeDefault();
      const result = tree.remove((currentNode) => {
        return currentNode.get('id') === 7;
      });
      const targetNode = tree.contains((currentNode) => {
        return currentNode.get('id') === 7;
      });

      expect(result).to.equal(true);
      expect(targetNode).to.equal(undefined);
    });

    it('Remove incorrect criteria', function() {
      tree = generateTreeDefault();
      const result = tree.remove((currentNode) => {
        return currentNode.get('id') === 100;
      });
      const targetNode = tree.contains((currentNode) => {
        return currentNode.get('id') === 100;
      });

      expect(result).to.equal(false);
      expect(targetNode).to.equal(undefined);
    });

  });


  describe('Move', function() {

    it('Move exists branch', function() {
      tree = generateTreeDefault();
      const search = (currentNode) => currentNode.get('id') === 7;
      const destination = (currentNode) => currentNode.get('id') === 3;
      const result = tree.move(search, destination);
      const targetNode = tree.contains(search);

      expect(result).to.equal(true);
      expect(targetNode.get('id')).to.equal(7);
      expect(targetNode.parent.get('id')).to.equal(3);

      // showTree(tree);
    });

    it('Move not exists branch', function() {
      tree = generateTreeDefault();
      const search = (currentNode) => currentNode.get('id') === 100
      const destination = (currentNode) => currentNode.get('id') === 3;
      const result = tree.move(search, destination);
      const targetNode = tree.contains(search);

      expect(result).to.equal(false);
      expect(targetNode).to.equal(undefined);
    });

  });


  describe('Traversal', function() {

    it('Add new property for each node', function() {
      tree = generateTreeDefault();
      tree.traversal(null, (currentNode) => {
        currentNode.set('some', true);
      });

      tree.traversal(null, (currentNode) => {
        const some = currentNode.get('some');
        expect(some).to.equal(true);
      });
    });

    it('Add new property only for even nodes', function() {
      tree = generateTreeDefault();
      tree.traversal(null, (currentNode) => {
        if (currentNode.get('id')%2 === 0) {
          currentNode.set('some', true);
        }
      });

      tree.traversal(null, (currentNode) => {
        const some = currentNode.get('some');
        if (currentNode.get('id')%2 === 0) {
          expect(some).to.equal(true);
        } else {
          expect(some).to.equal(undefined);
        }
      });
    });

  });


  describe('Sort', function() {

    it('Order desc', function() {
      tree = generateTreeDefault();
      tree.sort(compareById(false));

      expect(tree.rootNode.children[0].get('id')).to.equal(3);
      expect(tree.rootNode.children[1].get('id')).to.equal(2);
    });

    it('Order asc', function() {
      tree = generateTreeDefault();
      tree.sort(compareById(false));
      tree.sort(compareById(true));

      expect(tree.rootNode.children[0].get('id')).to.equal(2);
      expect(tree.rootNode.children[1].get('id')).to.equal(3);

      // showTree(tree);
    });

  });


  describe('toJson', function() {

    it('Searialize tree to json', function() {
      tree = generateTreeDefault();
      const json = tree.toJson();

      expect(json.id).to.equal(1);
      expect(json.children[0].id).to.equal(2);
      expect(json.children[0].children[0].id).to.equal(7);
      expect(json.children[0].children[0].children[0].id).to.equal(8);
      expect(json.children[1].id).to.equal(3);
      expect(json.children[1].children[0].id).to.equal(4);
      expect(json.children[1].children[0].children[0].id).to.equal(5);
    });

    it('Searialize tree to json after sort desc', function() {
      tree = generateTreeDefault();
      tree.sort(compareById(false));
      const json = tree.toJson();

      expect(json.id).to.equal(1);
      expect(json.children[1].id).to.equal(2);
      expect(json.children[1].children[0].id).to.equal(7);
      expect(json.children[1].children[0].children[0].id).to.equal(8);
      expect(json.children[0].id).to.equal(3);
      expect(json.children[0].children[0].id).to.equal(4);
      expect(json.children[0].children[0].children[0].id).to.equal(5);
    });

    it('Searialize tree to json after remove element', function() {
      tree = generateTreeDefault();
      tree.remove((parentNode) => parentNode.get('id') === 2);
      const json = tree.toJson();

      expect(json.id).to.equal(1);
      expect(json.children[0].id).to.equal(3);
      expect(json.children[0].children[0].id).to.equal(4);
      expect(json.children[0].children[0].children[0].id).to.equal(5);
    });

    it('Searialize tree to json with options: key_children=child', function() {
      tree = generateTreeDefault();
      const json = tree.toJson({
        key_children: 'child',
      });

      expect(json.id).to.equal(1);
      expect(json.child[0].id).to.equal(2);
      expect(json.child[0].child[0].id).to.equal(7);
      expect(json.child[0].child[0].child[0].id).to.equal(8);
      expect(json.child[1].id).to.equal(3);
      expect(json.child[1].child[0].id).to.equal(4);
    });

    describe('Options', function() {

      it('Flag: empty_children', function() {
        tree = generateTreeDefault();
        const json = tree.toJson({
          empty_children: false,
        });

        expect(json.children[0].children[0].children[0].id).to.equal(8);
        expect(json.children[0].children[0].children[0].children).to.equal(undefined);
      });

    });

  });


  describe('Options', function() {

    it('Flags: key_id and key_parent', function() {
      const object = { uid: 1, title: 'Root'};
      const tree = new Tree(object);

      const list = [
        { uid: 2, _parent: 1 },
        { uid: 3, _parent: 1 },
        { uid: 4, _parent: 3 },
        { uid: 5, _parent: 4 },
        { uid: 6, _parent: 5 },
        { uid: 7, _parent: 2 },
        { uid: 8, _parent: 7 },
      ]
      .map((item) => {
        item.title = `Node ${item.uid}`;
        return item;
      })
      .forEach((item) => {
        tree.add((parentNode) => {
          return parentNode.get('uid') === item._parent;
        }, item);
      });

      // showTree(tree);
      // console.log(tree.toJson({ key_children: 'child' }));

      expect(tree instanceof Tree).to.equal(true);
      expect(tree.rootNode instanceof Node).to.equal(true);

      expect(tree.rootNode.get('uid')).to.equal(1);
      expect(tree.rootNode.children[0].get('uid')).to.equal(2);
      expect(tree.rootNode.children[1].get('uid')).to.equal(3);

      expect(tree.rootNode.children[1].children[0].get('uid')).to.equal(4);
      expect(tree.rootNode.children[1].children[0].children[0].get('uid')).to.equal(5);
      expect(tree.rootNode.children[1].children[0].children[0].children[0].get('uid')).to.equal(6);

    });

  });

});
