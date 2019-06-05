export default {
  comment: {
    subscribe(parent, { postId }, { db, pubsub }, info) {
      const postFound = db.posts.find(
        (post) => post.id === postId && post.published,
      );

      if (!postFound) {
        throw new Error('Post not found');
      }

      return pubsub.asyncIterator(`comment ${postId}`);
    },
  },
  post: {
    subscribe(parent, args, { db, pubsub }, info) {
      return pubsub.asyncIterator('post');
    },
  },
};
