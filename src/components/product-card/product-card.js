import { Link } from 'gatsby';
import React from 'react';

import * as styles from './product-card.module.css';

const ProductCard = ({ product }) => {
  const image = product.images[0] || {};
  return (
    <Link to={product.path} className={styles.container}>
      <img src={image.url} alt={image.alt} className={styles.image} />
      <div className={styles.content}>
        <h3 className={styles.title}>{product.title}</h3>
        <div className={styles.description}>{product.description}</div>
        <div className={styles.price}>£{product.price.toFixed(2)}</div>
      </div>
    </Link>
  );
};

export default ProductCard;
