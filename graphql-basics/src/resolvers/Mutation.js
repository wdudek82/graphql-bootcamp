import uuidv4 from 'uuid';

export default {
  createUser(parent, args, { db }, info) {
    const isEmailTaken = db.users.some(
      (user) => user.email === args.data.email,
    );

    if (isEmailTaken) {
      throw new Error('Email is taken');
    }

    const newUser = {
      id: uuidv4(),
      ...args.data,
    };

    db.users.push(newUser);

    return newUser;
  },
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const users = db.users.filter((user) => user.id !== id);
    const userFound = db.users.find((user) => user.id === id);

    console.log('User:', userFound, id);

    if (!userFound) {
      throw new Error('User not found.');
    }

    const emailTaken = db.users.some((user) => user.email === data.email);
    if (emailTaken) {
      throw new Error('Email taken.');
    }

    const updUser = {
      ...userFound,
      ...data,
    };

    db.users = [...users, updUser];

    return updUser;
  },
  deleteUser(parent, args, { db, pubsub }, info) {
    const { id } = args;
    const userIndex = db.users.findIndex((user) => user.id === id);

    if (userIndex === -1) throw new Error('User not found.');

    const deletedUsers = db.users.splice(userIndex, 1);

    db.posts = db.posts.filter((post) => {
      const match = post.author === id;

      if (match) {
        db.comments = db.comments.filter(
          (comment) => comment.post === match.id,
        );
      }

      return !match;
    });

    db.comments = db.comments.filter((comment) => comment.author !== id);

    return deletedUsers[0];
  },
  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author);

    if (!userExists) {
      throw new Error('User with this id does not exits.');
    }

    const newPost = {
      id: uuidv4(),
      ...args.data,
    };

    db.posts.push(newPost);

    if (args.data.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: newPost,
        },
      });
    }

    return newPost;
  },
  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const posts = db.posts.filter((post) => post.id !== id);
    const postFound = db.posts.find((post) => post.id === id);

    if (!postFound) {
      throw new Error('No post found.');
    }

    const updPost = {
      ...postFound,
      ...data,
    };

    db.posts = [...posts, updPost];

    if (updPost.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: updPost,
        },
      });
    }

    return updPost;
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);

    if (postIndex === -1) throw Error('Post not found.');

    const deletedPost = db.posts.splice(postIndex, 1)[0];

    db.comments = db.comments.filter((comment) => comment.post !== args.id);

    if (deletedPost.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: deletedPost,
        },
      });
    }

    return deletedPost;
  },
  createComment(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author);
    const postExists = db.posts.some(
      (oldPost) => oldPost.id === args.data.post,
    );
    const isPublished = db.posts.find((p) => p.id === args.data.post).published;

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

    pubsub.publish(`comment ${args.data.post}`, { comment: newComment });

    db.comments.push(newComment);

    return newComment;
  },
  updateComment(parent, args, { db }, info) {
    const { id, data } = args;
    const comments = db.comments.filter((comment) => comment.id !== id);
    const commentFound = db.comments.find((comment) => comment.id === id);

    if (!commentFound) {
      throw new Error('Comment not found');
    }

    const updComment = {
      ...commentFound,
      ...data,
    };

    db.comments = [...comments, updComment];

    return updComment;
  },
  deleteComment(parent, args, { db }, info) {
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id,
    );

    if (commentIndex === -1) throw new Error('Comment not found');

    const deletedComment = db.comments.splice(commentIndex, 1);

    return deletedComment[0];
  },
};
