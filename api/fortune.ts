import { fetchFortune } from '../shared/fortune-service';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

export const config = {
  runtime: 'edge'
};

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const apiKey = process.env.TIANAPI_KEY || '';
  const result = await fetchFortune(apiKey);

  return new Response(JSON.stringify(result), {
    status: result.success ? 200 : 400,
    headers: corsHeaders
  });
}
