const { CATEGORY_NODE_TYPE } = require('../types');

exports.processCategories = ({
  category,
  createNodeId,
  createContentDigest,
  createNode,
}) => {
  const { id, ...rest } = category;

  const node = {
    ...rest,
    id,
    mongo_id: id,
  };

  const nodeId = createNodeId(`${CATEGORY_NODE_TYPE}-${node.id}`);
  const nodeContent = JSON.stringify(node);
  const nodeData = Object.assign({}, node, {
    id: nodeId,
    parent: null,
    children: [],
    internal: {
      type: CATEGORY_NODE_TYPE,
      content: nodeContent,
      contentDigest: createContentDigest(node),
    },
  });
  createNode(nodeData);
};
