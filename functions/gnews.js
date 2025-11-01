// functions/gnews.js

export async function onRequest(context) {
  // Get the search parameters from the URL
  const { searchParams } = new URL(context.request.url);
  const query = searchParams.get('q');
  const lang = searchParams.get('lang');
  const max = searchParams.get('max');

  if (!query) {
    return new Response('Missing query parameter', { status: 400 });
  }

  // =================================================================
  // YOUR NEW GNEWS API KEY IS HARDCODED HERE
  // =================================================================
  const GNEWS_API_KEY = "d0c8c2bf756ac24d5c7d3eceb2fa49eb";
  // =================================================================

  // Construct the real GNews API URL
  const gnewsUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=${lang}&max=${max}&apikey=${GNEWS_API_KEY}`;

  // Make the API call from the server.
  const gnewsResponse = await fetch(gnewsUrl);

  const data = await gnewsResponse.json();

  // Create a new response to send back to our front-end, with the magic CORS header.
  const response = new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });

  return response;
}