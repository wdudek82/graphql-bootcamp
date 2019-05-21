import { GraphQLServer } from 'graphql-yoga';

// Type definitions
const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post]
  }
  
  type Product {
    id: ID!
    title: String!
    price: Float!
    releaseYear: Int
    rating: Float
    inStock: Boolean!
  }
  
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }

  type Query {
    hello(name: String): String!
    name: String!
    age: Int!
    employed: Boolean!
    gpa: Float
    user: User!
    product: Product!
    post: Post!
  }
`;

const postData = {
  id: 'fd234',
  title: 'New post',
  body: 'This is new post',
  published: false,
};

// Resolvers
const resolvers = {
  Query: {
    hello(_, { name }) {
      return `Hello ${name || 'World'}`;
    },
    name() {
      return 'Paulina';
    },
    age() {
      return 280;
    },
    employed() {
      return true;
    },
    gpa() {
      return null;
    },
    user() {
      return {
        id: '12',
        name: 'Neevor',
        email: 'neevor@testing.com',
        age: 120,
        employed: true,
        posts: [postData],
      };
    },
    product() {
      return {
        id: '3',
        title: 'Keyboard',
        price: 56.99,
        releaseYear: 2017,
        rating: 4.5,
        inStock: true,
      };
    },
    post() {
      return postData;
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log('Server is running on localhost:4000');
});
