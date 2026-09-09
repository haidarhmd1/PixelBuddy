# PixelBuddy

> **A tiny game world powered by your real-world activity.**

PixelBuddy is an experimental React Native game where movement and workouts captured through Apple Health and Apple Watch influence a persistent pixel-art world.

Instead of being another fitness dashboard filled with rings, charts, calories, and generic goals, PixelBuddy treats physical activity as **game input**.

Your body is effectively the controller.

```text
You move
   ↓
Apple Watch
   ↓
Apple Health / HealthKit
   ↓
PixelBuddy game systems
   ↓
The world reacts
```

Walk outside and Pixel can travel through the world.

Complete a workout and Pixel can gain experience, progress construction, discover an item, or trigger an event.

Stay active consistently and the world itself can gradually change.

The project combines mobile development, health-data integration, graphics programming, game-development concepts, animation, simulation, and backend engineering inside a React Native application.

---

# Quick Look

If you only have a minute:

| | |
|---|---|
| **What is it?** | A pixel-art game driven by real-world activity |
| **Main platform** | React Native + Expo |
| **Activity source** | Apple Health / Apple Watch |
| **Rendering** | React Native Skia |
| **Core mechanic** | Physical activity advances a virtual world |
| **Game concepts** | Exploration, progression, loot, encounters, simulation |
| **Backend** | Fastify + oRPC + PostgreSQL + Drizzle |
| **Status** | Active development / early game-world prototype |

The shortest possible explanation is:

```text
Apple Watch activity
        ↓
Pixel walks
        ↓
Pixel reaches somewhere new
```

---

# Contents

Use this as a shortcut depending on what you are interested in.

### 🎮 Product & Game Concept

- [The Idea](#the-idea) — Why PixelBuddy exists and how it differs from a normal fitness app.
- [Core Philosophy](#core-philosophy) — The rule used to decide which features belong in the project.
- [The World](#the-world) — How physical distance becomes movement through a fictional pixel-art world.
- [Apple Watch as a Game Controller](#apple-watch-as-a-game-controller) — How real health/activity data enters the game.
- [The Main Gameplay Loop](#the-main-gameplay-loop) — The basic activity → simulation → world-update loop.

### 🧍 Game Systems

- [Pixel](#pixel) — The player's character and its internal game state.
- [Exploration](#exploration) — How walking progresses a journey.
- [Discoveries](#discoveries) — Unlocking locations, objects, characters, and secrets.
- [Encounters](#encounters) — Activity-driven random events.
- [Loot](#loot) — Weighted item drops and collectibles.
- [Character Progression](#character-progression) — XP, attributes, cosmetics, and progression.
- [World Progression](#world-progression) — Making workouts visibly change the world.
- [A Persistent World](#a-persistent-world) — Processing what happened while the app was closed.
- [Workout Replays](#workout-replays) — Turning real workouts into short animated game stories.

### 🎨 Graphics & Game-Dev Experiments

- [Day / Night and World Atmosphere](#day--night-and-world-atmosphere) — Time, weather, particles, and atmosphere.
- [Graphics](#graphics) — Using React Native Skia as a small 2D renderer.
- [Procedural Generation](#procedural-generation) — Seeded worlds, noise, and generated journeys.
- [Game Systems](#game-systems) — Separating simulation logic into independent systems.
- [Event-Driven Game Logic](#event-driven-game-logic) — Transforming activity into game events.
- [Possible Future Game Architecture](#possible-future-game-architecture) — ECS and other deeper game-engine experiments.

### 🛠 Technical

- [Technical Stack](#technical-stack) — React Native, Expo, Skia, Fastify, oRPC, Drizzle, PostgreSQL, and more.
- [High-Level Architecture](#high-level-architecture) — How Apple Health, game logic, backend, state, and rendering connect.
- [Suggested Native Game Structure](#suggested-native-game-structure) — Possible folder organization as the game grows.
- [Repository Structure](#repository-structure) — Monorepo layout.
- [Getting Started](#getting-started) — Install and run the project.
- [Database Setup](#database-setup) — PostgreSQL + Drizzle setup.
- [Development](#development) — Running web, API, and native apps.
- [Shared UI](#shared-ui) — Shared web UI primitives.
- [Database Commands](#database-commands) — Database scripts.
- [Code Quality](#code-quality) — TypeScript, Biome, and checks.
- [Docker](#docker) — Containerized backend setup.
- [Available Scripts](#available-scripts) — Useful repository commands.

### 🗺 Project Direction

- [MVP](#mvp) — The intentionally small first playable version.
- [Example MVP World](#example-mvp-world) — What the first map could contain.
- [What PixelBuddy Is Not](#what-pixelbuddy-is-not) — Features deliberately excluded from the project.
- [Roadmap](#roadmap) — Planned development phases.
- [Why Build This?](#why-build-this) — The engineering motivation behind the project.
- [Design Rule](#design-rule) — The project's core feature test.
- [Status](#status) — What is currently being worked on.

---

# The Idea

Most fitness applications represent activity as numbers:

```text
Steps:          8,247
Distance:       6.2 km
Workout:        43 min
Active Energy:  487 kcal
```

PixelBuddy asks a different question:

> **What if that activity changed a small game world instead?**

Rather than opening the app and seeing:

```text
You completed 82% of your step goal.
```

you might see:

```text
WHILE YOU WERE AWAY...

Pixel travelled 4.8 km.

🌲 Whispering Woods discovered.

🎁 You found:
Moon Mushroom × 1
```

The health data still exists underneath the application.

It simply becomes input into a simulation rather than being the entire product.

---

# Core Philosophy

PixelBuddy is intentionally **not an all-purpose health application**.

The central idea is deliberately narrow:

> **Physical activity moves a virtual world forward.**

Every major feature should therefore answer one question:

> Does this make the world react to the player?

If a feature merely creates another chart or another way of displaying Apple Health data, it probably does not belong in PixelBuddy.

---

# The World

The first version of PixelBuddy uses a very small fictional world rather than an enormous map.

For example:

```text
🏠 Pixel Home
      │
      │
🌲 Whispering Woods
      │
      │
🌉 Old Bridge
      │
      │
🏘️ Moss Village
      │
      │
🏔️ Pixel Mountain
```

Real-world movement progresses Pixel through this journey.

Example:

```text
0 km      Pixel Home
2 km      Whispering Woods
5 km      Old Bridge
10 km     Moss Village
20 km     Pixel Mountain
```

The numbers and locations are game-design values rather than representations of actual geographic locations.

PixelBuddy does **not** need to reproduce your real-world GPS route.

The physical distance acts as progression through a fictional world.

---

# Apple Watch as a Game Controller

One of the main experiments behind PixelBuddy is treating Apple Watch data as a passive game controller.

```text
┌───────────────┐
│  Apple Watch  │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Apple Health  │
│ / HealthKit   │
└───────┬───────┘
        │
        ▼
┌────────────────────┐
│ Health Integration │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Pixel Game Engine  │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│   Skia Renderer    │
└────────────────────┘
```

Health information is normalized into game-friendly events.

For example:

```text
Walking
   ↓
Exploration

Running
   ↓
Endurance / travel

Strength workout
   ↓
Training / construction

Consistency
   ↓
World progression
```

The goal is not necessarily to map every health metric directly to a game statistic.

For example:

```text
1 step = 1 XP
```

would be technically easy but not particularly interesting.

Instead, PixelBuddy uses health activity to drive **systems**.

---

# The Main Gameplay Loop

The basic loop is intentionally simple.

```text
Real-world activity
        ↓
Health data
        ↓
Normalize activity
        ↓
Game systems
        ↓
Generate events
        ↓
Update world state
        ↓
Render result
```

For example:

```text
Walk 2.4 km
      ↓
Pixel travels
      ↓
Crosses exploration threshold
      ↓
New area discovered
      ↓
Loot roll
      ↓
World animation
```

---

# Pixel

Pixel is the player's character inside the world.

Instead of functioning as a simple avatar, Pixel can gradually develop its own state.

For example:

```ts
type PixelState = {
  level: number;
  xp: number;

  energy: number;
  strength: number;
  endurance: number;

  location: Location;
  mood: Mood;

  discoveries: Discovery[];
};
```

Eventually Pixel could also have a tiny simulated brain:

```ts
type PixelBrain = {
  energy: number;
  curiosity: number;
  confidence: number;

  currentAction: Action;
};
```

That opens the door to simple NPC/game-AI experiments.

```text
Player activity
      ↓
World state changes
      ↓
Pixel evaluates state
      ↓
Pixel chooses an action
      ↓
Animation
```

For example:

```text
High curiosity
      +
new forest unlocked
      ↓
Pixel decides to explore
```

The first implementation does not need machine learning or an LLM.

Simple state machines, utility systems, weighted decisions, or behavior trees are more appropriate and more interesting from a game-development perspective.

---

# Exploration

Walking is primarily treated as exploration.

Instead of:

```text
7,542 / 10,000 steps
```

the player might see:

```text
Journey to Pixel Mountain

🏠─────────────────────🧍──────────🏔️
Home                              Mountain

7.4 / 20 km

Next:
🌉 Old Bridge
600 m
```

Reaching thresholds can generate discoveries.

```ts
const journey = [
  {
    distance: 0,
    location: "PIXEL_HOME",
  },
  {
    distance: 2_000,
    location: "WHISPERING_WOODS",
  },
  {
    distance: 5_000,
    location: "OLD_BRIDGE",
  },
  {
    distance: 10_000,
    location: "MOSS_VILLAGE",
  },
];
```

This allows the first playable prototype to work without:

- open-world movement
- collision detection
- pathfinding
- GPS mapping
- complicated level design

Pixel can simply move along a predefined journey.

---

# Discoveries

Movement can unlock locations, objects, characters, or events.

For example:

```text
✨ NEW LOCATION

WHISPERING WOODS

Pixel travelled far enough today
to reach a new part of the world.
```

Discoveries provide a stronger sense of progression than simply increasing a number.

Possible discoveries include:

- locations
- camps
- bridges
- forests
- villages
- ruins
- characters
- collectibles
- secrets
- cosmetic items

---

# Encounters

Activity can occasionally trigger encounters.

For example:

```text
You travelled 5 km today.

       ↓

Encounter roll

       ↓

🐉 Rare encounter!
```

This introduces classic game-development probability systems.

```ts
const encounterChance =
  baseChance *
  activityMultiplier *
  biomeMultiplier;
```

Different regions can have different encounter tables.

---

# Loot

Exploration can generate collectible items.

Example:

```text
🌲 FOREST EXPEDITION

Found:

🪵 Wood × 12
🍄 Mushroom × 3
💎 Strange Crystal × 1
```

Loot can use weighted probabilities:

```ts
const lootTable = [
  { item: "wood", weight: 50 },
  { item: "berry", weight: 30 },
  { item: "crystal", weight: 15 },
  { item: "ancient_coin", weight: 4 },
  { item: "golden_egg", weight: 1 },
];
```

This creates an opportunity to experiment with:

- weighted random selection
- rarity systems
- deterministic randomness
- seeded random generators
- loot balancing

without requiring a complicated game.

---

# Character Progression

Activity can also gradually develop Pixel.

Possible statistics:

```text
LEVEL        12

Strength     32
Endurance    41
Energy       72
Exploration  58
```

Different activity types may affect different systems.

```text
Walking
→ exploration

Running
→ endurance

Strength training
→ strength

Workout consistency
→ world development
```

The character may eventually unlock:

- clothes
- backpacks
- hats
- shoes
- pets
- trails
- camp decorations
- animations

The goal is to make progression visible rather than purely numerical.

---

# World Progression

The world itself can evolve.

For example, completing workouts might contribute resources toward construction:

```text
🏋️ Workout completed

WORKSHOP

██████████████░░░░░░

72%
```

Later:

```text
🔨 CONSTRUCTION COMPLETE

Workshop unlocked!
```

This gives activity a persistent consequence.

Instead of:

```text
Workout complete
+150 XP
```

the player sees something in the world change.

---

# A Persistent World

PixelBuddy is intended to feel like the world exists even when the application is closed.

When the player returns, the application can process activity accumulated since the previous session.

Example:

```text
WHILE YOU WERE AWAY...

Pixel travelled 4.82 km.

🌲 Reached Whispering Woods

🎁 Found a Moon Mushroom

⚒️ Workshop construction +14%
```

This is one of the most important parts of the experience.

The user does not need to actively play PixelBuddy while exercising.

Real-world activity becomes the gameplay session.

---

# Workout Replays

A future experiment is transforming a real workout into a short visual game replay.

For example, a 45-minute workout could produce:

```text
WORKOUT RECAP

00:00
🏠 Pixel left camp

12:31
🌲 Entered Deep Forest

23:14
🐺 Encountered a wolf

31:44
💎 Found a crystal

45:02
🏕️ Reached camp
```

The interesting technical challenge is converting:

```text
45 minutes of telemetry
```

into:

```text
30 seconds of visual simulation
```

This involves timeline normalization, event generation, interpolation, animation, and procedural storytelling.

---

# Day / Night and World Atmosphere

The same location can look different depending on time.

Day:

```text
DAY

       ☀️

🌲             🌲

       🧍

🌿 🌿 🌿 🌿 🌿
```

```text
NIGHT

       🌙

🌲             🌲

      🔥🧍

░░░░░░░░░░░░░
```

Possible visual systems include:

- sunrise
- sunset
- night
- clouds
- rain
- fog
- particles
- wind
- lighting
- weather effects

These are rendered using React Native Skia rather than being conventional UI components.

---

# Graphics

PixelBuddy uses **React Native Skia** for its game-world rendering.

Rather than using Skia only for animated fitness rings or charts, the goal is to treat the screen more like a small 2D rendering environment.

A scene may eventually look conceptually like:

```text
Skia Canvas
│
├── Background
│   ├── sky
│   ├── sun / moon
│   └── clouds
│
├── Terrain
│   ├── ground
│   ├── water
│   ├── paths
│   └── vegetation
│
├── Entities
│   ├── Pixel
│   ├── NPCs
│   ├── animals
│   └── items
│
├── Effects
│   ├── particles
│   ├── rain
│   ├── fog
│   └── lighting
│
└── HUD
```

This makes PixelBuddy partly an experiment in graphics programming inside React Native.

---

# Procedural Generation

Procedural world generation is another planned computer-science playground.

Rather than manually designing every journey, worlds could eventually be generated using a seed.

```ts
generateWorld({
  seed: 847219,
  length: 50,
});
```

This opens the door to experimenting with:

- seeded pseudo-random number generation
- deterministic worlds
- weighted generation
- Perlin / Simplex noise
- biome generation
- procedural placement
- graph generation
- path generation

The first PixelBuddy version does **not** need procedural generation.

It is an intentional future experiment.

---

# Game Systems

The internal application architecture aims to keep game logic separate from presentation.

Possible systems include:

```text
GameEngine
│
├── MovementSystem
├── ProgressionSystem
├── DiscoverySystem
├── LootSystem
├── EncounterSystem
├── WorldSystem
└── EventSystem
```

A health activity should not directly manipulate UI components.

Instead:

```text
Health data
   ↓
Game engine
   ↓
Game events
   ↓
State
   ↓
Renderer
```

---

# Event-Driven Game Logic

A useful abstraction for PixelBuddy is a game-event system.

```ts
type GameEvent =
  | {
      type: "DISCOVERY";
      location: string;
    }
  | {
      type: "LOOT";
      itemId: string;
    }
  | {
      type: "LEVEL_UP";
      level: number;
    }
  | {
      type: "ENCOUNTER";
      encounterId: string;
    };
```

Activity processing can then generate events:

```ts
processActivity(activity): GameEvent[]
```

Example:

```ts
[
  {
    type: "DISCOVERY",
    location: "OLD_BRIDGE",
  },
  {
    type: "LOOT",
    itemId: "mysterious_key",
  },
];
```

The renderer decides how those events should look.

This keeps:

```text
game logic
```

separate from:

```text
animations and UI
```

---

# Possible Future Game Architecture

PixelBuddy may eventually be used to explore more traditional game-engine architecture such as an **Entity Component System**.

Conceptually:

```text
Entity 42
│
├── Position
├── Velocity
├── Sprite
├── Animation
├── Health
└── AI
```

Systems then operate on compatible components:

```text
MovementSystem

Position + Velocity
        ↓
new Position
```

Possible systems:

```text
MovementSystem
RenderSystem
AnimationSystem
AISystem
CollisionSystem
InteractionSystem
```

This is intentionally **not required for the MVP**.

The project should earn this complexity before adopting it.

---

# MVP

The first proper PixelBuddy version should remain deliberately small.

## Inputs

Only:

- steps / walking activity
- completed workouts

## World

Only:

- one character
- one journey
- around five locations
- a small pixel-art environment

## Gameplay

Only:

- movement
- XP
- discoveries
- three or four collectible items
- simple progression

## Graphics

Only:

- idle animation
- walking animation
- location transitions
- basic day/night
- a few particle effects

That is enough to prove the idea.

---

# Example MVP World

```text
                  🏔️
             PIXEL MOUNTAIN
                   │
                   │
             🌲 🌲 🌲
                   │
              OLD BRIDGE
            ═══════════
                   │
           🌲      │      🌲
                   │
                  🧍
                   │
               🔥  🏠
               HOME CAMP
```

The first map does not need to be large.

A small tile-based environment is enough to establish the visual language of PixelBuddy.

---

# What PixelBuddy Is Not

To protect the identity of the project, several features are deliberately outside the core scope.

PixelBuddy is not intended to become:

- a calorie tracker
- a diet tracker
- a meal scanner
- an AI health coach
- a generic habit tracker
- a meditation app
- a journal
- a social network
- a full Apple Health dashboard
- a collection of health charts
- an application containing every wellness feature possible

Those may be useful products.

They are simply not what PixelBuddy is trying to explore.

---

# Technical Stack

PixelBuddy is built using [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), with a TypeScript monorepo containing the native application, web application, backend, shared API layer, database, and UI packages.

## Mobile

- **React Native** — native mobile application
- **Expo** — React Native tooling and native project workflow
- **TypeScript** — shared type safety
- **React Native Skia** — custom rendering and animation
- **Apple Health / HealthKit integration** — physical activity as game input

## Web

- **Next.js**
- **React**
- **Tailwind CSS**
- **shadcn/ui**

## Backend

- **Fastify** — backend HTTP server
- **oRPC** — end-to-end type-safe APIs
- **Node.js**

## Data

- **PostgreSQL**
- **Drizzle ORM**

## Monorepo / Tooling

- **Turborepo**
- **Biome**
- **npm**
- **Docker Compose**

---

# High-Level Architecture

```text
                    APPLE WATCH
                         │
                         ▼
                 APPLE HEALTH DATA
                         │
                         ▼
              ┌─────────────────────┐
              │ Health Integration  │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Activity Normalizer │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │     Game Engine     │
              │                     │
              │ Movement            │
              │ Progression         │
              │ Discovery           │
              │ Loot                │
              │ Encounters          │
              │ World               │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │    Game Events      │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │     Game State      │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ React Native Skia   │
              │      Renderer       │
              └─────────────────────┘
```

The backend can handle persistent player state, accounts, synchronization, and server-owned progression.

The mobile application handles native health-data access, immediate game presentation, and the interactive world.

---

# Suggested Native Game Structure

As the game systems grow, the native application can move toward a structure such as:

```text
apps/native/
└── src/
    ├── health/
    │   ├── HealthAdapter.ts
    │   ├── normalizeActivity.ts
    │   └── normalizeWorkout.ts
    │
    ├── engine/
    │   ├── GameEngine.ts
    │   │
    │   └── systems/
    │       ├── MovementSystem.ts
    │       ├── ProgressionSystem.ts
    │       ├── DiscoverySystem.ts
    │       ├── LootSystem.ts
    │       ├── EncounterSystem.ts
    │       └── WorldSystem.ts
    │
    ├── world/
    │   ├── locations.ts
    │   ├── biomes.ts
    │   └── generateWorld.ts
    │
    ├── entities/
    │   ├── Pixel.ts
    │   ├── NPC.ts
    │   └── Item.ts
    │
    ├── simulation/
    │   ├── Simulation.ts
    │   └── GameClock.ts
    │
    ├── renderer/
    │   ├── PixelCanvas.tsx
    │   │
    │   ├── scenes/
    │   │   ├── WorldScene.tsx
    │   │   └── WorkoutReplay.tsx
    │   │
    │   └── effects/
    │       ├── Rain.tsx
    │       ├── Fog.tsx
    │       └── Particles.tsx
    │
    └── state/
        └── gameStore.ts
```

This is a direction rather than a requirement.

PixelBuddy should stay simple until the gameplay actually requires additional architecture.

---

# Repository Structure

```text
PixelBuddy/
├── apps/
│   ├── web/         # Next.js web application
│   ├── native/      # React Native / Expo application
│   └── server/      # Fastify / oRPC backend
│
├── packages/
│   ├── ui/          # Shared shadcn/ui components and styles
│   ├── api/         # Shared API / business logic
│   └── db/          # Drizzle schema and database queries
│
├── docker-compose.yml
├── package.json
└── turbo.json
```

---

# Getting Started

Install dependencies from the repository root:

```bash
npm install
```

---

# Database Setup

PixelBuddy uses PostgreSQL with Drizzle ORM.

Configure your PostgreSQL connection in:

```text
apps/server/.env
```

Then apply the schema:

```bash
npm run db:push
```

---

# Development

Start all applications:

```bash
npm run dev
```

By default:

```text
Web
http://localhost:3001

API
http://localhost:3000
```

The native application runs through Expo.

Because PixelBuddy uses native Apple Health functionality, some development workflows require a native development build rather than Expo Go.

---

# Run Individual Applications

Web:

```bash
npm run dev:web
```

Backend:

```bash
npm run dev:server
```

React Native:

```bash
npm run dev:native
```

---

# Shared UI

React web applications share shadcn/ui primitives through:

```text
packages/ui
```

Design tokens and global styles:

```text
packages/ui/src/styles/globals.css
```

Shared components:

```text
packages/ui/src/components/*
```

shadcn configuration:

```text
packages/ui/components.json
apps/web/components.json
```

## Adding Shared Components

Run from the project root:

```bash
npx shadcn@latest add accordion dialog popover sheet table -c packages/ui
```

Then import shared components:

```tsx
import { Button } from "@PixelBuddy/ui/components/button";
```

For app-specific blocks, run the shadcn CLI from:

```text
apps/web
```

---

# Database Commands

Push the current schema:

```bash
npm run db:push
```

Generate database artifacts:

```bash
npm run db:generate
```

Run migrations:

```bash
npm run db:migrate
```

Open the database studio:

```bash
npm run db:studio
```

---

# Code Quality

Check TypeScript across the workspace:

```bash
npm run check-types
```

Biome linting and formatting:

```bash
npm run check
```

---

# Docker

Build containers:

```bash
npm run docker:build
```

Start the stack:

```bash
npm run docker:up
```

View logs:

```bash
npm run docker:logs
```

Stop the stack:

```bash
npm run docker:down
```

Application Dockerfiles live under:

```text
apps/*/Dockerfile
```

Environment variables are read from each application's `.env` file and can be overridden through `docker-compose.yml`.

For additional Better-T-Stack deployment information, see the [Docker Compose guide](https://www.better-t-stack.dev/docs/guides/docker).

---

# Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start all applications in development mode |
| `npm run build` | Build the complete monorepo |
| `npm run dev:web` | Start the Next.js application |
| `npm run dev:server` | Start the Fastify backend |
| `npm run dev:native` | Start the React Native / Expo application |
| `npm run check-types` | Run TypeScript checks |
| `npm run check` | Run Biome formatting and linting |
| `npm run db:push` | Push database schema changes |
| `npm run db:generate` | Generate database artifacts |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open the database studio |
| `npm run docker:build` | Build Docker images |
| `npm run docker:up` | Start Docker Compose |
| `npm run docker:logs` | Tail Docker logs |
| `npm run docker:down` | Stop Docker Compose |

---

# Roadmap

The roadmap is intentionally incremental.

## Phase 1 — Activity → World

- [x] React Native / Expo application
- [x] Apple Health integration
- [x] Health / activity data access
- [ ] Pixel sprite
- [ ] Small Skia-rendered world
- [ ] Walking / idle animation
- [ ] Convert walking distance into journey progress
- [ ] Location discovery

## Phase 2 — Game Loop

- [ ] XP and levels
- [ ] basic collectibles
- [ ] loot tables
- [ ] discovery events
- [ ] activity recap
- [ ] persistent world state
- [ ] "While you were away" sequence

## Phase 3 — Living World

- [ ] day / night rendering
- [ ] weather
- [ ] particles
- [ ] world construction
- [ ] character customization
- [ ] NPC behavior
- [ ] encounters

## Phase 4 — Experiments

- [ ] procedural journeys
- [ ] seeded world generation
- [ ] workout replays
- [ ] game AI experiments
- [ ] state machines / behavior trees
- [ ] shader experiments
- [ ] optional ECS exploration
- [ ] Apple Watch companion experience

---

# Why Build This?

PixelBuddy is partly a product experiment and partly a software-engineering playground.

It provides an excuse to explore technologies and concepts that do not normally appear together in a conventional React application:

```text
React Native
+
native Apple APIs
+
health telemetry
+
Skia rendering
+
animation
+
game loops
+
simulation
+
probability
+
procedural generation
+
state machines
+
backend architecture
```

The goal is not to prove that React Native should replace a traditional game engine.

The goal is to explore how far a modern React Native application can go when it stops behaving like a collection of screens and starts behaving more like a small interactive simulation.

---

# Design Rule

PixelBuddy has one simple rule for deciding what belongs in the project:

> **Does this make the world react to me?**

If yes, it may belong.

If it is simply another way to display health statistics, it probably does not.

---

# Status

PixelBuddy is currently under active development.

The health-data foundation is already being connected to the first version of the game world and rendering systems.

The immediate goal is intentionally small:

```text
Apple Watch activity
        ↓
Pixel walks
        ↓
Pixel reaches somewhere new
```

Everything else can grow from there.