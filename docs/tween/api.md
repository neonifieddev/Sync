---
title: API
slug: /tween/api
---

Utility module for creating and controlling tweens, including support for **Model-only** extended properties:

- **`Scale`** (applies via `Model:ScaleTo(...)`)
- **`Pivot`** (applies via `Model:PivotTo(...)`)

---

## Types

### `TweenData`

```luau
export type TweenData = {
	instance: Instance | Model | GuiObject,
	properties: { [string]: any },
	time: number,
	easingStyle: Enum.EasingStyle,
	easingDirection: Enum.EasingDirection,
}
```

- **instance**: the object you want to tween (e.g. `GuiObject`, `Model`, etc.).
- **properties**: a dictionary of properties to tween. Supports both normal tweenable properties and the extended properties listed below.
- **time / easingStyle / easingDirection**: passed into `TweenInfo.new(...)`.

---

## Extended properties (Model-only)

These are special keys inside `TweenData.properties`:

- **`Scale`**: tweens a temporary `NumberValue` and applies it with `Model:ScaleTo(value)` every time it changes.
- **`Pivot`**: tweens a temporary `CFrameValue` and applies it with `Model:PivotTo(cframe)` every time it changes.

If `instance` is not a `Model`, don’t use these keys.

---

## Functions

### `New`

`Tween.New(tweenData: TweenData) -> Tween`

Creates a tween controller instance and constructs one or more internal tweens from `tweenData.properties`.

### `CreateAndPlay`

`Tween.CreateAndPlay(tweenData: TweenData) -> Tween`

Convenience constructor that calls `New(...)`, then immediately calls `:Play()`.

---

## Signals

### `completed`

`tween.completed: Signal`

Fires when **all** internal tweens have completed.

> After completion, the tween controller cleans up its connections/temporary instances.

---

## Instance Methods

### `Play`

`tween:Play() -> ()`

Plays all internal tweens. When every tween completes, `tween.completed` fires.

### `Pause`

`tween:Pause() -> ()`

Pauses all internal tweens.

### `Resume`

`tween:Resume() -> ()`

Resumes all internal tweens.

### `Cancel`

`tween:Cancel() -> ()`

Cancels all internal tweens.

### `Restart`

`tween:Restart() -> ()`

Cancels, then plays again.

### `Destroy`

`tween:Destroy() -> ()`

Destroys the tween controller and cleans up any Trove resources.

---

## Examples

### Tween a GUI position

```luau
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Tween = require(ReplicatedStorage.Packages.Tween)

local tween = Tween.CreateAndPlay({
	instance = script.Parent.Frame,
	properties = {
		Position = UDim2.fromScale(0.5, 0.5),
	},
	time = 0.35,
	easingStyle = Enum.EasingStyle.Quad,
	easingDirection = Enum.EasingDirection.Out,
})

tween.completed:Connect(function()
	print("GUI tween finished")
end)
```

### Tween a Model pivot + scale

```luau
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Tween = require(ReplicatedStorage.Packages.Tween)

local model = workspace:WaitForChild("Crate")

Tween.CreateAndPlay({
	instance = model,
	properties = {
		Pivot = CFrame.new(0, 10, 0),
		Scale = 1.25,
	},
	time = 0.6,
	easingStyle = Enum.EasingStyle.Sine,
	easingDirection = Enum.EasingDirection.InOut,
})
```

