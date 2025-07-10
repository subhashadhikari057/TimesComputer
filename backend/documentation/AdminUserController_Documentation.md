# 👤 AdminUserController Module Documentation

This module handles all admin user management actions in the Times Computer backend system. It is accessible only by users with the `SUPERADMIN` role.

---

## 📦 API Endpoints

### 1. `GET /admin/users`
- **Purpose:** List all admin users
- **Access:** SUPERADMIN only
- **Response:**
```json
[
  {
    "id": "uuid",
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2025-07-10T08:00:00Z"
  }
]
```

### 2. `GET /admin/users/:id`
- **Purpose:** Get a single admin user by ID
- **Access:** SUPERADMIN only
- **Response:**
```json
{
  "id": "uuid",
  "name": "Admin Name",
  "email": "admin@example.com",
  "role": "ADMIN",
  "isActive": true,
  "createdAt": "2025-07-10T08:00:00Z"
}
```

### 3. `POST /admin/users`
- **Purpose:** Create a new admin user
- **Access:** SUPERADMIN only
- **Body:**
```json
{
  "name": "New Admin",
  "email": "new@admin.com",
  "password": "SecurePassword123",
  "role": "ADMIN"
}
```
- **Validations:**
  - Name is required
  - Email must be valid and unique
  - Password must be ≥ 6 characters
  - Role must be ADMIN or SUPERADMIN

### 4. `PATCH /admin/users/:id`
- **Purpose:** Update name, role, or active status of an admin
- **Access:** SUPERADMIN only
- **Body:** (any subset of the following)
```json
{
  "name": "Updated Name",
  "role": "SUPERADMIN",
  "isActive": false
}
```
- **Notes:**
  - Prevent disabling the last SUPERADMIN
  - Prevent self-demotion

### 5. `DELETE /admin/users/:id`
- **Purpose:** Delete (or soft delete) an admin
- **Access:** SUPERADMIN only
- **Response:**
```json
{ "message": "Admin user deleted" }
```

### 6. `PATCH /admin/users/:id/password`
- **Purpose:** Securely reset admin password
- **Access:** SUPERADMIN only
- **Body:**
```json
{
  "newPassword": "NewSecure123",
  "confirmPassword": "NewSecure123"
}
```

---

## 📜 Zod Validation Schemas

### CreateAdminUserSchema
```ts
z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "SUPERADMIN"])
})
```

### UpdateAdminUserSchema
```ts
z.object({
  name: z.string().min(1).optional(),
  role: z.enum(["ADMIN", "SUPERADMIN"]).optional(),
  isActive: z.boolean().optional()
}).strict()
```

### ResetPasswordSchema
```ts
z.object({
  newPassword: z.string().min(6),
  confirmPassword: z.string().min(6)
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
})
```

---

## 📝 Audit Logging

Each action (create, update, delete, password reset) triggers an audit log with:
- `actorId` (who performed it)
- `targetId` (who was affected)
- `action` like `"CREATE_ADMIN"`, `"RESET_PASSWORD"`
- `message`, `ip`, `userAgent`
- Stored in `AuditLog` table (Prisma)

---

## 📁 Related Files

- `src/controllers/adminUser.controller.ts`
- `src/services/adminUser.service.ts`
- `src/routes/adminUser.route.ts`
- `src/validations/adminUser.schema.ts`
- `src/services/auditLog.service.ts`
- `src/middlewares/checkRole.ts`

---

## ✅ Security Rules

- All routes are protected with JWT + checkRole("SUPERADMIN")
- Passwords hashed with bcrypt
- Audit logs tracked automatically
- Prevent self-deletion, self-demotion, or full loss of superadmin
- Rate limiter and auth guard enabled on password reset route

---

## ✅ Testing Checklist

- [x] All APIs tested in Postman
- [x] Role protection verified
- [x] Audit logs generated per action
- [x] Can’t delete or demote last SUPERADMIN
- [x] Password reset route is rate-limited and secure

---

## 🧾 Author / Owner
Feature contributed by team via branch `user_module`