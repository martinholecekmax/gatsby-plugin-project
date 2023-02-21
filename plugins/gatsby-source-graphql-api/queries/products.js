exports.ALL_PRODUCTS_UPDATED = `
  query Products {
    allProducts {
      id
      updatedAt
    }
  }
`;

exports.PRODUCT_BY_ID = `
  query Product($id: ID!) {
    product(id: $id) {
      updatedAt
      createdAt
      id
      title
      description
      price
      path
      images {
        id
        fileName
        url
        alt
        imageType
        createdAt
        rootDirectory
      }
    }
  }
`;
