# HandySwift Backend API

Backend server for the HandySwift platform built with Node.js, Express, and Supabase.

## Setup

### 1. Prerequisites
- Node.js 16+ 
- npm or yarn
- Supabase project (see [SUPABASE_SETUP_GUIDE.md](../SUPABASE_SETUP_GUIDE.md))

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=5000
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

### 4. Run Server

**Development (with hot reload):**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

Server will run at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/stats` - Get user statistics

### Bookings
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Jobs
- `POST /api/jobs` - Post a new job
- `GET /api/jobs` - Get user's posted jobs
- `GET /api/jobs/:id` - Get job details
- `GET /api/jobs/:id/offers` - Get job offers
- `PUT /api/jobs/:id/offers/:offerId/accept` - Accept offer
- `PUT /api/jobs/:id/offers/:offerId/reject` - Reject offer
- `PUT /api/jobs/:id/close` - Close job posting

## Architecture

```
src/
├── config/
│   └── supabase.ts       # Supabase client setup
├── middleware/
│   └── auth.ts           # JWT authentication middleware
├── routes/
│   ├── auth.ts           # Authentication endpoints
│   ├── bookings.ts       # Bookings endpoints
│   └── jobs.ts           # Jobs endpoints
├── utils/
│   └── response.ts       # Response formatting helpers
└── index.ts              # Main server entry point
```

## Authentication

All protected endpoints require an `Authorization` header:
```
Authorization: Bearer <token>
```

Tokens are validated using JWT middleware which extracts the user ID and attaches it to the request.

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human readable message",
  "statusCode": 400,
  "timestamp": "2026-01-10T10:30:00Z"
}
```

## Development Notes

- All database operations use Supabase client library
- Password hashing uses bcryptjs (10 salt rounds)
- CORS is configured for frontend development URLs
- Row-level security (RLS) should be enabled on all tables

## Troubleshooting

**Port already in use:**
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>
```

**Module not found:**
```bash
rm -rf node_modules
npm install
```

**Supabase connection error:**
- Verify credentials in `.env`
- Check Supabase project is active
- Ensure database tables exist

## Next Steps

- [ ] Implement reviews endpoints
- [ ] Implement messages/chat endpoints
- [ ] Add file upload for profile pictures
- [ ] Implement referral system
- [ ] Add payment processing
- [ ] Implement WebSocket for real-time updates
- [ ] Add comprehensive logging
- [ ] Set up CI/CD pipeline
- [ ] Add unit and integration tests

## License

MIT
