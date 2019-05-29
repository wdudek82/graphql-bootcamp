export default {
  users(parent, args, { db }, info) {
    const hasName = Object.prototype.hasOwnProperty.call(args, 'name');

    if (hasName) {
      return db.users.filter((user) => {
        return user.name.toLowerCase() === args.name.toLowerCase();
      });
    }
    return db.users;
  },
  user(parent, args, { db }, info) {
    const { id } = args;

    return db.users.find((user) => user.id === id);
  },
  posts(parent, args, { db }, info) {
    const hasQuery = Object.prototype.hasOwnProperty.call(args, 'query');

    if (!hasQuery) return db.posts;

    return db.posts.filter(({ title, body }) => {
      const lowerTitle = title.toLowerCase();
      const lowerBody = body.toLowerCase();
      const lowerQuery = args.query.toLowerCase();

      return (
        lowerTitle.includes(lowerQuery) || lowerBody.includes(lowerQuery)
      );
    });
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  },
  userPosts(_, { author }, { db }) {
    return db.posts.filter((post) => post.author === author);
  },
};
