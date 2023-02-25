import { error } from '@sveltejs/kit';
import { AppwriteService } from '$lib/appwriteService';
import type { RequestHandler } from './$types';

export const GET = (async ({ url, fetch }) => {
  const code = url.searchParams.get('code') ?? '';
  console.log(code);
  const state = JSON.stringify({
    'success': 'http://localhost:5173/aa',
    // 'failure': 'http://localhost:5173/bb'
  });

	const response = await fetch(`${AppwriteService.endpoint}/account/sessions/oauth2/github/redirect?project=${AppwriteService.projectId}&code=${code}&state=${encodeURIComponent(state)}`, {
		method: 'GET',
		headers: {
			'x-appwrite-project': AppwriteService.projectId
		},
		redirect: 'manual'
	});

	const body = await response.text();

	if (response.status >= 400) {
		return new Response(body);
	}

  response.headers.forEach((value, key) => console.log(key, value));

  console.log(body);
  console.log(response.status);

	return new Response(body, {
		headers: response.headers,
		status: response.status
	});
}) satisfies RequestHandler;