import { graphql } from 'gatsby';
import * as React from 'react';
import ProductCard from '../components/product-card/product-card';

import * as styles from './index.module.css';

const IndexPage = ({ data }) => {
  const products = data?.allProduct?.nodes || [];
  const displayProducts = products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ));

  return (
    <div className={styles.container}>
      <h1>Home Page</h1>
      <div className={styles.products}>{displayProducts}</div>
    </div>
  );
};

export default IndexPage;

export const Head = () => <title>Home Page</title>;

export const query = graphql`
  query {
    allProduct {
      nodes {
        id
        price
        title
        path
        description
        createdAt
        updatedAt
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
  }
`;
