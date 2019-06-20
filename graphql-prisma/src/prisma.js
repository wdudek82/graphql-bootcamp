import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: './src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466',
});

function printJsonData(data) {
  console.log(JSON.stringify(data, null, 2));
}

// prisma.query
//   .users(
//     null,
//     `{
//     id
//     name
//     posts {
//       id
//       title
//     }
//     }`,
//   )
//   .then((data) => console.log(JSON.stringify(data, null, 2)));
//
// prisma.query
//   .comments(
//     null,
//     `{
//       id
//       text
//       author {
//         id
//         name
//       }
//       post {
//         id
//         title
//       }
//     }`,
//   )
//   .then((data) => console.log(JSON.stringify(data, null, 2)));

async function createPostForUser(userId, data) {
  const userExists = await prisma.exists.User({
    id: userId,
  });

  if (!userExists) {
    throw new Error('User not found');
  }

  const createdPost = await prisma.mutation.createPost({
    data: {
      ...data,
      author: {
        connect: {
          id: userId,
        },
      },
    },
  }, '{ id title body published author { id name } }');

  printJsonData(createdPost);

  return prisma.query.user({ where: { id: createdPost.author.id } }, '{ id name }');
}

const newPostData = {
  title: 'Second post [updated]',
  body: 'This is body of the second post [updated]',
  published: true,
};

createPostForUser('cjx0vkf3i006707414d5b9i4e', newPostData)
  .then(printJsonData)
  .catch(console.log);

// prisma.exists
//   .Comment({
//     id: 'cjx2840md00fc0741sll45ovo',
//     author: {
//       id: 'cjx0vkf3i006707414d5b9i4e',
//     },
//   })
//   .then(printJsonData);

// async function updatePostForUser(postId, data) {
//   const updatedPost = await prisma.mutation.updatePost(
//     {
//       where: {
//         id: postId,
//       },
//       data,
//     },
//     '{ id title body published author { id name } }',
//   );
//
//   printJsonData(updatedPost);
//
//   return prisma.query.user({ where: { id: updatedPost.author.id } });
// }

// const updatedPostData = {
//   title: 'Second post [updated]',
//   body: 'Body of second post [updated]',
//   published: true,
// };

// updatePostForUser('cjx3pi4au00gs08411k32dsje', updatedPostData)
//   .then(printJsonData)
//   .catch(console.log);
