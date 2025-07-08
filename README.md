
# 🖥️ Times Computer 

**TimesComputer** is a lightweight, fast, and locally hosted e-commerce system designed specifically for showcasing and selling laptops. Instead of using a traditional checkout system, it enables users to send direct WhatsApp messages with pre-filled order details — allowing fast, human-driven conversions.

## 🌐 Live Stack

- **Frontend**: Next.js 15 (App Router), React 18, Tailwind CSS
- **Backend**: Express.js, Prisma ORM, PostgreSQL
- **Storage**: Local VPS storage for image and brochure uploads (`/uploads`)
- **Messaging**: WhatsApp Redirection (no payment gateway)

## 🧩 Core Features

- Laptop product listing with filters (brand, RAM, SSD, etc.)
- "Buy Now" modal generates WhatsApp prefilled link
- Admin panel for adding/editing/deleting products
- Upload product images and optional brochure (PDF)
- All assets served locally from VPS
- Fully responsive, mobile-first UI

## 🛠️ Local Development Setup

### 1. Clone the repository:
```bash
git clone https://github.com/your-org/times-computer.git
cd times-computer/backend
```

### 2. Create `.env` file:
```env
DATABASE_URL=postgresql://neondb_owner:<password>@<neon-host>/<dbname>?sslmode=require
PORT=8080
```

### 3. Install dependencies:
```bash
npm install
```

### 4. Generate Prisma client:
```bash
npx prisma generate
```

### 5. Start the backend server:
```bash
npm run dev
```

## 🔗 Database Info

This project uses **Neon.tech** for PostgreSQL hosting. The schema is managed via **Prisma**, and the latest structure is already deployed. If you need to sync your schema locally:

```bash
npx prisma db pull
```
