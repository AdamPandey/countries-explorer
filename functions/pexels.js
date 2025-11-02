export async function onRequest(context) {
  
  const { searchParams } = new URL(context.request.url);
  const query = searchParams.get('query');

  if (!query) {
    return new Response('Missing query parameter', { status: 400 });
  }

 
  const PEXELS_API_KEY = "bCQCNflQ9hSimtO2M1ghycNu4M6EqT5paoQWNAf9p3OWj9JvqXMLY4IT";

  const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`;

  
  const pexelsResponse = await fetch(pexelsUrl, {
    headers: {
      Authorization: PEXELS_API_KEY,
    },
  });

  const data = await pexelsResponse.json();

  
  const response = new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });

  return response;
}