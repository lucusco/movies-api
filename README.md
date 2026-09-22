# Study Project: Social Movies/TV Shows Platform

## Overview

A "movie/TV diary" style platform with a social layer: users search titles via TMDb, rate them, build lists, follow other users with good taste, and keep up with their activity. 

---

## Modules

### `auth/`
Handles authentication and authorization.
- Sign up/login (email + password, hashed with bcrypt)
- JWT (access + refresh token)
- Custom guards and decorators (`@CurrentUser()`, `RolesGuard` if applicable)
- (Future) Social OAuth (Google/GitHub) via Passport

### `users/`
User CRUD and public profile.
- Create/edit profile (name, avatar, bio)
- Fetch another user's public profile (public reviews, public lists, followers/following count)
- Personal stats endpoint (most-watched genres, average rating given — via aggregation pipeline)

### `media/`
Integration layer with TMDb + local cache.
- Isolated HTTP client (`TmdbService`) wrapping `HttpModule`/Axios, Bearer token authentication
- Title search (proxy to TMDb, not persisted to Mongo yet)
- Once the user interacts (favorites, rates, adds to a list) → persisted in `Media` as cache
- Revalidation strategy: if `lastSyncedAt` is stale (e.g. >7 days), refetch from TMDb before serving
- Trending/popular endpoint (mirrors TMDb's trending, cached)

### `reviews/`
Movie/TV show ratings.
- Create/edit/delete a review (1-10 rating, comment, spoiler flag)
- List reviews for a title, list reviews by a user
- Rule: a user can only have one active review per title (unique index `userId + mediaId`)

### `lists/`
Custom lists and watchlist.
- Create a list (title, description, public/private)
- Add/remove items, reorder
- Watchlist as a special case of a list (status: want to watch / watching / watched)

### `follows/`
Social follower graph.
- Follow/unfollow a user
- List followers / following (paginated)
- Followers/following count on the profile
- Own collection (`Follow`) with a composite unique index `(followerId, followingId)` — do not embed arrays in `User`

### `feed/`
Activity aggregation from people the user follows.
- Feed generated on-the-fly via an aggregation pipeline (`Follow` + recent `Review`/`List`)
- E.g. "John rated X with a 9", "Jane added 3 movies to the 'Y' list"
- (Future, more advanced) Precomputed feed with fan-out instead of generated per request

### `notifications/` (future)
- Transactional email (Resend/SendGrid) when: someone follows the user, a watchlist title has news
- Optional Slack/Discord webhook (more for learning purposes than real use)

### `chat/` (future — phase 2)
- Not implemented yet, but entities are already thought through to avoid a migration later
- `Conversation` and `Message` as separate collections
- When implemented: WebSockets via `@nestjs/websockets` (Socket.IO), not polling

---

## Core entities (Mongoose)

| Entity | Key fields | Notes |
|---|---|---|
| `User` | name, email, passwordHash, avatarUrl, createdAt |
| `Media` | tmdbId, type, title, overview, posterPath, releaseDate, genres[], voteAverage, lastSyncedAt | Local cache of TMDb data |
| `Review` | userId, mediaId, rating, comment, spoiler, createdAt | Unique index `userId + mediaId` |
| `List` | userId, title, description, isPublic, items[] | `items` = `{ mediaId, note, order }` |
| `Follow` | followerId, followingId, createdAt | Composite unique index |
| `Conversation` (future) | participants[], createdAt | — |
| `Message` (future) | conversationId, senderId, content, createdAt | — |

---

## Cron jobs

1. **Daily metadata sync** — revalidates `Media` entries with a stale `lastSyncedAt` against TMDb (rating, poster, status can change). Good place to practice concurrency/rate-limit control with a queue.
2. **Weekly new-content detection** — checks watchlist titles for newly announced seasons/sequels; triggers a notification.
3. **Weekly trending snapshot** — stores your own history of what was trending each week (your own data for future analytics).

---