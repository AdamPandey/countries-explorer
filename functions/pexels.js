// functions/pexels.js

export async function onRequest(context) {
  // Get the search query from the URL
  const { searchParams } = new URL(context.request.url);
  const query = searchParams.get('query');

  if (!query) {
    return new Response('Missing query parameter', { status: 400 });
  }

  // =================================================================
  // The API key is hardcoded directly into the file.
  // =================================================================
  const PEXELS_API_KEY = "Tcy9zXQsZOm9PmHdoGzuQwE1N7iqhjL6QL1Z0czthoP6Qjg3ERhLBFX2";
  // =================================================================

  const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`;

  // Make the API call from the server.
  const pexelsResponse = await fetch(pexelsUrl, {
    headers: {
      Authorization: PEXELS_API_KEY,
    },
  });

  const data = await pexelsResponse.json();

  // Create a new response to send back to our front-end.
  const response = new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });

  return response;
}