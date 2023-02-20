/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    siteUrl: `https://www.yourdomain.tld`,
  },
  plugins: [
    {
      resolve: `gatsby-source-graphql-api`,
      options: {
        url: `http://localhost:4000/graphql`,
      },
    },
  ],
};
