import { GraphQLServer } from 'graphql-yoga';

// Type definitions
const typeDefs = `
  type User {
    id: ID!
    name: String!
    age: Int!
  }

  type Query {
    hello(name: String): String!
    user: User!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    user: () => {
      return { id: '12', name: 'Neevor', age: 120 };
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log('Server is running on localhost:4000'));
