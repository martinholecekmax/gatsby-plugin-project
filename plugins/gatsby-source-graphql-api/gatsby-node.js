const { createClient } = require('./create-client');

const { processProducts } = require('./nodes/product-node');

const { PRODUCT_NODE_TYPE, CATEGORY_NODE_TYPE } = require('./types');

exports.sourceNodes = async (
  {
    actions,
    createNodeId,
    createContentDigest,
    getNodesByType,
    cache,
    reporter,
    getNode,
  },
  configOptions
) => {
  const { createNode, touchNode, deleteNode } = actions;

  const client = createClient(configOptions.url);

  getNodesByType(CATEGORY_NODE_TYPE).forEach((node) => touchNode(node));

  // Time functions
  let start = Date.now();

  const { allProducts: allProductsUpdate } = await client.request(
    ALL_PRODUCTS_UPDATED
  );

  stop = Date.now();
  reporter.info(
    `Downloading updated data from graphql server took ${stop - start}ms`
  );

  let touchedProductsCount = 0;
  let createdProductsCount = 0;

  for (const product of allProductsUpdate) {
    // Check if products are in the cache
    const cachedProduct = await cache.get(product.id);
    const [existingProductId, updated] = cachedProduct?.split('>>>') || [];
    const nodeId = createNodeId(`${PRODUCT_NODE_TYPE}-${existingProductId}`);

    const existingProductNode = getNode(nodeId);

    // If the product is in the cache and the product has not been updated
    if (existingProductNode && updated === product.updated) {
      // Touch the product node to ensure it isn't garbage collected
      touchNode(existingProductNode);
      // reporter.info(`Product ${product.id} has not been updated`)
      touchedProductsCount++;
    } else {
      // If the product is not in the cache or the product has been updated
      // Fetch the product by id
      const { product: updatedProduct } = await client.request(PRODUCT_BY_ID, {
        id: product.id,
      });
      // Create a new product node
      processProducts({
        product: updatedProduct,
        createNodeId,
        createContentDigest,
        createNode,
      });

      // Add the product to the cache
      await cache.set(
        product.id,
        `${updatedProduct.id}>>>${updatedProduct.updated}`
      );
      // reporter.info(
      //   `Product ${product.id} has been updated ${updatedProduct.updated} - ${updated}`
      // )
      createdProductsCount++;
    }
  }
  stop = Date.now();
  reporter.info(
    `Number of Touched ${touchedProductsCount} products and Created ${createdProductsCount} products`
  );
  reporter.info(`Updating products took ${stop - start}ms`);

  const { allCategories } = await client.request(ALL_CATEGORIES);

  Object.keys(allCategories).forEach((key) => {
    const category = allCategories[key];
    const nodeData = processCategories({
      category,
      createNodeId,
      createContentDigest,
    });
    createNode(nodeData);
  });

  return;
};

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions;
  const typeDefs = [
    `
    type Category implements Node {
      products: [Product]
      subcategories: [Category]
    }
    type Product implements Node {
      groupProducts: [Product]
    }
    `,
    schema.buildObjectType({
      name: 'Category',
      fields: {
        products: {
          type: ['Product'],
          resolve: async (source, args, context) => {
            const { products } = source;
            if (
              source.products === null ||
              (Array.isArray(products) && !products.length)
            ) {
              return null;
              // return ["uncategorized"]
            }
            return source.products.map((product) => {
              return context.nodeModel.findOne({
                query: {
                  filter: {
                    mongo_id: {
                      eq: product.id,
                    },
                  },
                },
                type: 'Product',
              });
            });
          },
        },
        subcategories: {
          type: ['Category'],
          resolve: async (source, args, context) => {
            const { subcategories } = source;
            if (
              source.subcategories === null ||
              (Array.isArray(subcategories) && !subcategories.length)
            ) {
              return null;
              // return ["uncategorized"]
            }
            return source.subcategories.map((category) => {
              return context.nodeModel.findOne({
                query: {
                  filter: {
                    mongo_id: {
                      eq: category.id,
                    },
                  },
                },
                type: 'Category',
              });
            });
          },
        },
      },
    }),
    schema.buildObjectType({
      name: 'Product',
      fields: {
        groupProducts: {
          type: ['Product'],
          resolve: async (source, args, context) => {
            const { groupProducts } = source;
            if (
              source.groupProducts === null ||
              (Array.isArray(groupProducts) && !groupProducts.length)
            ) {
              return null;
              // return ["uncategorized"]
            }
            return source.groupProducts.map((product) => {
              return context.nodeModel.findOne({
                query: {
                  filter: {
                    mongo_id: {
                      eq: product.id,
                    },
                  },
                },
                type: 'Product',
              });
            });
          },
        },
      },
    }),
  ];
  createTypes(typeDefs);
};