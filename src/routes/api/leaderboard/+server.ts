import db from '$lib/server/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const [rows] = await db.execute('SELECT player_name AS `name`, clicks FROM clicks ORDER BY clicks DESC');

	return json(rows);
};
