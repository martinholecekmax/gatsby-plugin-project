exports.createPages = async function ({ actions, graphql }) {
  const { data } = await graphql(`
    query {
      allProduct {
        nodes {
          id
          title
          path
        }
      }
    }
  `);
  data.allProduct.nodes.forEach((node) => {
    actions.createPage({
      path: node.path,
      component: require.resolve(`./src/templates/product.js`),
      context: { slug: node.path },
    });
  });
};
