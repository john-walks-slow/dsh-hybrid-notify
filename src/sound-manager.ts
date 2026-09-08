/**
 * SoundManager — plays notification sounds using the Web Audio API.
 *
 * Sounds are synthesized with multiple oscillators at harmonic intervals,
 * shaped with smooth attack/decay envelopes (exponential ramp) for warm,
 * pleasant tones — not harsh sine beeps.
 *
 * Autoplay policy is handled by unlocking on first user interaction.
 *
 * @module dsh-notify/sound-manager
 */

import type { NotificationLevel } from "./types";

/** One oscillator voice in a sound pattern. */
interface Voice {
	freq: number;       // base frequency (Hz)
	type: OscillatorType;
	start: number;       // start offset (s)
	dur: number;         // duration (s)
	gain: number;        // peak gain (0–1)
}

/** A complete sound pattern: multiple voices + master volume curve. */
interface Pattern {
	voices: Voice[];
	totalDur: number;     // total pattern duration (s)
}

export class SoundManager {
	private audioCtx: AudioContext | null = null;
	private _unlocked = false;

	get isUnlocked(): boolean {
		return this._unlocked;
	}

	unlock(): void {
		if (this._unlocked) return;
		try {
			this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
			if (this.audioCtx.state === "suspended") this.audioCtx.resume();
			this._unlocked = true;
		} catch { /* AudioContext not available */ }
	}

	play(level: NotificationLevel = "info", volume: number = 0.5): void {
		if (!this._unlocked || !this.audioCtx) return;
		if (this.audioCtx.state === "suspended") this.audioCtx.resume();

		const ctx = this.audioCtx;
		const now = ctx.currentTime;
		const pattern = this.getPattern(level);

		// Master gain — controls overall volume
		const master = ctx.createGain();
		master.gain.value = volume;
		master.connect(ctx.destination);

		for (const v of pattern.voices) {
			const osc = ctx.createOscillator();
			osc.type = v.type;
			osc.frequency.value = v.freq;

			// Per-voice gain with smooth ADSR envelope
			const g = ctx.createGain();
			osc.connect(g);
			g.connect(master);

			const start = now + v.start;
			const end = start + v.dur;
			const peak = v.gain;

			// Smooth attack (8ms) + exponential decay
			g.gain.setValueAtTime(0.0001, start);
			g.gain.exponentialRampToValueAtTime(peak, start + 0.008);
			g.gain.exponentialRampToValueAtTime(0.0001, end);

			osc.start(start);
			osc.stop(end + 0.01);
		}
	}

	private getPattern(level: NotificationLevel): Pattern {
		switch (level) {
			case "success": {
				// Warm major chord ascending: C5 + E5 + G5, staggered
				return {
					totalDur: 0.35,
					voices: [
						{ freq: 523.25, type: "triangle", start: 0,    dur: 0.22, gain: 0.5 },
						{ freq: 659.25, type: "triangle", start: 0.06, dur: 0.22, gain: 0.4 },
						{ freq: 783.99, type: "sine",     start: 0.12, dur: 0.23, gain: 0.45 },
					],
				};
			}
			case "error": {
				// Descending minor: E5 → A4, with slight dissonance
				return {
					totalDur: 0.40,
					voices: [
						{ freq: 329.63, type: "triangle", start: 0,    dur: 0.18, gain: 0.45 },
						{ freq: 415.30, type: "sine",     start: 0.04, dur: 0.18, gain: 0.3 },
						{ freq: 220.00, type: "triangle", start: 0.14, dur: 0.26, gain: 0.5 },
					],
				};
			}
			case "warning": {
				// Two gentle pulses — same note, spaced
				return {
					totalDur: 0.30,
					voices: [
						{ freq: 440.00, type: "triangle", start: 0,    dur: 0.10, gain: 0.4 },
						{ freq: 440.00, type: "triangle", start: 0.14, dur: 0.10, gain: 0.4 },
					],
				};
			}
			default: {
				// info: soft two-tone chime — G4 → B4
				return {
					totalDur: 0.25,
					voices: [
						{ freq: 392.00, type: "triangle", start: 0,    dur: 0.12, gain: 0.35 },
						{ freq: 493.88, type: "sine",     start: 0.08, dur: 0.16, gain: 0.35 },
					],
				};
			}
		}
	}

	installUnlockListeners(): () => void {
		const onGesture = () => this.unlock();
		document.addEventListener("click", onGesture, { once: false });
		document.addEventListener("keydown", onGesture, { once: false });
		return () => {
			document.removeEventListener("click", onGesture);
			document.removeEventListener("keydown", onGesture);
		};
	}
}
