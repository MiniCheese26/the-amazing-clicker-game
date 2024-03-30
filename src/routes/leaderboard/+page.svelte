<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	import dayjs, { type Dayjs } from 'dayjs';
	import type { LeaderboardRow } from '$lib/types';
	import TablerArrowUp from '~icons/tabler/arrow-up';
	import TablerArrowDown from '~icons/tabler/arrow-down';
	import { renderSVG } from 'uqr';

	type LeaderboardRowWithChanges = {
		change?: 'up' | 'down';
	} & LeaderboardRow;

	export let data: PageData;

	let pollingInterval: number;
	let nowInterval: number;
	let leaderboard: LeaderboardRowWithChanges[] = data.leaderboard;
	let now = dayjs();
	let nextUpdate = now.add(5, 's');
	let updating = false;
	let svg: string;
	let showQr = false;

	const onPoll = async () => {
		updating = true;
		const result = await fetch('/api/leaderboard');

		if (result.ok) {
			const updatedLeaderboard: LeaderboardRow[] = await result.json();

			leaderboard = updatedLeaderboard.map((x, index) => {
				const originalPos = leaderboard.findIndex((v) => v.name === x.name);

				if (originalPos === -1) {
					return x;
				}

				if (index < originalPos) {
					return {
						...x,
						change: 'up'
					};
				} else if (index > originalPos) {
					return {
						...x,
						change: 'down'
					};
				}

				return x;
			});
		}

		nextUpdate = dayjs().add(5, 's');
		updating = false;
	};

	const onNow = () => {
		now = dayjs();
	};

	onMount(() => {
		svg = renderSVG(location.origin);
		nowInterval = setInterval(onNow, 1000);
		pollingInterval = setInterval(onPoll, 5000);
	});

	onDestroy(() => {
		clearInterval(nowInterval);
		clearInterval(pollingInterval);
	});
</script>

<nav class="flex flex-col items-center gap-2">
	<h1 class="text-4xl md:text-4xl font-medium text-center">Leaderboard</h1>
	<a href="/" class="underline cursor-pointer text-3xl">Play the Game!</a>
</nav>
<main class="flex flex-col items-center flex-1 my-4 relative">
	{#if svg && showQr}
		<button class="*:h-96 absolute" on:click={() => (showQr = false)}>
			{@html svg}
		</button>
	{:else}
		<button on:click={() => (showQr = true)} class="bg-neutral-900 p-4 md:p-2 rounded-lg md:rounded-md border-2 border-neutral-100 text-neutral-100">Show QR Code</button>
	{/if}
	<div class="flex-1 flex flex-col justify-center items-center gap-4">
		<h2 class="text-2xl">
			{updating ? 'Updating...' : `Updating in ${nextUpdate.diff(now, 's')} seconds`}
		</h2>
		<table class="border-separate border-spacing-2 border border-slate-500">
			<thead class="text-3xl">
				<tr>
					<th class="min-w-8"></th>
					<th>Place</th>
					<th>Name</th>
					<th>Clicks</th>
				</tr>
			</thead>
			<tbody class="text-2xl">
				{#if leaderboard.length > 0}
					{#each leaderboard as row, index}
						<tr>
							{#if row.change === 'down'}
								<td class="text-red-500"><TablerArrowDown /></td>
							{:else if row.change === 'up'}
								<td class="text-green-500"><TablerArrowUp /></td>
							{:else}
								<td></td>
							{/if}
							<td>#{index + 1}</td>
							{#if row.change === 'down'}
								<td class="text-red-500">{row.name}</td>
							{:else if row.change === 'up'}
								<td class="text-green-500">{row.name}</td>
							{:else}
								<td>{row.name}</td>
							{/if}
							<td>{row.clicks}</td>
						</tr>
					{/each}
				{:else}
					<tr>
						<td colspan="4" class="text-center">No one's here :(</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</main>
