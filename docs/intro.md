---
sidebar_position: 1
title: Sync
slug: /
---

`Sync` is a small networking helper that pairs a `RemoteEvent` and a `RemoteFunction` per endpoint name, with:

- **Rate limiting** (Throttle or Burst)
- **Payload byte limiting** (fast estimate; oversized sends are dropped)
- **One shared remote folder**: everything lives under `ReplicatedStorage.Remotes`

## Single shared remote container (important)

You only need **one copy of the Sync module** that both server and client `require()`.

- **Server** creates (if missing): `ReplicatedStorage.Remotes`
- **Client** waits for: `ReplicatedStorage.Remotes`

Every call to `Sync:Create("Some.Name")` uses that same folder, so you don’t need separate “server remotes” vs “client remotes”.

## Minimal example

Create an endpoint (do this in shared code so both server + client agree on names):

```lua
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Sync = require(ReplicatedStorage.Packages.Sync)

local Ping = Sync:Create("Test.Ping")
	:SetRateLimit(2)
	:SetByteLimit(64)
	:SetMode(Sync.Modes.Burst)

return Ping
```

Server:

```lua
local Ping = require(ReplicatedStorage.Shared.Ping)

Ping:OnEvent(function(player, message)
	print("Ping from", player.Name, message)
end)
```

Client:

```lua
local Ping = require(ReplicatedStorage.Shared.Ping)

Ping:FireServer("hello")
```

