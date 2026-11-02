# Kitchen Kart — Development Epics

Stories are player-facing; acceptance criteria reference GDD numbers.

## E1 Core Order Loop
- E1.1 Round flow: 3 s frozen countdown → 90 s round → results. AC: karts can't move during countdown; clock hits 0 → results.
- E1.2 Orders: 2–3 distinct items + customer shop (no repeat shop), one ★ key item, HUD ticket. AC: ticket always visible; door highlighted.
- E1.3 Scarce spawns: non-key N−1 (min 2) copies, key 1 copy + extra after 8 s; 1.5 s telegraph shadows; fair-centroid pick of 30 candidates.
- E1.4 Faders: 40% non-key copies blink last 1.5 s, vanish at 5 s, re-telegraph elsewhere 1.0 s.
- E1.5 Pickup + carry limit (order+2), "FULL" tag.
- E1.6 Delivery + scoring: (100 + speed) × streak; removes one of each ordered type; clears remaining order items; next order with telegraph.
- E1.7 Clock colors white/orange/red at 45/18 s.

## E2 Contact and Drift
- E2.1 Kart–kart collision with bounce.
- E2.2 Ram: closing-speed diff ≥ 2.5 → victim drops top item 40–60 px away, pickable after 0.4 s; victim 1 s shield blink.
- E2.3 Drift + boost: hold drift ≥ 3 px/f, charge, release ≥ 0.5 → boost; spark colors.

## E3 Modes and Players
- E3.1 Title → mode select (Vs Bots with 1–3 bots; Party with 2–4 humans, fill-with-bots toggle).
- E3.2 Keyboard P1 (WASD+LShift), P2 (arrows+RShift or /).
- E3.3 Gamepads join P3/P4 on mode screen.
- E3.4 Results: ranking, deliveries, best streak, PB; Space/Enter rematch ≤ 2 s; Esc menu.

## E4 Bots
- E4.1 Road-grid routing to any target.
- E4.2 Target priority: deliver → nearest unclaimed missing item → ram nearby carrier → hoard key item; ×0.92 speed; re-target every 0.25 s.

## E5 Leaderboards
- E5.1 In-canvas name entry (1–12 chars), remembered per laptop.
- E5.2 Two boards (Multiplayer, Vs Bots), top 10 shown on title + results.
- E5.3 Online backend (Supabase REST) with local fallback; reject score > 5000.

## E6 Chunky Toy Presentation
- E6.1 Play-mat map, rounded extruded blocks, shops with awnings, toy houses.
- E6.2 Karts, item icons, HUD ticket.
- E6.3 Juice: pickup pop, confetti, floaters, screen shake, sparks.
- E6.4 Music loop with tempo steps; full SFX list.
