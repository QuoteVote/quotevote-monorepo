const postId = "e_6A4M";
const graphqlUrl = 'https://api.quote.vote/graphql';
const graphqlQuery = {
  query: `
    query post($postId: String!) {
      post(postId: $postId) {
        _id
        title
        text
        url
        creator {
          name
          avatar
        }
      }
    }
  `,
  variables: { postId },
};
fetch(graphqlUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(graphqlQuery),
}).then(res => res.json()).then(data => console.log(JSON.stringify(data, null, 2))).catch(err => console.error(err));
