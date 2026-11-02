---
title: Kitchen Kart — Game Design Document
game_type: racing
platforms: [web-desktop]
status: final
created: 2026-11-02
updated: 2026-11-02
---

# Kitchen Kart - Game Design Document

**Author:** Mastershefu
**Game Type:** Racing (top-down arcade delivery racer)
**Target Platform(s):** Desktop web browser (Chrome, Safari, Firefox, Edge) on laptops

All numbers assume a 960×640 logical playfield at 60 fps; "px/f" means pixels per frame at 60 fps.

---

## Executive Summary

### Core Concept

Kitchen Kart is a top-down racer on a single screen. Two to four toy karts race to fill one shared fast-food order at a time. During a short planning beat, everyone can see the whole map: where the scarce items will land and which colored shop is waiting. Then the karts scramble to grab, hoard and ram items off each other. The first kart to deliver the full order scores, a new order appears, and this repeats until the 90-second clock runs out.

### Target Audience

- **Primary:** Gauntlet cohort mates and Game Week judges, playing together in one room on laptops. They play once or twice, so it has to read and be fun within 10 seconds, with no tutorial.
- **Secondary:** anyone with the link, playing solo against bots and chasing the Vs Bots leaderboard.

### Unique Selling Points (USPs)

1. **A planning beat on every order.** You see the drop sites before they land, so every order is a short strategy-then-execution duel.
2. **Deliberate scarcity.** The key item has one copy fewer than there are players who need it, so someone always loses.
3. **Hoard and ram.** You can starve rivals by holding their items, and they can knock those items loose again.
4. **Two all-time online leaderboards:** Multiplayer and Vs Bots.

---

## Goals and Context

### Project Goals

1. **Win Game Week.** Ship by Thursday 2026-11-05 at 23:59.
2. Make it fun within 10 seconds for a first-time player, with no tutorial screen.
3. Get judges to say "one more", aiming for 70% replaying at least once.
4. Generate every asset in-house: art drawn in code, audio synthesized.
5. Play from one public URL with no install.

### Background and Rationale

The concept starts from Overcooked's order-ticket chaos and shifts it into Game Week's *Multiplayer Racing* genre. A jam audience judges in a room together, so the design favours local couch play on one laptop and an instant rematch. Online leaderboards turn a one-off demo into a competition that carries across laptops. The developer is new to games, so this is a single-screen, single-map design with no camera, no netcode and no levels.

---

## Core Gameplay

### Game Pillars

1. **Plan, then panic.** Every order opens with a planning beat in which item drop sites and the customer are visible before anything can be collected. *Test for any new feature:* does it preserve the 1–3 s where a player can read the map and pick a route?
2. **Scarcity breeds rivalry.** No order ever has enough of its key item for everyone. *Test:* if a change lets every kart complete the order unopposed, reject it.
3. **Pressure you can see.** All urgency is shown on screen: the clock's color, flashing items, the shield blink and a faster music tempo. *Test:* no hidden timers and no hidden stats.
4. **Instant "one more".** It takes at most 2 s and one key press to go from the results screen to the next countdown. *Test:* no flow may add a mandatory screen between rounds.

### Core Gameplay Loop

Each round is 90 s:

1. **Plan.**
   - The first order of a round opens with a **3 s countdown**. Karts are frozen at random spawns, and the map, the drop markers and the customer are visible.
   - Each later order opens with a **1.5 s telegraph**: items show as pulsing landing shadows while karts keep driving.
2. **Scramble.** Items land. Drive through an item to collect it.
3. **Deny.** Hoard extra items, up to the carry limit, to starve rivals.
4. **Ram.** Hit a loaded rival hard enough and their top item flies off onto the road.
5. **Deliver.** The first kart to reach the customer's door carrying every ordered item scores. The other order items on the map vanish with a poof, and the next order begins at step 1 (telegraph).

The loop repeats until the clock reaches 0. If the clock hits 0 mid-order, nobody scores that order.

### Win/Loss Conditions

- **Round end:** after 90 s, the kart with the highest score wins.
  - Ties share the win, with "TIE!" shown.
  - The results screen shows the ranking, each kart's score, delivery count and best streak, and the player's personal best.
- **Leaderboards:** a human's round score can go on an all-time board.
  - **Vs Bots board:** the single human's score in a Vs Bots round.
  - **Multiplayer board:** each human's score in a Party round of 2 or more humans.
- There is no fail state; a score of 0 is still a finished round.

---

## Game Mechanics

### Primary Mechanics

**Driving** (arcade handling; tuned from the prototype)

| Parameter | Value |
|---|---|
| Acceleration | 0.28 px/f² forward; 0.18 px/f² reverse/brake |
| Top speed | 6.0 px/f (360 px/s) |
| Friction | velocity × 0.975 per frame |
| Steering | 0.065 rad/f at full speed, scaled by forward speed / 3 (no turning in place) |
| Grip | lateral velocity pulled toward the heading by 12% per frame (drifty but controllable) |
| Wall/building hit | velocity × −0.4 (bounce); kart pushed out to 12 px clearance |
| Kart collision radius | 12 px |

**Drift boost**

- Hold **Drift** while turning at speed ≥ 3.0 px/f to drift. Grip drops to 4% per frame and sparks appear.
- Drifting builds charge at 2 per second, capped at 1.2. One drifted 90° corner (about 0.3 s) earns a small boost.
- Releasing Drift with charge ≥ 0.5 fires a boost. Top speed rises to 8.4 px/f (×1.4) and an extra forward impulse of 1.5 px/f is added. The boost lasts 0.3 s + 0.4 s × charge (0.5–0.78 s).
- Releasing below 0.5 charge does nothing.
- Spark color shows the charge: white below 0.5, orange at 0.5 or more, pink at 1.0 or more.

**Items and orders**

- **Item types (4):** burger, fries, milkshake, ketchup.
- **An order** is 2 or 3 distinct item types (50/50 chance), plus one customer shop picked at random from the 6 colored shops. It can't repeat the previous shop.
- **Key item:** one item type per order, chosen at random. It's shown with a ★ on the HUD ticket.
- **Copies on the map at order start:** with N karts in the round,
  - each non-key item type: N − 1 copies (at least 2);
  - the key item: 1 copy at first, then 1 more after **8 s** with a telegraph. With 4 karts, 2 copies arrive at 8 s.
- **Faders:** 40% of the non-key copies are faders.
  - A fader blinks for its final 1.5 s and disappears after **5 s**.
  - It instantly re-telegraphs at a new random road spot and lands 1.0 s later as a fresh fader.
- **Fair spawn (pillar 2):**
  - Generate 30 candidate sets of drop sites on road tiles at least 60 px from any kart.
  - Pick the set whose centroid has the lowest spread of distance to the karts (lowest standard deviation).
  - The aim is that no kart starts closer to the loot as a whole.
- **Pickup:** drive within 22 px of a landed item. Duplicates are allowed.
- **Carry limit:** the number of items in the order + 2, so 4 or 5 items. At the limit, driving over an item does nothing, and a "FULL" tag flashes over the kart for 0.5 s.
- **Stacks carry over between orders, partly.** When a new order starts, any carried item the new order doesn't use poofs away. Leftovers it can use stay, so hoarding still pays.
- **Delivery:**
  - Be within 30 px of the customer door while carrying every ordered item type.
  - Only one copy of each ordered type is removed from the stack; the rest stays.
  - If two karts qualify on the same frame, the lower kart index wins. In practice this is never noticed.

**Ramming**

- On a kart-to-kart contact, compare each kart's speed along the contact normal toward the other.
- The faster kart is the rammer if its closing speed exceeds the victim's by at least **2.5 px/f**.
- The victim's **top** stack item flies 40–60 px away, away from the rammer, and lands on a road tile.
- It can be picked up after 0.4 s, by anyone, including the victim.
- The victim gets a **1.0 s shield**: it blinks at 10 Hz and can't drop items.
- Both karts bounce off each other with elastic separation × 0.6.
- An empty-handed victim just bounces.

**Scoring**

- A delivery scores `round((100 + speed) × streak)`:
  - `speed = max(0, 100 − 10 × seconds since the order's items first landed)`;
  - `streak` is ×1 for your first consecutive delivery, ×1.5 for your 2nd in a row, and ×2 for the 3rd and later.
  - A delivery by any other kart resets your streak.
- So a delivery is worth 100–400 points. A strong 90 s round lands around 800–1,500 for the leader.

**The clock (pillar 3)**

| Remaining | Clock color | Music tempo |
|---|---|---|
| More than 45 s | white `#ffffff` | ×1.0 |
| 45–18 s | light orange `#ffb36b` | ×1.15 |
| Under 18 s | light red `#ff7b7b`, pulsing | ×1.35 |

### Controls and Input

| Action | P1 (keyboard L) | P2 (keyboard R) | Gamepad (P3–P4, or any) |
|---|---|---|---|
| Accelerate | W | ↑ | A / RT |
| Brake / reverse | S | ↓ | B / LT |
| Steer | A / D | ← / → | Left stick / D-pad |
| Drift (hold) | Left Shift | Right Shift or `/` | X / RB |
| Menu confirm | Space / Enter | Enter | A / Start |
| Rematch on results | Space / Enter | Enter | A / Start |
| Back to menu | Esc | Esc | Back / Select |

- The two keyboard layouts sit far apart, which keeps them clear of most laptop key-ghosting.
- A gamepad joins on any button press on the mode screen.
- Pressing a gamepad button during play does not add a kart; players can only join between rounds.

---

## Racing Specific Design

### Vehicle Handling and Physics

- **Model:** arcade only (see Primary Mechanics), with no simulation.
- **Stats:** every kart has identical stats so that results come down to skill and planning.
- **No damage system.** The only consequence of contact is dropped items.

### Vehicle Roster

- Four karts with identical stats, told apart only by color and number:
  - P1 pink `#ff4f9a`
  - P2 blue `#3fd0ff`
  - P3 yellow `#ffd23f`
  - P4 green `#5fd068`
- A bot takes the color of the slot it fills and is labelled "BOT".
- No unlocks and no customization in v1.

### Track Design

- **One arena map, "Toy Town."** It's a single-screen grid, not a lap track:
  - a 4×3 grid of 140×110 px blocks, with 80 px roads between them and a road ring around the edge;
  - 6 blocks are colored **customer shops**, each with a door marker on its road-facing side;
  - the other 6 blocks are props (toy houses and trees) that act as obstacles.
- Item drop sites can only be on road tiles at least 20 px from any building.
- No hazards in v1. A stretch goal is a puddle that halves grip.
- **Shortcuts:** none. The grid gives many equal-length routes, so the routing skill is choosing which item to go for, not finding hidden paths.

### Race Mechanics

- **Start:** a 3 s countdown ("3, 2, 1, GO!"). Karts are frozen during it.
  - Spawns are random road points at least 150 px apart.
  - There is no reaction-time bonus.
- **No laps, checkpoints or positions.** The scoreboard *is* the race position.
- No slipstreaming, pit stops or weather.

### Powerups and Boost

- **Drift boost** is the only boost. It is skill-based and has no pickups.
- **No offensive items.** Ramming is the only offense. This keeps attention on the delivery items and keeps pillar 2 clean.

### Game Modes

1. **Vs Bots:** 1 human against 1–3 bots; the default is 3. Scores go to the **Vs Bots** board.
2. **Party:** 2–4 humans on one laptop. P1 and P2 use the keyboard, and P3–P4 use gamepads.
   - "Fill with bots" defaults to on, bringing the round up to 4 karts.
   - Scores go to the **Multiplayer** board.

**Bot behaviour** (one difficulty level, "Normal")

- **Routing:** bots drive along the road grid toward a target.
- **Targets, in priority order:**
  1. If carrying the full order: go to the customer.
  2. Otherwise, the nearest missing order item that is not already closer to another bot.
  3. If a rival within 90 px carries an item the bot is missing: ram it.
  4. When at least 2 slots are free, take a detour of under 120 px to hoard a key item.
- **Handicap:** top speed ×0.92, the target is re-picked every 0.25 s, and bots never drift.
- **No rubber-banding.** Leaderboard scores against bots need a constant baseline.

### Progression and Unlocks

- None in v1. Progression is the player's personal best and their rank on the leaderboards.

---

## Progression and Balance

### Player Progression

- Skill progression only: learning the drift boost, routing, when to hoard and when to ram.
- The results screen shows "NEW BEST!" whenever a score beats the personal best stored on that laptop.

### Difficulty Curve

- There's no difficulty curve inside a round, except that the clock and music build pressure.
- Difficulty comes from the opponents: more bots or more humans means more competition for scarce items.

### Economy and Resources

- Items are the only resource. They exist only within the current order (stacks carry over).
- Scarcity rules are in Primary Mechanics.

**Tuning knobs**, kept as named constants:

| Knob | Value |
|---|---|
| Round length | 90 s |
| Key-item second-copy delay | 8 s |
| Fader share | 40% |
| Fader life | 5 s |
| Ram threshold | 2.5 px/f |
| Shield | 1.0 s |
| Bot speed | ×0.92 |
| Carry limit | order + 2 |

---

## Level Design Framework

### Level Types

- A single-screen arena, with one map in v1. A second map is a stretch goal.

### Level Progression

- None. Every round uses the same map, and replay value comes from random spawns, orders, key items and faders.

---

## Art and Audio Direction

### Art Style

- **Chunky toy:** bright, rounded, saturated primary colors, toy karts on a play mat, and soft drop shadows (offset by 3 px at 25% black).
- **Background:** a soft teal play-mat with a faint stitched border. Roads are light grey with dashed white lines.
- **Blocks:** rounded rectangles (corner radius 14 px) with a 6 px darker base, so they look extruded like toy blocks.
- **Shops:** a striped awning in the shop's color and a big icon sign.
- **Karts:** rounded bodies 28×20 px, chunky black wheels, a white windshield, and a player-number badge.
- **Items:** simple chunky icons drawn in code at 12–14 px radius, readable at a glance:
  - burger: a stacked bun, patty and lettuce;
  - fries: a red box with yellow sticks;
  - milkshake: a cup, straw and cherry;
  - ketchup: a red bottle.
- **The HUD ticket** is a top-center paper ticket. It shows the item icons (★ marks the key item), the customer's color swatch and the door location.
- **Juice:**
  - pickups pop at 1.3× scale and shrink back;
  - deliveries burst confetti in the customer's color and float a "+pts" label;
  - rams shake the screen for 6 px over 0.15 s;
  - drifts throw sparks.
- **Everything is drawn in code.** There are no image files, which meets the "all assets generated" rule.

### Audio and Music

All audio is synthesized at runtime; there are no audio files.

**Music** is a bouncy 8-step bass-and-melody loop at 128 BPM. The tempo multiplier steps up with the clock color, and the loop plays during rounds only.

**Sound effects:**

| Event | Sound |
|---|---|
| Pickup | Rising blip; pitch rises with stack height |
| Full stack | Dull thunk |
| Deliver | 3-note arpeggio |
| Ram | Low crunch |
| Item knocked loose | Descending blip |
| Drift | Sizzle that rises with charge |
| Boost | Whoosh |
| Countdown | 3 beeps + a GO chord |
| Last 5 s | Ticks |
| Round end | Fanfare |

---

## Technical Specifications

### Performance Requirements

- A steady 60 fps on a 2020+ MacBook Air in Chrome, with 4 karts, 12 items and full particle effects. Measure it over a full 90 s round.
- At most 2 s from loading the page to a playable title screen on home Wi-Fi.
- Input-to-motion latency of 1 frame or less.

### Platform-Specific Details

- Desktop browsers only. The playfield scales to fit the window while keeping its aspect ratio; the minimum supported viewport is 960×640.
- Audio starts on the first key press, because browsers need a user gesture before playing sound.
- Gamepad support uses standard mapping. A player can join with a pad by pressing any button on the mode screen.
- Mobile is out of scope.

### Asset Requirements

- 0 external asset files. Every visual is drawn procedurally and every sound is synthesized.
- Leaderboard backend: a hosted table with public insert and read access, limited to the top 10 per board. If it can't be reached, the game falls back to a local board.

---

## Development Epics

### Epic Structure

| # | Epic | Delivers | Pillars |
|---|---|---|---|
| E1 | Core Order Loop | Orders, items, key/scarcity, faders, fair spawn, carry limit, delivery, scoring, clock colors | 1, 2, 3 |
| E2 | Contact and Drift | Ramming, item knock-off, shield, drift boost | 2, 3 |
| E3 | Modes and Players | Title/mode screens, 2 keyboard players, gamepads P3–P4, results and rematch | 4 |
| E4 | Bots | Road-grid routing, target priorities, hoard/ram behaviour | 2 |
| E5 | Leaderboards | Two online all-time boards, name entry, local fallback, personal best | 4 |
| E6 | Chunky Toy Presentation | Map art, karts, item icons, HUD ticket, juice, music and SFX | 3 |

**Sequence:** E1 → E2 → E3 → E4 → E5 → E6, matching the brief's MVP order. E6 can start alongside the others once E1 is in place. The detailed breakdown is in [epics.md](epics.md).

---

## Success Metrics

### Technical Metrics

- 60 fps sustained over a 90 s, 4-kart round.
- Zero console errors in a full session that goes through the title, a round, the results, a rematch and the leaderboard.
- Leaderboard writes succeed at least 95% of the time; on failure the game falls back to the local board without breaking.

### Gameplay Metrics

Measured at the Wednesday playtest with 3 or more cohort mates:

- At least 70% of testers press rematch at least once.
- A first-time player delivers an order within their first 30 s.
- At least 2 rams per kart per round in 4-kart games, which shows contact matters.
- The key item is contested (2 or more karts head for it) in at least 60% of orders.

---

## Out of Scope

**Cut for v1:**
- Online remote multiplayer (netcode)
- Mobile and touch
- Accounts and authentication
- Kart stats and unlocks
- Offensive power-ups
- Multiple maps
- Bot difficulty levels
- Hazards
- A tutorial screen; the HUD ticket teaches the game

**Deferred to after Game Week:**
- Online play
- A second map with hazards
- Cosmetics
- Anti-cheat for the leaderboards

---

## Assumptions and Dependencies

- `[ASSUMPTION]` A hosted free-tier database (Supabase) provides public read and insert for the leaderboards. It needs the developer to create a project and paste its URL and anon key. Until then the game uses the local board.
- `[ASSUMPTION]` Micro Machines is the right feel reference for top-down toy-kart local play.
- **The open leaderboard can be spammed.** That's acceptable for a jam. Mitigations: names are 1–12 characters, and scores above 5,000 are rejected as impossible.
- **Hosting:** a static host such as GitHub Pages, Cloudflare Pages or Netlify, with a public URL.
- **Gamepads:** at least one gamepad is needed to test P3 and P4.

All the brief's earlier assumptions are now resolved by user pre-approval on 2026-11-02 (see decision-log.md):
- at most 3 items per order;
- the combo is the streak multiplier;
- rounds are 90 s, changed from 60.
