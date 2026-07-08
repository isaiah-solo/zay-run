import { useEffect, useState } from 'react';

const INTRO = 'Welcome!';
const PHRASES = [
	"You found zay.run. There's no prize, but still.",
	"This page loaded in milliseconds. You're welcome.",
	"Yes, the domain is a pun. No, I don't run much.",
	'Built with Astro. Deployed with vibes.',
	'The dark mode was free. The domain was not.',
	'Static site, dynamic personality.',
	'This sentence took longer to type than the page took to load.',
	'Handcrafted HTML, like grandma used to make.',
	"If you're reading this, the deploy worked.",
	'Achievement unlocked: found Isaiah on the internet.',
];

const TYPE_MS = 60;
const DELETE_MS = 30;
const HOLD_MS = 2200;
const GAP_MS = 500;

export default function Typewriter() {
	const [text, setText] = useState('');
	// -1 renders the intro; 0..9 index into PHRASES
	const [phrase, setPhrase] = useState(-1);
	const [deleting, setDeleting] = useState(false);
	const [reducedMotion, setReducedMotion] = useState(false);

	useEffect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			setReducedMotion(true);
			setText(INTRO);
		}
	}, []);

	useEffect(() => {
		if (reducedMotion) return;
		const target = phrase === -1 ? INTRO : PHRASES[phrase];
		let delay: number;
		let update: () => void;

		if (deleting) {
			if (text.length > 0) {
				delay = DELETE_MS;
				update = () => setText(text.slice(0, -1));
			} else {
				delay = GAP_MS;
				update = () => {
					setDeleting(false);
					setPhrase((phrase + 1) % PHRASES.length);
				};
			}
		} else if (text.length < target.length) {
			delay = TYPE_MS;
			update = () => setText(target.slice(0, text.length + 1));
		} else {
			delay = HOLD_MS;
			update = () => setDeleting(true);
		}

		const timeout = window.setTimeout(update, delay);
		return () => window.clearTimeout(timeout);
	}, [text, phrase, deleting, reducedMotion]);

	return (
		<p className="min-h-16 text-center text-2xl font-medium tracking-tight sm:text-3xl">
			<span className="sr-only">Welcome!</span>
			<span aria-hidden="true">
				{text}
				<span className="animate-pulse text-zinc-400 dark:text-zinc-600">
					|
				</span>
			</span>
		</p>
	);
}
