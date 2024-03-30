<script lang="ts">
	import formatOrdinals from '$lib/ordinal';
	import { onDestroy, onMount } from 'svelte';

	let data = {
		name: '',
		count: 0,
		uuid: crypto.randomUUID()
	};
	let lastCount = 0;
	let nameSubmitted = false;
	let pollingInterval: number;
	let placement: number | null = null;

	const onPoll = async () => {
		if (nameSubmitted && data.count !== lastCount) {
			const dataCopy = {...data};
			localStorage.setItem('data', JSON.stringify(dataCopy));

			const result = await fetch(`/api/${dataCopy.uuid}`, {
				method: 'PUT',
				body: JSON.stringify(dataCopy)
			});

			if (result.ok) {
				const resultData = await result.json();

				placement = resultData.place;
			}

			lastCount = dataCopy.count;
		}
	};

	onMount(async () => {
		const localStorageData = localStorage.getItem('data');

		if (localStorageData) {
			data = JSON.parse(localStorageData);
			nameSubmitted = true;
		}

		await onPoll();
		pollingInterval = setInterval(onPoll, 5000);
	});

	onDestroy(() => {
		clearInterval(pollingInterval);
	});

	const onCounterClick = () => data.count++;

	const onNameSubmit = async () => {
		if (!data.name || data.name.length > 255) {
			return;
		}

		await onPoll();

		nameSubmitted = true;
	};

	const onReset = async () => {
		await fetch(`/api/${data.uuid}`, {
			method: 'DELETE'
		});

		localStorage.removeItem('data');

		data.uuid = crypto.randomUUID();
		data.count = 0;
		data.name = '';

		nameSubmitted = false;
	};
</script>

<nav class="flex flex-col items-center gap-2">
	<h1 class="text-3xl md:text-4xl font-medium text-center">The Amazing Clicker Game</h1>
	<a href="/leaderboard" target="_blank" class="underline cursor-pointer text-2xl">Leaderboard</a>
</nav>
<main class="flex flex-col items-center justify-center flex-1">
	{#if nameSubmitted}
		<h2 class="text-3xl mb-4 text-center">
			You are currently in {placement !== null ? formatOrdinals(placement) : '...'} place!
		</h2>
		<h2 class="text-2xl mb-4 text-center">{data.name} has clicked {data.count} times</h2>
		<button
			on:click={onCounterClick}
			class="bg-neutral-900 p-4 md:p-2 rounded-lg md:rounded-md border-2 border-neutral-100 text-neutral-100 active:border-neutral-900 mb-16 md:mb-8"
			>Click me!</button
		>
		<button on:click={onReset} class="bg-red-500 p-2 rounded-md text-neutral-100"
			>Reset Progress</button
		>
	{:else}
		<label class="flex flex-col mb-4">
			Enter your name
			<input bind:value={data.name} />
		</label>
		<button
			on:click={onNameSubmit}
			class="bg-neutral-900 p-2 rounded-md border-2 border-neutral-100 text-neutral-100 active:border-neutral-900 mb-8"
			>Submit</button
		>
	{/if}
</main>
