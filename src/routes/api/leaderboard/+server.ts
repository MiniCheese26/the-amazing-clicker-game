import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ platform }) => {
	let rows;

	try {
		rows = await platform!.env.DB.prepare(
			'SELECT name, clicks FROM clicks ORDER BY clicks DESC'
		).all();
	} catch (error) {
		console.debug(error);
		return new Response('Unknown error occurred fetching leaderboard', { status: 500 });
	}

	return json(rows);
};
