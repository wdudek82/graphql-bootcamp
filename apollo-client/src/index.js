import ApolloBoost, { gql } from 'apollo-boost';

const client = new ApolloBoost({
  uri: 'http://localhost:4466',
});

const postsRoot = document.getElementById('posts');
const usersRoot = document.getElementById('users');

const UsersQuery = gql`
    query Users {
        users {
            id
            name
        }
    }
`;

client
  .query({
    query: UsersQuery,
  })
  .then(res => {
    let html = '';

    res.data.users.forEach(user => {
      html += `
        <div>
          <h3>${user.name}</h3>
        </div>
      `;
    });

    usersRoot.innerHTML = html;
  });

const PostsQuery = gql`
    query Posts {
        posts {
            title
            body
            published
            author {
                id
                name
            }
        }
    }
`;

client
  .query({
    query: PostsQuery,
  })
  .then(res => {
    let html = '';

    res.data.posts.forEach((post, index) => {
      html += `
            <div>
              <h2>${index + 1}. ${post.title}</h2>
              <h3>author: ${post.author.name}</h3>
              <p>${post.body}</p>
              <p>is published: ${post.published}</p>
            </div>`;

      postsRoot.innerHTML = html;
    });
  });
