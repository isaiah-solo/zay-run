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

const TYPE_MS = 22;
const HOLD_MS = 2200;
// How long the select-all highlight lingers before the text vanishes
const SELECT_MS = 450;
const GAP_MS = 500;
// Brief beat after mid-phrase punctuation, like a human typist
const PUNCT_MS = 150;
const PUNCT = /[.,!?;:—]/;

type Phase = 'typing' | 'selected' | 'gap';

export default function Typewriter() {
	const [text, setText] = useState('');
	// -1 renders the intro; 0..9 index into PHRASES
	const [phrase, setPhrase] = useState(-1);
	const [phase, setPhase] = useState<Phase>('typing');
	const [reducedMotion, setReducedMotion] = useState(false);

	useEffect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			setReducedMotion(true);
			setText(INTRO);
		}
	}, []);

	const target = phrase === -1 ? INTRO : PHRASES[phrase];

	useEffect(() => {
		if (reducedMotion) return;
		let delay: number;
		let update: () => void;

		if (phase === 'typing') {
			if (text.length < target.length) {
				// Only pause when punctuation ends a clause (followed by a
				// space), not inside tokens like "zay.run"
				const punctBeat =
					PUNCT.test(text[text.length - 1] ?? '') &&
					/\s/.test(target[text.length] ?? '');
				delay = punctBeat ? PUNCT_MS : TYPE_MS;
				update = () => setText(target.slice(0, text.length + 1));
			} else {
				delay = HOLD_MS;
				update = () => setPhase('selected');
			}
		} else if (phase === 'selected') {
			delay = SELECT_MS;
			update = () => {
				setText('');
				setPhase('gap');
			};
		} else {
			delay = GAP_MS;
			update = () => {
				setPhrase((phrase + 1) % PHRASES.length);
				setPhase('typing');
			};
		}

		const timeout = window.setTimeout(update, delay);
		return () => window.clearTimeout(timeout);
	}, [text, target, phase, reducedMotion, phrase]);

	return (
		<p className="min-h-16 text-center text-2xl font-medium tracking-tight sm:text-3xl">
			<span className="sr-only">Welcome!</span>
			<span aria-hidden="true">
				<span
					className={
						phase === 'selected' ? 'bg-[#0078d4] text-white' : undefined
					}
				>
					{text}
				</span>
				{phase !== 'selected' && (
					<span className="animate-blink text-zinc-400 dark:text-zinc-600">
						|
					</span>
				)}
			</span>
		</p>
	);
}
