# 🔐 TimesComputer Authentication Security Architecture v2.0

## 1. 🔍 Purpose
This document provides a **comprehensive breakdown** of the authentication and security mechanisms used in the TimesComputer backend. It ensures **robust protection** against common vulnerabilities such as XSS, CSRF, brute-force attacks, and token misuse using **cookie-based JWT strategy**.

---

## 2. 🧱 Core Architecture Overview
The authentication module integrates **Express.js** with **PostgreSQL (via Prisma)** and **JWT-based stateless authentication**, adopting the following key strategies:
- Secure session management using **HttpOnly, SameSite=Strict cookies**
- **Token rotation** using refresh tokens
- Account lockout on repeated failed login attempts
- Modular middlewares and schema validations using `zod`

---

## 3. 🧰 Core Security Stack

| Feature                  | Library/Mechanism          | Purpose |
|--------------------------|----------------------------|---------|
| Input Validation         | `zod`                      | Prevent malformed or malicious input |
| Password Hashing         | `bcryptjs`                 | Secure user credential storage |
| JWT Auth (Dual Token)    | `jsonwebtoken`             | Stateless session with access/refresh tokens |
| Cookie Handling          | `cookie-parser`            | Secure transport of auth tokens |
| HTTP Headers             | `helmet`                   | Prevent common web vulnerabilities |
| Cross-Origin Requests    | `cors` with credentials    | Restrict origins and send cookies |
| Rate Limiting            | `express-rate-limit`       | Throttle brute-force attempts |
| CSRF Protection          | `csurf` (optional)         | Enforce token-based CSRF defense |
| Login Logging            | Prisma `LoginLog` model    | Audit trail for login attempts |
| Role-based Middleware    | Custom                     | Route-level permission enforcement |

---

## 4. 🔐 Token Management

| Token Type     | Stored In              | Expiry     | Purpose                            |
|----------------|------------------------|------------|------------------------------------|
| Access Token   | Cookie `token`         | 15 minutes | Auth for protected routes          |
| Refresh Token  | Cookie `refreshToken`  | 7 days     | Generate new access token          |

- **Rotation**: Refresh token is replaced upon `/auth/refresh`
- **Storage**: Cookies are set with `HttpOnly`, `Secure`, `SameSite=Strict`

---

## 5. 🔁 Token Rotation Strategy
### On `/auth/refresh`:
- 🔄 New refresh token is generated and set in cookie
- 🔑 New access token is issued immediately
- 🚫 Old refresh token is invalidated (by regenerating the hash/token)

---

## 6. 🔒 Account Lockout Logic
To prevent brute-force attacks:
- 5 failed login attempts per email or IP within 15 minutes leads to **temporary lock**
- Affected users must wait 15 minutes before retrying

> Logged inside `LoginLog` with IP, user-agent, and result.

---

## 7. ✅ Implemented Auth Routes

### Base Url: http://localhost:8080/api/auth

POST /auth/register
Registers a new superadmin user, but only if no admin currently exists.
▸ Middleware: authLimiter
▸ Validation: RegisterSchema

POST /auth/login
Authenticates the user using email and password. On success, it sets the access and refresh tokens as cookies.
▸ Middleware: authLimiter
▸ Validation: LoginSchema

POST /auth/logout
Logs out the user by clearing the authentication cookies.
▸ Middleware: None
▸ Validation: None

POST /auth/refresh
Issues a new access token by validating the refresh token stored in cookies. Also rotates the refresh token.
▸ Middleware: None
▸ Validation: None

PATCH /auth/change-password
Allows a logged-in user to change their password by verifying the old one.
▸ Middleware: authenticate
▸ Validation: ChangePasswordSchema



## 8. 🧩 Middlewares

### 🔧 Global Middlewares (in `app.ts`)
- `helmet()` – HTTP security headers
- `cors({ credentials: true })` – Enable cross-origin access with cookies
- `cookieParser()` – Parse and sign cookies
- `express.json()` – Parse JSON bodies
- `express.urlencoded()` – Parse form-encoded data

### 🔐 Custom Middlewares (in `/middlewares`)
| Name          | Purpose                                |
|---------------|----------------------------------------|
| `authenticate`| Verifies JWT from cookies              |
| `isAdmin`     | Allows only users with ADMIN/SUPERADMIN|
| `isSuperadmin`| Allows only SUPERADMIN                 |
| `authLimiter` | Rate limits login/register attempts    |

---

## 9. 🧪 Validation Schemas (`auth.schema.ts`)

- `LoginSchema`: `{ email, password }`
- `RegisterSchema`: `{ name, email, password }`
- `ChangePasswordSchema`: `{ oldPassword, newPassword, confirmPassword }`

> All schemas use **Zod** for strict, runtime-validated data checking.

---

## 10. 🧬 Prisma Models

```prisma
model AdminUser {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(ADMIN)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
}

model LoginLog {
  id        String   @id @default(uuid())
  email     String
  ip        String
  userAgent String
  success   Boolean
  createdAt DateTime @default(now())
}
```

## 11. 🌍 Environment Variables (.env)
PORT=8080
DATABASE_URL=postgresql://...
JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
COOKIE_SECURE=false

## 12. ⚙️ Development Notes
CSRF protection is temporarily disabled for backend-only testing. In production, use GET /csrf-token to fetch CSRF token and include it in stateful POST requests.

Cookies are always set with HttpOnly, Secure, and SameSite=Strict.

Login attempts are tracked and rate-limited to prevent abuse.

Account locking ensures enhanced security against brute-force attacks.

## 13. 🛡 Summary Table
Security Feature	
JWT Signing	
Password Hashing (bcrypt)	
Rate Limiting	
Secure Cookies	
Helmet Headers	
CORS with Credentials	
CSRF Token (configurable)	
Login Logging	
Role-Based Middleware	
Token Rotation	
XSS/Injection Prevention	

📌 Final Notes
This authentication system forms the foundation for all admin and user-based access within TimesComputer. Future additions (like OAuth, 2FA, session management, etc.) should build on this architecture without compromising stateless principles and security constraints.



