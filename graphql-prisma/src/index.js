import { GraphQLServer, PubSub } from 'graphql-yoga';
import { Comment, Mutation, Post, Query, Subscription, User } from './resolvers';
import db from './db';

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  context: {
    db,
    pubsub,
  },
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment,
  },
});

server.start(() => {
  console.log('Server is running on localhost:4000');
});
