import db from '$lib/server/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ request }) => {
	const data = await request.json();

	try {
		await db.execute(
			'INSERT INTO clicks (uuid, player_name, clicks) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE clicks=?',
			[data.uuid, data.name, data.count, data.count]
		);
	} catch (error) {
		console.debug(error);
		return new Response('', { status: 500 });
	}

	const [rows] = await db.execute(
		"SELECT COUNT(uuid) AS `count` FROM clicks WHERE clicks > (SELECT clicks FROM clicks WHERE uuid = ?) ORDER BY clicks DESC",
		[data.uuid]
	);

	const place = rows[0].count + 1;

	return json({ place });
};
