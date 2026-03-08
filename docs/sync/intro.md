---
title: Sync
slug: /sync
---

`Sync` is a networking helper built around RemoteEvents/RemoteFunctions, with:

- **Rate limiting** (Throttle or Burst)
- **Payload byte limiting** (fast estimate; oversized sends are dropped)

## Recommended pattern: one shared `Remotes` module

Define all endpoints in **one shared module** (endpoint registry) that both server and client `require()`.

```luau
-- ReplicatedStorage/Shared/Remotes.luau
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Sync = require(ReplicatedStorage.Packages.Sync)

return {
	Test = Sync:Create("Test"),
	Ping = Sync:Create("Hello.Ping"):SetByteLimit(64),
}
```

Client:

```luau
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Remotes = require(ReplicatedStorage.Shared.Remotes)

Remotes.Ping:OnEvent(function(...)
	print("Got", ...)
end)

Remotes.Ping:FireServer("hello")
```

Server:

```luau
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Remotes = require(ReplicatedStorage.Shared.Remotes)

Remotes.Ping:OnEvent(function(player, message)
	print("Ping from", player.Name, message)
end)
```

Next: see the Sync API page at `/sync/api`.

