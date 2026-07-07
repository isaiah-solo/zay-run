import { useState } from 'react';

export default function Counter() {
	const [count, setCount] = useState(0);

	return (
		<button
			type="button"
			onClick={() => setCount((c) => c + 1)}
			className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
		>
			React island is alive: {count}
		</button>
	);
}
