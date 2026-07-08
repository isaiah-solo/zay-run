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
// Mouse-drag selection sweep, per character (end of phrase → beginning)
const SELECT_CHAR_MS = 7;
// How long the full selection lingers before the text vanishes
const SELECT_HOLD_MS = 450;
const GAP_MS = 500;
// Brief beat after mid-phrase punctuation, like a human typist
const PUNCT_MS = 150;
const PUNCT = /[.,!?;:—]/;

type Phase = 'typing' | 'selecting' | 'gap';

export default function Typewriter() {
	const [text, setText] = useState('');
	// -1 renders the intro; 0..9 index into PHRASES
	const [phrase, setPhrase] = useState(-1);
	const [phase, setPhase] = useState<Phase>('typing');
	// Number of characters selected, growing from the end of the text
	const [selected, setSelected] = useState(0);
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
				update = () => setPhase('selecting');
			}
		} else if (phase === 'selecting') {
			if (selected < text.length) {
				delay = SELECT_CHAR_MS;
				// Two chars per step: browsers clamp nested timeouts to ~4ms,
				// so halving the delay can't reliably double the speed
				update = () => setSelected(Math.min(selected + 2, text.length));
			} else {
				delay = SELECT_HOLD_MS;
				update = () => {
					setText('');
					setSelected(0);
					setPhase('gap');
				};
			}
		} else {
			delay = GAP_MS;
			update = () => {
				setPhrase((phrase + 1) % PHRASES.length);
				setPhase('typing');
			};
		}

		const timeout = window.setTimeout(update, delay);
		return () => window.clearTimeout(timeout);
	}, [text, target, phase, selected, reducedMotion, phrase]);

	const splitAt = text.length - selected;

	return (
		<p className="min-h-16 text-center text-2xl font-medium tracking-tight sm:text-3xl">
			<span className="sr-only">Welcome!</span>
			<span aria-hidden="true">
				{text.slice(0, splitAt)}
				<span className="bg-[#0078d4] text-white dark:bg-[#264f78] dark:text-zinc-100">
					{text.slice(splitAt)}
				</span>
				{/* Kept mounted (invisible) during selection so line width
				    never changes and wrapping stays put */}
				<span
					className={
						phase === 'selecting'
							? 'invisible'
							: 'animate-blink text-zinc-400 dark:text-zinc-600'
					}
				>
					|
				</span>
			</span>
		</p>
	);
}
