# Email verification backend (Express + MongoDB)

Checks an email + password against your EXISTING main database. This server
does not create or own any user data — it only reads from the `users`
collection (or whatever you rename it to) in the database you point it at.

## Setup
```
npm install
cp .env.example .env
```
Edit `.env`:
- `MAIN_DB_URI` — connection string of your real/main MongoDB database.
- `CLIENT_ORIGIN` — the URL(s) of your React app, comma-separated.

Edit `models/User.js` if your main DB's field names differ (e.g. the
password field is called `passwordHash` instead of `password`).

## Run
```
npm run dev
```

## Endpoints

### POST /api/check-email
Body: `{ "email": "user@example.com" }`
- 200 `{ exists: true, email, name }` if the email exists
- 404 if it doesn't
- 400 if the email is badly formatted

Use this after your "Choose an account" step, before showing the password
page — or skip it and just use /api/verify-login directly.

### POST /api/verify-login
Body: `{ "email": "user@example.com", "password": "..." }`
- 200 `{ verified: true, email }` if the password matches
- 401 `{ message: "Incorrect email or password." }` otherwise (same message
  whether the email doesn't exist or the password is wrong, so the endpoint
  can't be used to find out which emails are registered)
- Rate-limited to 20 attempts per 10 minutes per IP

## Security notes
- This assumes your main DB stores passwords as **bcrypt hashes**. The code
  checks for a bcrypt prefix (`$2a$`, `$2b$`, `$2y$`) and uses
  `bcrypt.compare`. If your main DB still stores plain-text passwords, it
  falls back to a direct string comparison — you should migrate those to
  bcrypt hashes as soon as you can; plain-text passwords are a serious risk
  if the database is ever exposed.
- Never log or return the password or its hash.
- Put this server behind HTTPS in production so the password isn't sent in
  plain text over the network.
- Consider adding a CAPTCHA or account lockout after repeated failures on
  top of the rate limiter.
