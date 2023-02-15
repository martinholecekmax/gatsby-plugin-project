const { GraphQLClient } = require('graphql-request');

exports.createClient = (url) => {
  return new GraphQLClient(url);
};
