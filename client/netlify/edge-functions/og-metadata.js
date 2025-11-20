/**
 * Netlify Edge Function to inject dynamic Open Graph metadata for quote pages
 * 
 * This function intercepts requests to /post/:group/:title/:postId routes,
 * fetches the quote data from the GraphQL API, and injects dynamic OG tags
 * into the HTML before serving it to social media scrapers.
 */

export default async (request, context) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Only process /post/* routes
  if (!pathname.startsWith('/post/')) {
    return context.next();
  }

  // Extract postId from URL path: /post/:group/:title/:postId
  const pathParts = pathname.split('/').filter(Boolean);
  if (pathParts.length < 4 || pathParts[0] !== 'post') {
    return context.next();
  }

  const postId = pathParts[3]; // The 4th segment is the postId

  // Determine the GraphQL API URL based on environment
  const graphqlUrl = Deno.env.get('GRAPHQL_API_URL') || 'https://api.quote.vote/graphql';

  try {
    // Fetch quote data from GraphQL API
    const graphqlQuery = {
      query: `
        query post($postId: String!) {
          post(postId: $postId) {
            _id
            title
            text
            url
          }
        }
      `,
      variables: { postId }
    };

    const graphqlResponse = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlQuery),
    });

    if (!graphqlResponse.ok) {
      console.error('[Edge Function] GraphQL request failed:', graphqlResponse.status);
      return context.next();
    }

    const graphqlData = await graphqlResponse.json();
    const post = graphqlData?.data?.post;

    // If post not found or deleted, serve default metadata
    if (!post) {
      console.log('[Edge Function] Post not found:', postId);
      return context.next();
    }

    // Fetch the original HTML response
    const response = await context.next();
    const html = await response.text();

    // Generate dynamic OG metadata
    const ogTitle = post.title || "Quote.Vote – The Internet's Quote Board";
    const ogDescription = post.text 
      ? post.text.substring(0, 140).replace(/\n/g, ' ').trim() + (post.text.length > 140 ? '...' : '')
      : 'Discover, share, and vote on the best quotes. Join the Quote.Vote community!';
    const ogImage = post.url || 'https://quote.vote/assets/og-default.jpg';
    const ogUrl = `https://quote.vote${pathname}`;

    // Replace default OG tags with dynamic values
    let modifiedHtml = html;

    // Replace og:title
    modifiedHtml = modifiedHtml.replace(
      /<meta property="og:title" content="[^"]*" \/>/,
      `<meta property="og:title" content="${escapeHtml(ogTitle)}" />`
    );

    // Replace og:description
    modifiedHtml = modifiedHtml.replace(
      /<meta property="og:description" content="[^"]*" \/>/,
      `<meta property="og:description" content="${escapeHtml(ogDescription)}" />`
    );

    // Replace og:image
    modifiedHtml = modifiedHtml.replace(
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${escapeHtml(ogImage)}" />`
    );

    // Replace og:url
    modifiedHtml = modifiedHtml.replace(
      /<meta property="og:url" content="[^"]*" \/>/,
      `<meta property="og:url" content="${escapeHtml(ogUrl)}" />`
    );

    // Replace og:type to "article" for quote pages
    modifiedHtml = modifiedHtml.replace(
      /<meta property="og:type" content="[^"]*" \/>/,
      `<meta property="og:type" content="article" />`
    );

    // Replace Twitter card metadata
    modifiedHtml = modifiedHtml.replace(
      /<meta name="twitter:title" content="[^"]*" \/>/,
      `<meta name="twitter:title" content="${escapeHtml(ogTitle)}" />`
    );

    modifiedHtml = modifiedHtml.replace(
      /<meta name="twitter:description" content="[^"]*" \/>/,
      `<meta name="twitter:description" content="${escapeHtml(ogDescription)}" />`
    );

    modifiedHtml = modifiedHtml.replace(
      /<meta name="twitter:image" content="[^"]*" \/>/,
      `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`
    );

    // Replace page title
    modifiedHtml = modifiedHtml.replace(
      /<title>[^<]*<\/title>/,
      `<title>${escapeHtml(ogTitle)}</title>`
    );

    // Return modified HTML
    return new Response(modifiedHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=600', // Cache for 5-10 minutes
      },
    });

  } catch (error) {
    console.error('[Edge Function] Error processing request:', error);
    // On error, serve the original HTML with default metadata
    return context.next();
  }
};

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
