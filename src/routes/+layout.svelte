<script lang="ts">
	import '../app.css';
</script>

<div class="min-h-screen flex flex-col items-center p-4">
	<slot />
	<footer>
		<p>
			Made by <a
				href="https://emilymedhurst.gay"
				target="_blank"
				rel="noreferrer noopener me"
				class="underline cursor-pointer">Emily Medhurst</a
			>
			/
			<a
				href="https://github.com/MiniCheese26/the-amazing-clicker-game"
				target="_blank"
				rel="noreferrer noopener"
				class="underline cursor-pointer">Code</a
			>
		</p>
	</footer>
</div>
