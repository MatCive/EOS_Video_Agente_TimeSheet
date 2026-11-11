"""Genera la colonna sonora chiptune (8-bit) del video pixel art.

Uso:  python3 scripts/make_chiptune.py   ->  public/audio/chiptune.wav
Musica ed effetti sono sintetizzati qui: nessun asset esterno, nessun diritto da gestire.
I momenti degli effetti sono in frame (30 fps) e seguono le scene di src/pixel.
"""

import wave
from pathlib import Path

import numpy as np

SR = 44100
FPS = 30
DUR = 30.0
BPM = 120
BEAT = 60 / BPM
N = int(SR * DUR)

out = np.zeros(N)


def note_freq(n: str) -> float:
    names = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}
    name, octave = n[:-1], int(n[-1])
    midi = 12 * (octave + 1) + names[name]
    return 440.0 * 2 ** ((midi - 69) / 12)


def square(freq: float, dur: float, duty: float = 0.5) -> np.ndarray:
    t = np.arange(int(SR * dur)) / SR
    return np.where((t * freq) % 1 < duty, 1.0, -1.0)


def triangle(freq: float, dur: float) -> np.ndarray:
    t = np.arange(int(SR * dur)) / SR
    return 2 * np.abs(2 * ((t * freq) % 1) - 1) - 1


def env(x: np.ndarray, a: float = 0.005, r: float = 0.05) -> np.ndarray:
    n = len(x)
    e = np.ones(n)
    na, nr = max(1, int(SR * a)), max(1, int(SR * r))
    e[:na] = np.linspace(0, 1, na)
    e[-nr:] *= np.linspace(1, 0, nr)
    return x * e


def add(sig: np.ndarray, at: float, gain: float) -> None:
    i = int(at * SR)
    if i >= N:
        return
    j = min(N, i + len(sig))
    out[i:j] += sig[: j - i] * gain


def noise(dur: float, seed: int) -> np.ndarray:
    rng = np.random.default_rng(seed)
    return rng.uniform(-1, 1, int(SR * dur))


# ---------------------------------------------------------------- musica
CHORDS = [  # C - Am - F - G
    ("C3", ["C4", "E4", "G4", "C5"]),
    ("A2", ["A3", "C4", "E4", "A4"]),
    ("F2", ["F3", "A3", "C4", "F4"]),
    ("G2", ["G3", "B3", "D4", "G4"]),
]
MUSIC_END = 27.0  # da qui parte il jingle finale
bars = int(MUSIC_END / (4 * BEAT))

for b in range(bars):
    root, arp = CHORDS[b % 4]
    t0 = b * 4 * BEAT
    # basso a crome
    for k in range(8):
        f = note_freq(root) * (2 if k % 2 else 1)
        add(env(triangle(f, BEAT / 2 * 0.9), r=0.02), t0 + k * BEAT / 2, 0.30)
    # arpeggio a semicrome (entra dalla seconda battuta)
    if b >= 1:
        for k in range(16):
            f = note_freq(arp[k % 4])
            add(env(square(f, BEAT / 4 * 0.8, 0.25), r=0.02), t0 + k * BEAT / 4, 0.045)
    # batteria: cassa su 1 e 3, charleston in levare (dalla terza battuta)
    if b >= 2:
        for k in range(4):
            tb = t0 + k * BEAT
            if k in (0, 2):
                t = np.arange(int(SR * 0.12)) / SR
                kick = np.sin(2 * np.pi * (120 * t - 300 * t**2)) * np.exp(-t * 30)
                add(kick, tb, 0.45)
            hat = env(noise(0.03, b * 10 + k), a=0.001, r=0.025)
            add(hat, tb + BEAT / 2, 0.07)

# jingle finale: arpeggio ascendente e accordo tenuto
for k, n in enumerate(["C5", "E5", "G5", "C6"]):
    add(env(square(note_freq(n), 0.16, 0.25), r=0.04), MUSIC_END + k * 0.13, 0.10)
for n in ["C4", "E4", "G4", "C5"]:
    add(env(square(note_freq(n), 2.2, 0.5), a=0.01, r=1.2), MUSIC_END + 0.55, 0.045)
add(env(triangle(note_freq("C3"), 2.2), r=1.2), MUSIC_END + 0.55, 0.3)


# ---------------------------------------------------------------- effetti
def sfx_blip(frame: int, pitch: str = "A5", gain: float = 0.10) -> None:
    f = note_freq(pitch)
    a = env(square(f, 0.05, 0.5), r=0.01)
    b = env(square(f * 1.5, 0.06, 0.5), r=0.03)
    add(np.concatenate([a, b]), frame / FPS, gain)


def sfx_chime(frame: int, notes: list[str], gain: float = 0.09, step: float = 0.06) -> None:
    for k, n in enumerate(notes):
        add(env(square(note_freq(n), 0.12, 0.25), r=0.06), frame / FPS + k * step, gain)


def sfx_whoosh(frame: int) -> None:
    d = 0.32
    x = noise(d, frame)
    # passa-basso semplice con frequenza che sale e scende
    y = np.zeros_like(x)
    alpha = np.sin(np.linspace(0, np.pi, len(x))) * 0.35 + 0.02
    for i in range(1, len(x)):
        y[i] = y[i - 1] + alpha[i] * (x[i] - y[i - 1])
    add(env(y, a=0.05, r=0.12), frame / FPS - d / 2, 0.30)


def sfx_click(frame: int) -> None:
    add(env(noise(0.012, frame), a=0.0005, r=0.008), frame / FPS, 0.06)


# transizioni a mosaico
for cut in [170, 320, 530, 700, 810]:
    sfx_whoosh(cut)

# 1. dubbi "?"
for i, fr in enumerate([40, 58, 76]):
    sfx_blip(fr, ["E5", "G5", "B5"][i], 0.09)
# timesheet vuoto che compare
sfx_blip(8, "C5", 0.08)

# 2. arrivo dell'assistente + digitazione
sfx_chime(170 + 28, ["C5", "E5", "G5", "C6", "E6"], 0.08)
for fr in range(170 + 34, 170 + 80, 3):
    sfx_click(fr)
for fr in range(170 + 92, 170 + 140, 3):
    sfx_click(fr)

# 3. analisi: fonti, completamento, blocchi della giornata
for i in range(4):
    sfx_blip(320 + 4 + i * 6, ["C5", "D5", "E5", "G5"][i], 0.07)
sfx_chime(320 + 132, ["G5", "C6", "E6"], 0.09)
for i in range(5):
    sfx_blip(320 + 136 + i * 10, ["C5", "E5", "G5", "A5", "C6"][i], 0.06)

# 4. righe del timesheet e totale
for i in range(4):
    sfx_blip(530 + 16 + i * 16, ["E5", "F5", "G5", "A5"][i], 0.07)
sfx_chime(530 + 116, ["C6", "G5", "C6", "E6"], 0.09, 0.05)

# 5. spunte di revisione e timbro
for i in range(4):
    sfx_blip(700 + 14 + i * 12, ["G5", "A5", "B5", "C6"][i], 0.07)
t = np.arange(int(SR * 0.18)) / SR
add(np.sin(2 * np.pi * (90 * t - 120 * t**2)) * np.exp(-t * 22), (700 + 68) / FPS, 0.5)
sfx_chime(700 + 70, ["C5", "E5", "G5"], 0.07, 0.0)

# 6. logo finale
sfx_chime(810 + 56, ["G5", "C6"], 0.07, 0.08)

# ---------------------------------------------------------------- export
fade = int(SR * 0.6)
out[-fade:] *= np.linspace(1, 0, fade)
out = out / max(1e-9, np.max(np.abs(out))) * 0.85
pcm = (out * 32767).astype(np.int16)

dest = Path(__file__).resolve().parent.parent / "public" / "audio" / "chiptune.wav"
dest.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(dest), "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(f"Scritto {dest} ({DUR:.0f} s)")
