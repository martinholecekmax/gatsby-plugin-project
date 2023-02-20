exports.ALL_CATEGORIES = `
  query Products {
    allCategories {
      id
      title
      description
      products {
        id
      }
      createdAt
      updatedAt
    }
  }
`;
