/**
 * Netlify Edge Function to inject dynamic Open Graph metadata for quote pages.
 *
 * When a user shares a link like https://quote.vote/post/:group/:title/:postId
 * in iMessage, Facebook, Twitter, Slack, etc., the social media crawler fetches
 * the URL but does NOT execute JavaScript. This edge function intercepts those
 * requests on the CDN edge, fetches the quote data from the GraphQL API, and
 * rewrites the default OG meta tags in the HTML with the quote-specific values
 * so the link preview shows the quote title and text instead of the generic
 * "The Internet's Quote Board" default.
 *
 * Route: /post/* (configured in netlify.toml)
 */

// Common social media / link preview bot user-agent patterns.
// We use this to optimise: for regular browser requests we can skip the
// GraphQL fetch and just let the SPA handle everything client-side. For
// bots/crawlers we *must* inject the OG tags server-side because they
// don't run JavaScript.
const BOT_USER_AGENTS = [
  'facebookexternalhit',
  'Facebot',
  'Twitterbot',
  'LinkedInBot',
  'WhatsApp',
  'Slackbot',
  'Discordbot',
  'TelegramBot',
  'Googlebot',
  'bingbot',
  'iMessageBot',
  'Applebot',
  'Pinterest',
  'Embedly',
  'Quora Link Preview',
  'Showyou',
  'OutbrainBot',
  'vkShare',
  'W3C_Validator',
  'redditbot',
  'Rogerbot',
  'SeznamBot',
  'SkypeUriPreview',
];

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

  // Check if the request is from a social media crawler / link preview bot.
  // For normal browsers the React app will handle OG via react-helmet,
  // so we can skip the server-side injection to reduce latency.
  const userAgent = request.headers.get('user-agent') || '';
  const isBot = BOT_USER_AGENTS.some((bot) =>
    userAgent.toLowerCase().includes(bot.toLowerCase())
  );

  // If it's not a bot, still inject metadata as a best practice since some
  // crawlers may not be in our bot list (e.g. iMessage on iOS doesn't always
  // send a recognisable user-agent). We'll always inject for /post/* pages.
  // The overhead is a single GraphQL fetch per edge request, with caching.

  // Determine the GraphQL API URL based on environment
  const graphqlUrl =
    Deno.env.get('GRAPHQL_API_URL') || 'https://api.quote.vote/graphql';

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
            creator {
              name
              avatar
            }
          }
        }
      `,
      variables: { postId },
    };

    const graphqlResponse = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlQuery),
    });

    if (!graphqlResponse.ok) {
      console.error(
        '[Edge Function] GraphQL request failed:',
        graphqlResponse.status
      );
      return context.next();
    }

    const graphqlData = await graphqlResponse.json();

    // Check for GraphQL errors in response body
    if (graphqlData.errors && graphqlData.errors.length > 0) {
      console.error('[Edge Function] GraphQL errors:', graphqlData.errors);
      return context.next();
    }

    const post = graphqlData?.data?.post;

    // If post not found or deleted, serve default metadata
    if (!post) {
      console.log('[Edge Function] Post not found:', postId);
      return context.next();
    }

    // Fetch the original HTML response
    const response = await context.next();
    const html = await response.text();

    // Build descriptive OG metadata for the specific quote.
    //
    // For the title we format it as:
    //   "Quote Title – by Author Name" (if author name available)
    //   "Quote Title – Quote.Vote" (fallback)
    //
    // For the description we use the first 200 characters of the quote text.
    const authorName = post.creator?.name;
    const ogTitle = post.title
      ? authorName
        ? `${post.title} – by ${authorName}`
        : `${post.title} – Quote.Vote`
      : "Quote.Vote – The Internet's Quote Board";

    const ogDescription = post.text
      ? post.text
          .substring(0, 200)
          .replace(/\n/g, ' ')
          .replace(/\s+/g, ' ')
          .trim() + (post.text.length > 200 ? '…' : '')
      : 'Discover, share, and vote on the best quotes. Join the Quote.Vote community!';

    // Use the default OG image – it's a branded image that works well for
    // link previews. The creator's avatar is too small for og:image.
    const ogImage = 'https://quote.vote/assets/og-default.jpg';
    const ogUrl = `https://quote.vote${pathname}`;

    // Replace default OG tags with dynamic values.
    // Each regex matches the default tag pattern from index.html.
    let modifiedHtml = html;

    // Replace page title
    modifiedHtml = modifiedHtml.replace(
      /<title>[^<]*<\/title>/,
      `<title>${escapeHtml(ogTitle)}</title>`
    );

    // Replace meta description
    modifiedHtml = modifiedHtml.replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${escapeHtml(ogDescription)}" />`
    );

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

    // Return modified HTML with appropriate caching headers.
    // Short cache so updates to quotes reflect within a few minutes.
    return new Response(modifiedHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=600', // 5-10 min cache
      },
    });
  } catch (error) {
    console.error('[Edge Function] Error processing request:', error);
    // On error, serve the original HTML with default metadata
    return context.next();
  }
};

/**
 * Escape HTML special characters to prevent XSS in meta tag content.
 */
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
