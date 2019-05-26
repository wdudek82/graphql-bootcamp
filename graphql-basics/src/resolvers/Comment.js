export default {
  post(parent, arts, { db }, info) {
    return db.posts.find((post) => parent.post === post.id);
  },
  author(parent, args, { db }, info) {
    return db.users.find((user) => parent.author === user.id);
  },
};
