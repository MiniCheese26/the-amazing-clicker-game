<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let pollingInterval: number;
	let leaderboard = data.leaderboard;

	const onPoll = async () => {
		const result = await fetch('/api/leaderboard');

		if (result.ok) {
			leaderboard = await result.json();
		}
	};

	onMount(() => {
		pollingInterval = setInterval(onPoll, 5000);
	});

	onDestroy(() => {
		clearInterval(pollingInterval);
	});
</script>

<nav class="flex flex-col items-center gap-2">
	<h1 class="text-4xl md:text-4xl font-medium text-center">Leaderboard</h1>
	<a href="/" class="underline cursor-pointer text-3xl">Play the Game!</a>
</nav>
<main class="flex flex-col items-center justify-center flex-1 my-4">
	<table class="border-separate border-spacing-2 border border-slate-500">
		<thead>
			<tr>
				<th>Place</th>
				<th>Name</th>
				<th>Clicks</th>
			</tr>
		</thead>
		<tbody>
			{#each leaderboard as row, index}
				<tr>
					<td>#{index + 1}</td>
					<td>{row.name}</td>
					<td>{row.clicks}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</main>
