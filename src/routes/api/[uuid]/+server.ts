import db from '$lib/server/db';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params }) => {
	await db.execute('DELETE FROM clicks WHERE uuid = ?', [params.uuid]);

	return new Response('', { status: 200 });
};
