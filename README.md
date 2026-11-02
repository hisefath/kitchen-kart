# Kitchen Kart

A top-down toy-kart delivery racer for Gauntlet Game Week. It's one `index.html` file with no build step and no asset files: the art is drawn in code and the audio is synthesized.

## Play locally
```bash
python3 -m http.server 8124
```
Then open http://localhost:8124. Add `?test` to the URL to run the self-check; the result appears in the console and in `window.KK_TEST`.

**Controls**
- Hold a direction and the kart drives that way. P1 uses WASD with Left Shift to drift; P2 uses the arrow keys with Right Shift or `/` to drift.
- **Title:** press PLAY (or Enter), or HOW TO PLAY (or H) for a guided demo.
- **Mode:** choose VS BOTS (key 1) or MULTIPLAYER (key 2). Gamepads join as P3 and P4 by pressing any button here.
- **Garage:** four pages: Car → Map → Menu → Ready. Enter goes to the next page and Esc goes back. Press L, or click the tab at the bottom, to slide up the leaderboard.

## Put it online (GitHub Pages)
1. Create a public GitHub repo and push this folder to it.
2. In the repo, open Settings → Pages, choose "Deploy from branch", and pick `main` with `/ (root)`.
3. The game goes live at `https://<you>.github.io/<repo>/`.

## Turn on the online leaderboards (Google Sheet, free)
1. Create a new Google Sheet. It can be blank.
2. Open Extensions → Apps Script, delete the starter code, paste in [`leaderboard.gs`](leaderboard.gs), and save.
3. Choose Deploy → New deployment → gear icon → **Web app**. Set Execute as **Me** and Who has access **Anyone**, then Deploy and authorize.
4. Copy the Web app URL (it ends in `/exec`) into `BOARD_URL` at the top of `index.html`.

Scores then appear as rows in the sheet. Until it's set up, the leaderboards are saved per laptop.

## Design docs
- Brief: `_bmad-output/planning-artifacts/briefs/brief-kitchen-kart-2026-11-02/brief.md`
- GDD and epics: `_bmad-output/planning-artifacts/gdds/gdd-kitchen-kart-2026-11-02/`
- Architecture: `_bmad-output/planning-artifacts/game-architecture.md`
