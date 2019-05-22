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
    author: String!
    title: String!
    body: String!
    published: Boolean!
  }

  type Query {
    greeting(name: String): String!
    add(numbers: [Float!]!): Float!
    name: String!
    age: Int!
    employed: Boolean!
    gpa: Float
    user: User!
    product: Product!
    posts: [Post!]
    userPosts(author: String!): [Post!]
  }
`;

const postList = [
  {
    id: '1',
    author: 'Neevor',
    title: 'New post 1',
    body: 'This is new post 1',
    published: true,
  },
  {
    id: '2',
    author: 'Foo',
    title: 'New post 2',
    body: 'This is new post 2',
    published: false,
  },
  {
    id: '3',
    author: 'Neevor',
    title: 'New post 3',
    body: 'This is new post 3',
    published: false,
  },
];

// Resolvers
const resolvers = {
  Query: {
    greeting(parent, args, context, info) {
      const { name } = args;

      console.log('Parent:', parent);
      console.log('Args:', args);
      console.log('Context:', context);
      console.log('Info:', info);

      return `Hello ${name || 'World'}`;
    },
    add(_, args) {
      return args.numbers.reduce((acc, val) => acc + val, 0);
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
        posts: postList,
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
    posts() {
      return postList;
    },
    userPosts(_, { author }) {
      console.log(author);
      return postList.filter((post) => post.author === author);
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log('Server is running on localhost:4000');
});
