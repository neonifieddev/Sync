---
sidebar_position: 1
title: Neo's Utils
slug: /
---

This site documents **Neo's Utils** — a small collection of Roblox utilities.

## Modules

- **Sync**: a networking helper built around RemoteEvents/RemoteFunctions, with rate + payload byte limiting.
- **Tween**: a tween helper with extended support for Model `ScaleTo` and `PivotTo`.

## Sync (quick overview)

`Sync` pairs a `RemoteEvent` and a `RemoteFunction` per endpoint name, with:

- **Rate limiting** (Throttle or Burst)
- **Payload byte limiting** (fast estimate; oversized sends are dropped)
- **One shared Remotes module**: define endpoints once and require them from both server and client

## One shared “Remotes” module (important)

Define all endpoints in **one shared module** (endpoint registry) that both server and client `require()`.

Example:

```lua
-- ReplicatedStorage/Shared/Remotes.luau
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Sync = require(ReplicatedStorage.Packages.Sync)

return {
	Test = Sync:Create("Test"),
	Ping = Sync:Create("Hello.Ping"):SetByteLimit(64),
}
```

## Minimal example

Client:

```lua
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Remotes = require(ReplicatedStorage.Shared.Remotes)

Remotes.Ping:OnEvent(function(...)
	print("Ping reply", ...)
end)

Remotes.Ping:FireServer("hello")
```

Server:

```lua
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Remotes = require(ReplicatedStorage.Shared.Remotes)

Remotes.Ping:OnEvent(function(player, message)
	print("Ping from", player.Name, message)
end)
```

