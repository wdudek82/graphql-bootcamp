import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

// Type definitions
const typeDefs = `
  type Query {
    users(name: String): [User!]!
    user(id: ID!): User
    posts(query: String): [Post!]!
    comments: [Comment!]!
    product: Product!
    userPosts(author: String!): [Post!]
  }

  type Mutation {
    createUser(data: CreateUserInput!): User!
    deleteUser(id: ID!): User!
    createPost(data: CreatePostInput!): Post!
    deletePost(id: ID!): Post!
    createComment(data: CreateCommentInput!): Comment!
    deleteComment(id: ID!): Comment!
  }
  
  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }
  
  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }
  
  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
  }

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
`;

let postList = [
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

let commentList = [
  {
    id: '1',
    text: 'Comment 1A',
    author: '1',
    post: '1',
  },
  {
    id: '2',
    text: 'Comment 1B',
    author: '2',
    post: '1',
  },
  {
    id: '3',
    text: 'Comment 2',
    author: '3',
    post: '2',
  },
  {
    id: '4',
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
  Mutation: {
    createUser(parent, args, context, info) {
      const isEmailTaken = userList.some(
        (user) => user.email === args.data.email,
      );

      if (isEmailTaken) {
        throw new Error('Email is taken');
      }

      const newUser = {
        id: uuidv4(),
        ...args.data,
      };

      userList.push(newUser);

      return newUser;
    },
    deleteUser(parent, args, context, info) {
      const { id } = args;
      const userIndex = userList.findIndex((user) => user.id === id);

      if (userIndex === -1) throw new Error('User not found.');

      const deletedUsers = userList.splice(userIndex, 1);

      postList = postList.filter((post) => {
        const match = post.author === id;

        if (match) {
          commentList = commentList.filter(
            (comment) => comment.post === match.id,
          );
        }

        return !match;
      });

      commentList = commentList.filter((comment) => comment.author !== id);

      return deletedUsers[0];
    },
    createPost(parent, args, context, info) {
      const userExists = userList.some((user) => user.id === args.data.author);

      if (!userExists) {
        throw new Error('User with this id does not exits.');
      }

      const newPost = {
        id: uuidv4(),
        ...args.data,
      };

      postList.push(newPost);

      return newPost;
    },
    deletePost(parent, args, context, info) {
      const postIndex = postList.findIndex((post) => post.id === args.id);

      if (postIndex === -1) throw Error('Post not found.');

      const deletedPost = postList.splice(postIndex, 1);

      commentList = commentList.filter((comment) => comment.post !== args.id);

      return deletedPost[0];
    },
    createComment(parent, args, context, info) {
      const userExists = userList.some((user) => user.id === args.data.author);
      const postExists = postList.some(
        (oldPost) => oldPost.id === args.data.post,
      );
      const isPublished = postList.find((p) => p.id === args.data.post)
        .published;

      if (!userExists) {
        throw new Error('User with this id does not exists.');
      }
      if (!postExists) {
        throw new Error('Post with this id does not exists.');
      } else if (!isPublished) {
        throw new Error('Post is not yet published.');
      }

      const newComment = {
        id: uuidv4(),
        ...args.data,
      };

      commentList.push(newComment);

      return newComment;
    },
    deleteComment(parent, args, context, info) {
      const commentIndex = commentList.findIndex(
        (comment) => comment.id === args.id,
      );

      if (commentIndex === -1) throw new Error('Comment not found');

      return commentList.splice(commentIndex, 1)[0];
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
