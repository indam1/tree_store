import { assert } from 'chai';
import {TreeStore} from "../src/index.js";

describe('TreeStore', () => {
    const items = [
        { id: 1, parent: 'root' },
        { id: 2, parent: 1, type: 'test' },
        { id: 3, parent: 1, type: 'test' },

        { id: 4, parent: 2, type: 'test' },
        { id: 5, parent: 2, type: 'test' },
        { id: 6, parent: 2, type: 'test' },

        { id: 7, parent: 4, type: null },
        { id: 8, parent: 4, type: null },
    ];
    const ts = new TreeStore(items);
    it('getAll', () => {
        assert.deepEqual(ts.getAll(), items, '1 getAll not working (must be same)');
        assert.notDeepEqual(ts.getAll(), [], '2 getAll not working (must be wrong)');
        assert.notDeepEqual(ts.getAll(), [
            { id: 1, parent: 'root', type: 'kek' },
            { id: 2, parent: 1, type: 'test' },
            { id: 3, parent: 1, type: 'test' },
            { id: 4, parent: 2, type: 'test' },
            { id: 5, parent: 2, type: 'test' },
            { id: 6, parent: 2, type: 'test' },
            { id: 7, parent: 4, type: null },
            { id: 8, parent: 4, type: null },
        ], '3 getAll not working (must be wrong)');
    });

    it('getItem', () => {
        assert.deepEqual(ts.getItem(7), { id: 7, parent: 4, type: null }, '1 getItem not working (must be same)');
        assert.notDeepEqual(ts.getItem(7), { id: 7, parent: 3, type: null }, '2 getItem not working (must be wrong)');
    });

    it('getChildren', () => {
        assert.deepEqual(ts.getChildren(4), [
            { id: 7, parent: 4, type: null },
            { id: 8, parent: 4, type: null }
        ], ' 1 getChildren not working (must be same)');
        assert.deepEqual(ts.getChildren(5), [], '2 getChildren not working (must be empty)');
        assert.deepEqual(ts.getChildren(2), [
            { id: 4, parent: 2, type: 'test'},
            { id: 5, parent: 2, type: 'test'},
            { id: 6, parent: 2, type: 'test'}
        ], '3 getChildren not working (must be same)');
        assert.notDeepEqual(ts.getChildren(4), [], '4 getChildren not working (must be wrong)');
    });

    it('getAllChildren', () => {
        assert.deepEqual(ts.getAllChildren(2),  [
            { id: 4, parent: 2, type: 'test'},
            { id: 5, parent: 2, type: 'test'},
            { id: 6, parent: 2, type: 'test'},
            { id: 7, parent: 4, type: null},
            { id: 8, parent: 4, type: null}
        ], '1 getAllChildren not working (must be same)');
        assert.notDeepEqual(ts.getAllChildren(2), [], '2 getAllChildren not working (must be wrong)')
    })

    it('getAllParents', () => {
        assert.deepEqual(ts.getAllParents(7), [
            {"id":4,"parent":2,"type":"test"},
            {"id":2,"parent":1,"type":"test"},
            {"id":1,"parent":"root"}
        ], '1 getAllParents not working (must be same)');
        assert.notDeepEqual(ts.getAllParents(7), [], '2 getAllParents not working (must be wrong')
    })
})
