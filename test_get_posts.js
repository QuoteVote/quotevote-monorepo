const graphqlUrl = 'https://api.quote.vote/graphql';
fetch(graphqlUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: '{ posts(limit: 5, offset: 0, searchKey: "", sortOrder: "newest") { entities { _id title url } } }' })
})
.then(r => r.json())
.then(d => console.log(JSON.stringify(d, null, 2)))
.catch(console.error);
