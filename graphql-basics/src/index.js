import { GraphQLServer } from 'graphql-yoga';
import { Comment, Mutation, Post, Query, User } from './resolvers';
import db from './db';

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  context: {
    db,
  },
  resolvers: {
    Query,
    Mutation,
    User,
    Post,
    Comment,
  },
});

server.start(() => {
  console.log('Server is running on localhost:4000');
});
