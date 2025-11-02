export async function onRequest(context) {
  const { searchParams } = new URL(context.request.url);
  const query = searchParams.get('q');
  const lang = searchParams.get('lang');
  const max = searchParams.get('max');

  if (!query) {
    return new Response('Missing query parameter', { status: 400 });
  }


  const GNEWS_API_KEY = "f68f7e9ac8aac3fdca48f8399b594906";
  // =================================================================

  
  const gnewsUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=${lang}&max=${max}&apikey=${GNEWS_API_KEY}`;

  // Make the API call from the server.
  const gnewsResponse = await fetch(gnewsUrl);

  const data = await gnewsResponse.json();

  
  const response = new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });

  return response;
}