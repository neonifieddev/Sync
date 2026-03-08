---
title: Tween
slug: /tween
---

`Tween` is a small tween helper that builds and controls one or more Roblox tweens from a single data table.

## What it adds

- A single `TweenData` object to describe what to tween
- A `completed` signal that fires when **all** internal tweens finish
- Model-only extended properties:
  - **`Scale`** (applies via `Model:ScaleTo(...)`)
  - **`Pivot`** (applies via `Model:PivotTo(...)`)

Next: see the Tween API page at `/tween/api`.

