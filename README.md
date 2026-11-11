# Video promozionali – Supporto Generazione Timesheet

Video da 30 secondi per presentare ai colleghi EOS l'agente "Supporto generazione time sheet".

## Versione pixel art (quadrata 1:1)

Cartoon in stile pixel art, 1080×1080, 30 fps, con musica chiptune ed effetti 8-bit.

- Video finale: `video/out/EOS_Supporto_Generazione_Timesheet_PixelArt.mp4`
- Composizione Remotion: `PromoTimesheetPixel` (sorgenti in `video/src/pixel`)
- Trama: dipendente che non ricorda le attività → arriva l'assistente AI → analisi di riunioni, email, Teams e file → timesheet suggerito (tempi in centesimi, codici TDE/CAS-) → revisione del dipendente → "Tu controlli. L'agente ricostruisce."
- Una barra in basso mostra il flusso: Dipendente → Assistente AI → Analisi attività → Timesheet suggerito → Revisione
- Colori dal logo EOS (arancio `#EF7F02`, grigio `#3E3D39`) più il teal dell'icona dell'agente
- Font pixel: Press Start 2P e Jersey 10 (SIL OFL, in `video/public/fonts`)
- Audio: generato da `video/scripts/make_chiptune.py` (nessun asset esterno)
- Progetti e codici nella tabella sono fittizi

## Versione cutout di carta (verticale 9:16)

- Video finale: `video/out/EOS_Supporto_Generazione_Timesheet.mp4`
- Composizione Remotion: `PromoTimesheet` (`Promo.tsx`, `scenes.tsx`, `characters.tsx`, `ui.tsx`, `theme.ts`)

## Anteprima e render

Skill Remotion per agenti in `.agents/skills` (installate con `npx skills add remotion-dev/skills`).

```bash
cd video
npm i
npx remotion studio
npx remotion render PromoTimesheetPixel out/EOS_Supporto_Generazione_Timesheet_PixelArt.mp4
```

Per rigenerare la colonna sonora: `python3 scripts/make_chiptune.py` (richiede numpy).
