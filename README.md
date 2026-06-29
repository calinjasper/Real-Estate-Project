# Real Estate Listing Platform

A full-stack real estate listing platform similar to 99acres, built with modern technologies.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, TanStack React Query, Zustand, React Hook Form
- **Backend**: Node.js, Express.js, Prisma ORM
- **Database**: PostgreSQL
- **API Documentation**: Swagger/OpenAPI

## Features

### Authentication
- User registration and login
- JWT-based authentication with refresh tokens
- Protected routes and APIs

### Property Management
- Create, read, update, delete properties
- Upload property images
- View all properties with pagination

### Search & Filtering
- Search properties by city
- Filter by price range, property type, bedrooms
- Sort properties
- Efficient querying with database indexes (supports 50,000+ properties)

### Recommendations
- Similar properties based on city, type, and price range

### Inquiry System
- Contact property owners
- Prevent duplicate inquiries
- Spam protection

### SEO
- Server-side rendering for property pages
- Meta tags for search engines

### API Documentation
- Swagger UI at `/api-docs`

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/realestate?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-token-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
```

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Run Prisma migrations:
```bash
npx prisma migrate dev --name init
```

6. Seed the database with 50,000+ properties:
```bash
npm run db:seed
```

7. Start the backend server:
```bash
npm run dev
```

The backend will be available at `http://localhost:5000` and the Swagger docs at `http://localhost:5000/api-docs`.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## Project Structure

```
Real Estate Project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── constants/
│   │   ├── database/
│   │   ├── swagger/
│   │   ├── app.js
│   │   └── server.js
│   ├── prisma/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
├── uploads/
└── README.md
```

## Architecture

The project follows a clean architecture with:
- Controllers: Handle HTTP requests
- Services: Business logic
- Repositories: Data access layer (Prisma)
- Middlewares: Authentication, validation, error handling
- Validators: Request validation using express-validator

## Database Design

### Users Table
- id
- name
- email (unique)
- password
- phone
- created_at
- updated_at

### Properties Table
- id
- title
- description
- price
- city
- state
- country
- address
- property_type
- bedrooms
- bathrooms
- area
- owner_id (foreign key to users)
- created_at
- updated_at

### Property Images Table
- id
- property_id (foreign key)
- image_url

### Inquiries Table
- id
- property_id (foreign key)
- buyer_id (foreign key)
- message
- created_at
- Unique constraint on (property_id, buyer_id)

### Refresh Tokens Table
- id
- user_id (foreign key)
- token (unique)
- expires_at
- created_at

## License

MIT
