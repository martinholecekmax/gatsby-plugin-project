import { graphql } from 'gatsby';
import React from 'react';

import * as styles from './product.module.css';

const Product = ({ data }) => {
  const product = data?.product || {};
  const image = product.images[0] || {};
  return (
    <div className={styles.container}>
      <h1>{product.title}</h1>
      <div className={styles.content}>
        <img src={image.url} alt={image.alt} />
        <div>
          <div className={styles.description}>{product.description}</div>
          <div className={styles.price}>£{product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default Product;

export const query = graphql`
  query Product($slug: String!) {
    product(path: { eq: $slug }) {
      id
      title
      description
      price
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
