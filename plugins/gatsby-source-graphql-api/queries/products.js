exports.ALL_PRODUCTS_UPDATED = `
  query Products {
    allProducts(input: { deleted: false }) {
      id
      updated
    }
  }
`;

exports.PRODUCT_BY_ID = `
  query Product($id: ID!) {
    product(id: $id) {
      id
      created
      updated
      status
      path
      title
      sku
      images {
        uid
        imageType
        alt
        caption
        filename
        url
        sortOrder
      }
    }
  }
`;
