type NodeId = string|number;

interface RawNode {
    id: NodeId,
    parent: NodeId,
    type?: string,
}

interface MapNode extends RawNode {
    children: NodeId[],
}

class TreeStore {
    _nodes: RawNode[];

    _map = new Map<NodeId, MapNode>();

    constructor(nodes) {
        this._nodes = nodes;
        this._nodes.forEach(node => {
            const child = this._map.get(node.id);
            this._map.set(node.id, {
                ...node,
                ...child,
            });

            const parent = this._map.get(node.parent);
            this._map.set(node.parent, {
                ...parent,
                children: [...(parent?.children ?? []), node.id],
            });
        })
    }

    getAll(): RawNode[] {
        return this._nodes;
    }

    getItem(id: NodeId): RawNode {
        const node = this._map.get(id);
        if (!node) {
            throw new Error(`No node with id ${id}`);
        }
        const { children, ...rawNode } = node;
        return rawNode;
    }

    getChildren(id: NodeId): RawNode[] {
        const node = this._map.get(id);
        if (!node) {
            throw new Error(`No node with id ${id}`);
        }
        return node.children ? node.children.map(childId => this.getItem(childId)) : [];
    }

    getAllChildren(id: NodeId): RawNode[] {
        let children = this.getChildren(id);
        const allChildren = [...children];
        while (children.length > 0) {
            let comparisonChildren = [];
            children.forEach(child => {
                const nextChildren = this.getChildren(child.id);
                allChildren.push(...nextChildren);
                comparisonChildren.push(...nextChildren);
            })
            children = [];
            [children, comparisonChildren] = [comparisonChildren, children];
        }
        return allChildren;
    }

    getAllParents(id: NodeId): RawNode[] {
        let lastParent = this.getItem(id);
        const allParents = [];
        while (lastParent.parent !== 'root') {
            lastParent = this.getItem(lastParent.parent);
            allParents.push(lastParent);
        }
        return allParents;
    }
}

export { TreeStore }

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
console.log(ts.getAllChildren(2));
