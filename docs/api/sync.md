---
title: Sync
slug: /api/Sync
---

Basic networking module for creating and handling static `RemoteEvent`s and `RemoteFunction`s (paired per endpoint name), with **rate limiting** and **payload byte limiting**.

## One shared “Remotes” module (important)

You typically want **one shared module that defines all endpoints** and is `require()`’d by both server and client.

That shared module returns a table of endpoints:

```lua
-- ReplicatedStorage/Shared/Remotes.luau
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Sync = require(ReplicatedStorage.Packages.Sync)

return {
	Test = Sync:Create("Test"),
	Ping = Sync:Create("Hello.Ping"):SetByteLimit(64),
}
```

Client usage:

```lua
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Remotes = require(ReplicatedStorage.Shared.Remotes)

Remotes.Ping:OnEvent(function(...)
	print("Got", ...)
end)

Remotes.Ping:FireServer("hello")
```

Server usage:

```lua
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Remotes = require(ReplicatedStorage.Shared.Remotes)

Remotes.Ping:OnEvent(function(player, ...)
	print("From", player.Name, ...)
end)

Remotes.Ping:FireClient(player, "hi")
```

## Quick example (examples only)

```lua
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Sync = require(ReplicatedStorage.Packages.Sync)

local PointsChanged = Sync:Create("PointsChanged")
	:SetRateLimit(10)
	:SetByteLimit(1024)
	:SetMode(Sync.Modes.Burst)
```

Client:

```lua
PointsChanged:OnEvent(function(points)
	print("Points", points)
end)
```

Server:

```lua
PointsChanged:FireAllClients(10)
```

---

## Functions

### `Create`

`Sync:Create(name: string) -> Sync`

Creates (or returns) a Sync endpoint.

- On the **server**, creates the underlying `RemoteEvent`/`RemoteFunction` if missing.
- On the **client**, waits up to 10 seconds for the endpoint to exist.
- If a Sync with the same name already exists, warns and returns the existing one.

```lua
local sync = Sync:Create("Test.Ping")
```

### `Init`

`Sync:Init() -> ()`

One-time module initializer:

- On server: calls `Sync:InitServer()`
- On client: calls `Sync:InitClient()`

> `Sync:Create()` calls this automatically.

### `InitServer`

**Server**

`Sync:InitServer() -> ()`

One-time server initializer (safe to call multiple times).

### `InitClient`

**Client**

`Sync:InitClient() -> ()`

One-time client initializer (safe to call multiple times).

---

## Types / Modes

### `Modes`

```lua
Sync.Modes = {
	Throttle = "Throttle",
	Burst = "Burst",
}
```

- **Throttle**: enforces a minimum interval between calls (`1 / rateLimit` seconds).
- **Burst**: allows up to `rateLimit` calls per second (simple per-second bucket).

---

## Instance Methods

### `OnEvent`

`sync:OnEvent(callback: (...any) -> ()) -> { Disconnect: () -> () }?`

Connects a handler to the endpoint’s `RemoteEvent`.

- On the **client**, the callback receives only the payload you sent.
- On the **server**, the callback receives `(player, ...payload)` (Roblox prepends the sender).

```lua
-- Client
sync:OnEvent(function(...)
	print("Got", ...)
end)

-- Server
sync:OnEvent(function(player, ...)
	print("From", player.Name, ...)
end)
```

### `OnInvoke`

`sync:OnInvoke(callback: (...any) -> ...any) -> { Disconnect: () -> () }?`

Sets the invocation handler for the endpoint’s `RemoteFunction`.

```lua
-- Server
sync:OnInvoke(function(player, request)
	return { ok = true }
end)
```

### `FireServer`

**Client**

`sync:FireServer(...any) -> ()`

Fires client → server (drops if rate-limited or byte-limited).

```lua
sync:FireServer("hello")
```

### `InvokeServer`

**Client**

`sync:InvokeServer(...any) -> ...any`

Invokes client → server (drops if rate-limited or byte-limited).

```lua
local result = sync:InvokeServer("GetData")
```

### `FireAllClients`

**Server**

`sync:FireAllClients(...any) -> ()`

Fires to all players (per-player rate limiting; drops oversize payloads).

```lua
sync:FireAllClients("announcement")
```

### `FireClient`

**Server**

`sync:FireClient(player: Player, ...any) -> ()`

Fires to one player (drops if rate-limited/byte-limited).

```lua
sync:FireClient(player, "hello")
```

### `FireAllClientsExcept`

**Server**

`sync:FireAllClientsExcept(players: { Player }, ...any) -> ()`

Fires to all players except the given list.

```lua
sync:FireAllClientsExcept({playerA, playerB}, "everyone else")
```

### `InvokeClient`

**Server**

`sync:InvokeClient(player: Player, ...any) -> ...any`

Invokes a client via `RemoteFunction:InvokeClient` (drops if rate-limited/byte-limited).

```lua
local ok = sync:InvokeClient(player, "Ping")
```

### `Destroy`

`sync:Destroy() -> ()`

Destroys server-created remotes (server) and cleans connections/tasks (all realms).

---

## Configuration

### `SetRateLimit`

`sync:SetRateLimit(perSecondLimit: number) -> Sync`

```lua
sync:SetRateLimit(15)
```

### `SetMode`

`sync:SetMode(mode: string) -> Sync`

```lua
sync:SetMode(Sync.Modes.Burst)
```

### `SetByteLimit`

`sync:SetByteLimit(byteLimit: number) -> Sync`

```lua
sync:SetByteLimit(1024)
```

