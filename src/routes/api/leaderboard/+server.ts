import { json } from '@sveltejs/kit';

export const GET = async ({ platform }) => {
	let result;

	try {
		result = await platform!.env.DB.prepare(
			'SELECT name, clicks FROM clicks ORDER BY clicks DESC'
		).all();
	} catch (error) {
		console.debug(error);
		return new Response('Unknown error occurred fetching leaderboard', { status: 500 });
	}

	return json(result.results);
};
