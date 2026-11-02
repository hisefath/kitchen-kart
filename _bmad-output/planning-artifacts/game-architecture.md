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
| Leaderboard | Supabase REST (`/rest/v1/scores`) via `fetch`, public anon key; table `scores(id, board text, name text, score int, created_at)`; RLS: insert + select for anon, check `score between 0 and 5000` and `char_length(name) between 1 and 12`. Fallback: `localStorage`. | No server to run; free tier; works from static host. |
| Hosting | GitHub Pages (or Netlify drop) | Free public link. |

## Supabase setup (user does once)
```sql
create table scores (id bigint generated always as identity primary key,
  board text not null check (board in ('multi','bots')),
  name text not null check (char_length(name) between 1 and 12),
  score int not null check (score between 0 and 5000),
  created_at timestamptz default now());
alter table scores enable row level security;
create policy "read" on scores for select using (true);
create policy "insert" on scores for insert with check (true);
```
Then paste the project URL and anon key into `SUPABASE_URL` / `SUPABASE_KEY` at the top of `index.html`.

## Performance budget
≤ 4 karts, ≤ 20 items, ≤ 200 particles; all drawn with primitive paths. No offscreen caching needed unless profiling shows > 8 ms/frame.
