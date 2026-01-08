<script>
	import { enhance } from '$app/forms';
</script>

<form method="POST" action="/ideas" use:enhance>
	<div class="new-idea__container">
		<h2>New Idea</h2>
		<label>
			Name
			<input required name="name" type="text" placeholder="Idea name" />
		</label>

		<label>
			Details
			<textarea required name="text" placeholder="Idea details"></textarea>
		</label>
		<button class="btn-primary" type="submit">Create Idea</button>
	</div>
</form>

<style>
	.new-idea__container {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		gap: 1em;
		width: 400px;
		background-color: var(--color-primary);
		border-radius: 0.5em;
		padding: 1em;
		box-shadow: 0 0 1px black;

		label > * {
			margin-top: 0.25em;
		}

		h2 {
			margin: 0;
		}

		input {
			border-radius: 0.5em;
			width: 100%;
		}

		input,
		textarea {
			padding: 0.5em;
		}

		textarea {
			border-radius: 0.5em 0.5em 0 0.5em;
			padding: 0.5em;
			width: 100%;
			height: 10em;
			resize: vertical;
		}
	}
</style>
