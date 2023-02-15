const { PRODUCT_NODE_TYPE } = require('../types');

exports.processProducts = ({
  product,
  createNodeId,
  createContentDigest,
  createNode,
}) => {
  const { id, ...rest } = product;

  const node = {
    ...rest,
    id,
    mongo_id: id,
  };

  const nodeId = createNodeId(`${PRODUCT_NODE_TYPE}-${node.id}`);
  const nodeContent = JSON.stringify(node);
  const nodeData = Object.assign({}, node, {
    id: nodeId,
    parent: null,
    children: [],
    internal: {
      type: PRODUCT_NODE_TYPE,
      content: nodeContent,
      contentDigest: createContentDigest(node),
    },
  });
  createNode(nodeData);
};
