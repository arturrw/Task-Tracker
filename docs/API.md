# API Reference

Task Tracker is mostly a server-rendered app, so most "endpoints" return full HTML pages rather than JSON. This document lists both: the one JSON API route, and the web routes for reference.

All routes are relative to the server origin, e.g. `http://localhost:3000`.

## Authentication

Every route below except `/login`, `/register` and their `GET` counterparts requires an active session (a `connect.sid` cookie set after a successful login). Unauthenticated requests to protected routes are redirected to `/login` (page routes) or receive a JSON error (API routes).

---

## JSON API

### `GET /api/weather`

Returns current weather for the logged-in user's profile city, using the OpenWeather API key configured in `.env`.

**Auth required:** yes

**Success response** — `200 OK`

```json
{
  "ok": true,
  "weather": {
    "city": "Almaty",
    "temperature": 21,
    "feelsLike": 20,
    "description": "clear sky"
  }
}
```

**Error responses** — always `200 OK` with `ok: false` (except the 500 case), so the client can render a message without treating it as a network failure:

| `reason` | Meaning |
|---|---|
| `no_city` | The user has not set a city on their profile yet |
| `api_error` | OpenWeather request failed (bad key, city not found, network issue) |

```json
{ "ok": false, "reason": "no_city", "message": "City is not set in profile." }
```

A genuine server error (e.g. database unreachable) returns `500`:

```json
{ "ok": false, "reason": "server_error", "message": "Server error." }
```

---

## Web routes

These render EJS views or redirect; listed here for completeness when navigating the codebase.

### Auth — `routes/auth.js`

| Method | Path | Description |
|---|---|---|
| GET | `/login` | Login form |
| POST | `/login` | Authenticate, start session |
| GET | `/register` | Registration form |
| POST | `/register` | Create account, start session |
| GET | `/logout` | Destroy session |

### Dashboard — `routes/dashboard.js`

| Method | Path | Description |
|---|---|---|
| GET | `/dashboard` | Task stats + weather widget |

### Tasks — `routes/task.js` (all require login)

| Method | Path | Description |
|---|---|---|
| GET | `/tasks` | List tasks, supports `?status=` and `?priority=` filters |
| GET | `/tasks/create` | New task form |
| POST | `/tasks/create` | Create a task |
| GET | `/tasks/:id/edit` | Edit task form |
| POST | `/tasks/:id/edit` | Update a task |
| POST | `/tasks/:id/delete` | Delete a task |
| POST | `/tasks/:id/toggle-status` | Flip between `active` and `completed` |

### Profile — `routes/profile.js`

| Method | Path | Description |
|---|---|---|
| GET | `/profile` | View profile |
| POST | `/profile` | Update name/city |

---

## Task object shape

Used by task routes and returned from `models/taskModel.js`:

```ts
{
  id: number,
  user_id: number,
  title: string,
  description: string | null,
  status: 'active' | 'completed',
  priority: 'low' | 'medium' | 'high',
  category: string | null,
  deadline: string | null,   // DATETIME
  created_at: string,
  updated_at: string | null
}
```
