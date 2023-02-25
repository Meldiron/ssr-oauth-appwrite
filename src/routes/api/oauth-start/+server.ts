import { AppwriteService } from '$lib/appwriteService';
import type { RequestHandler } from './$types';

export const GET = (async ({ fetch }) => {
	const response = await fetch(`${AppwriteService.endpoint}/account/sessions/oauth2/github`, {
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

    const redirectUri = 'http://localhost:5173/api/oauth-finish';

    const location = response.headers.get('location') ?? '';
    const clientId = location.split('client_id=')[1].split('&')[0] ?? '';

    const headers = new Headers();
    response.headers.forEach((value, key) => headers.set(key, value));
	headers.set('location', `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent('user:email')}`);

	return new Response(body, {
		headers: headers,
		status: response.status
	});
}) satisfies RequestHandler;
