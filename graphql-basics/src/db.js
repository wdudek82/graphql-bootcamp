const posts = [
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

const users = [
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

const comments = [
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

const db = {
  users,
  posts,
  comments,
};

export default db;
