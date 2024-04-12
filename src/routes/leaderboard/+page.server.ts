import { SUPER_SECRET_PASSWORD } from '$env/static/private';
import type { LeaderboardRow } from '$lib/types';
import { fail } from '@sveltejs/kit';

export const load = async ({ fetch }) => {
	const result = await fetch('/api/leaderboard');

	let leaderboard: LeaderboardRow[] = [];

	if (result.ok) {
		leaderboard = (await result.json()) as LeaderboardRow[];
	}

	return { leaderboard: leaderboard };
};

export const actions = {
	default: async ({ request, platform }) => {
		const data = await request.formData();

		const password = data.get('password');

		if (password !== SUPER_SECRET_PASSWORD) {
			return fail(401, { success: false });
		}

		await platform?.env.DB.exec('DELETE FROM clicks');

		return { success: true };
	}
};
