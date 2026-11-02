---
title: Kitchen Kart — Game Architecture
status: final
created: 2026-11-02
inputs: [gdds/gdd-kitchen-kart-2026-11-02/gdd.md]
---

# Kitchen Kart — Architecture

Lean by design: a jam game, one developer, four days.

## Decisions
| Area | Decision | Why |
|---|---|---|
| Engine | Vanilla HTML5 Canvas 2D + plain JS, no framework, no build step | Prototype already works; zero install; one file to host. Phaser adds learning cost with no payoff for one screen. |
| Files | `index.html` (markup + game script). Nothing else ships. | Fewest moving parts; static hosting. |
| Loop | `requestAnimationFrame`; fixed-step update at 60 Hz (accumulator), render every frame | GDD numbers are per-frame at 60 fps; fixed step keeps physics identical on 120 Hz screens. |
| State | One `state` string: `title`, `mode`, `count`, `play`, `name`, `over`; plain objects for karts/items/order | Tiny state machine; no ECS needed for ≤ 4 karts, ≤ 20 items. |
| Map | Road grid derived from block layout; road cells = everything not inside a block (+20 px margin) | Gives spawn sites and bot routing graph from one source. |
| Bots | Waypoint graph on road intersections; BFS to the intersection nearest the target, then straight line | Grid city → BFS is exact enough and ~30 lines. |
| Input | `keydown/keyup` map + Gamepad API polled each frame; each kart has an `input()` returning `{gas, brake, steer, drift}` (humans and bots share the interface) | Bots and humans drive through the same physics. |
| Audio | WebAudio oscillators; music scheduler on `setInterval` reading a tempo multiplier | All synthesized, satisfies asset rule. |
| Leaderboard | A Google Sheet behind a Google Apps Script web app (`leaderboard.gs`). `GET ?board=` returns the top 10 as JSON. `POST` sends a text/plain JSON body with `no-cors`, which avoids a CORS preflight. The script validates board, name (`[A-Za-z0-9_-]`, 1–12 characters, which also blocks formula injection) and score (1–5000). Fallback: `localStorage`. | No new account; the data is a sheet you can read and edit. |
| Hosting | GitHub Pages (or Netlify drop) | Free public link. |

## Leaderboard setup (user does once)
1. Create a Google Sheet.
2. Open Extensions → Apps Script and paste in `leaderboard.gs`.
3. Choose Deploy → New deployment → Web app, set Execute as **Me** and Who has access **Anyone**, then authorize.
4. Copy the `/exec` URL into `BOARD_URL` at the top of `index.html`.

## Performance budget
≤ 4 karts, ≤ 20 items, ≤ 200 particles; all drawn with primitive paths. No offscreen caching needed unless profiling shows > 8 ms/frame.
