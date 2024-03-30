import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ params, request, platform }) => {
	const data = await request.json();

	try {
		await platform!.env.DB.prepare(
			`INSERT INTO clicks(uuid, clicks, name) VALUES(?, ?, ?)
		ON CONFLICT(uuid) DO UPDATE SET clicks=?;`
		)
			.bind(params.uuid, data.count, data.name, data.count)
			.run();
	} catch (error) {
		console.debug(error);
		return new Response('Unknown error occurred updating user clicks', { status: 500 });
	}

	let place: number;

	try {
		const result = await platform!.env.DB.prepare(
			'SELECT COUNT(uuid) AS place FROM clicks WHERE clicks > (SELECT clicks FROM clicks WHERE uuid = ?) ORDER BY clicks DESC'
		)
			.bind(params.uuid)
			.first<{ place: number }>();

		if (result) {
			place = result.place;
		} else {
			return new Response('Unknown error occurred getting user place', { status: 500 });
		}
	} catch (error) {
		console.debug(error);
		return new Response('Unknown error occurred getting user place', { status: 500 });
	}

	return json({ place: place + 1 });
};

export const DELETE: RequestHandler = async ({ params, platform }) => {
	try {
		await platform!.env.DB.prepare('DELETE FROM clicks WHERE uuid = ?').bind(params.uuid).run();
	} catch (error) {
		console.debug(error);
		return new Response('Unknown error occurred getting user place', { status: 500 });
	}

	return new Response('', { status: 200 });
};
