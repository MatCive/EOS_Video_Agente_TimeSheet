# Video promozionale – Supporto Generazione Timesheet

Video verticale 9:16 (1080×1920), 30 secondi, in stile cartoon a ritaglio di carta, per presentare ai colleghi EOS l'agente "Supporto Generazione Timesheet".

- Video finale: `video/out/EOS_Supporto_Generazione_Timesheet.mp4`
- Sorgente Remotion: `video/src` (`Promo.tsx`, `scenes.tsx`, `characters.tsx`, `ui.tsx`, `theme.ts`)
- Skill Remotion per agenti: `.agents/skills` (installata con `npx skills add remotion-dev/skills`)

## Anteprima e render

```bash
cd video
npm i
npx remotion studio
npx remotion render PromoTimesheet out/EOS_Supporto_Generazione_Timesheet.mp4
```
