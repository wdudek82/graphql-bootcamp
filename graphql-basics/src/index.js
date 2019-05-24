import { GraphQLServer } from 'graphql-yoga';

// Type definitions
const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post]!
    comments: [Comment]!
  }

  type Post {
    id: ID!
    author: User!
    title: String!
    body: String!
    published: Boolean!
    comments: [Comment]!
  }
  
  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }

  type Product {
    id: ID!
    title: String!
    price: Float!
    releaseYear: Int
    rating: Float
    inStock: Boolean!
  }

  type Query {
    users(name: String): [User!]!
    user(id: ID!): User
    posts(query: String): [Post!]!
    comments: [Comment!]!
    product: Product!
    userPosts(author: String!): [Post!]
  }
`;

const postList = [
  {
    id: '1',
    author: '1',
    title: 'New post 1',
    body: 'This is new post 1',
    published: true,
  },
  {
    id: '2',
    author: '2',
    title: 'New post 2',
    body: 'This is a test 1',
    published: false,
  },
  {
    id: '3',
    author: '1',
    title: 'New post 3',
    body: 'This is new post 3',
    published: false,
  },
];

const userList = [
  {
    id: '1',
    name: 'Neevor',
    email: 'neevor@testing.com',
    age: 240,
  },
  {
    id: '2',
    name: 'Jon Doe',
    email: 'jon.doe@testing.com',
    age: 28,
  },
  {
    id: '3',
    name: 'Jane Doe',
    email: 'jane.doe@testing.com',
    age: 24,
  },
];

const commentList = [
  {
    id: '1',
    text: 'Comment 1A',
    author: '1',
    post: '1',
  },
  {
    id: '1',
    text: 'Comment 1B',
    author: '2',
    post: '1',
  },
  {
    id: '2',
    text: 'Comment 2',
    author: '3',
    post: '2',
  },
  {
    id: '3',
    text: 'Comment 3',
    author: '1',
    post: '3',
  },
];

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, context, info) {
      const hasName = Object.prototype.hasOwnProperty.call(args, 'name');

      if (hasName) {
        return userList.filter((user) => {
          return user.name.toLowerCase() === args.name.toLowerCase();
        });
      }
      return userList;
    },
    user(parent, args, context, info) {
      const { id } = args;

      return userList.find((user) => user.id === id);
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
    posts(parent, args, context, info) {
      const hasQuery = Object.prototype.hasOwnProperty.call(args, 'query');

      if (!hasQuery) return postList;

      return postList.filter(({ title, body }) => {
        const lowerTitle = title.toLowerCase();
        const lowerBody = body.toLowerCase();
        const lowerQuery = args.query.toLowerCase();

        return (
          lowerTitle.includes(lowerQuery) || lowerBody.includes(lowerQuery)
        );
      });
    },
    comments(parent, args, context, info) {
      return commentList;
    },
    userPosts(_, { author }) {
      return postList.filter((post) => post.author === author);
    },
  },
  Post: {
    author(parent, args, context, info) {
      return userList.find((user) => user.id === parent.author);
    },
    comments(parent, args, context, info) {
      return commentList.filter((comment) => parent.id === comment.post);
    },
  },
  User: {
    posts(parent, args, context, info) {
      return postList.filter((post) => parent.id === post.author);
    },
    comments(parent, args, context, info) {
      return commentList.filter((comment) => parent.id === comment.author);
    },
  },
  Comment: {
    post(parent, arts, context, info) {
      return postList.find((post) => parent.post === post.id);
    },
    author(parent, args, context, info) {
      return userList.find((user) => parent.author === user.id);
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log('Server is running on localhost:4000');
});
