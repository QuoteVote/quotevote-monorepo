const ogTitle = 'Replaced Title';
const testCases = [
  '<meta property="og:title" content="Quote.Vote – The Internet\'s Quote Board" />',
  '<meta property="og:title" content="Quote.Vote – The Internet\'s Quote Board">',
  '<meta property=og:title content="Quote.Vote – The Internet\'s Quote Board">',
  '<meta content="Quote.Vote – The Internet\'s Quote Board" property="og:title" />',
];

const regex = /<meta[^>]*property=["']?og:title["']?[^>]*>/i;

testCases.forEach(html => {
  const result = html.replace(regex, `<meta property="og:title" content="${ogTitle}" />`);
  console.log("Original:", html);
  console.log("Replaced:", result);
  console.log("---");
});
