import type { LeaderboardRow } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const result = await fetch('/api/leaderboard');

  let leaderboard: LeaderboardRow[] = [];

  if (result.ok) {
    leaderboard = (await result.json()) as LeaderboardRow[];
  }

	return { leaderboard: leaderboard };
};
