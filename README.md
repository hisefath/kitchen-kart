# Kitchen Kart

A top-down toy-kart delivery racer for Gauntlet Game Week. It's one `index.html` file with no build step and no asset files: the art is drawn in code and the audio is synthesized.

## Play locally
```bash
python3 -m http.server 8124
```
Then open http://localhost:8124. Add `?test` to the URL to run the self-check; the result appears in the console and in `window.KK_TEST`.

**Controls**
- P1: WASD to drive, Left Shift to drift.
- P2: arrow keys to drive, Right Shift or `/` to drift.
- Gamepads: press any button on the title screen to join as P3 or P4.
- On the title screen, press `1` for Vs Bots (A or D changes the bot count) or `2` for Party (F toggles bot fill).

## Put it online (GitHub Pages)
1. Create a public GitHub repo and push this folder to it.
2. In the repo, open Settings → Pages, choose "Deploy from branch", and pick `main` with `/ (root)`.
3. The game goes live at `https://<you>.github.io/<repo>/`.

## Turn on the online leaderboards (Supabase, free)
1. Create a project at supabase.com.
2. Run the SQL from `_bmad-output/planning-artifacts/game-architecture.md` in the project's SQL editor.
3. Paste the Project URL and the anon public key into `SUPABASE_URL` and `SUPABASE_KEY` at the top of `index.html`.

Until those are set, the leaderboards are saved per laptop.

## Design docs
- Brief: `_bmad-output/planning-artifacts/briefs/brief-kitchen-kart-2026-11-02/brief.md`
- GDD and epics: `_bmad-output/planning-artifacts/gdds/gdd-kitchen-kart-2026-11-02/`
- Architecture: `_bmad-output/planning-artifacts/game-architecture.md`
