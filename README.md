# 🚗 Car Rental Backend API

A comprehensive, production-ready car rental management system built with Node.js, Express, and MongoDB.

## 📋 Features

- **Authentication & Authorization**
  - JWT-based authentication with refresh tokens
  - Role-based access control (User, Manager, Admin)
  - Email verification
  - Password reset functionality
  
- **Car Management**
  - CRUD operations for vehicles
  - Advanced search and filtering
  - Availability checking
  - Image uploads
  - Rating system

- **Booking System**
  - Real-time availability checking
  - Dynamic pricing
  - Insurance options
  - Add-ons management
  - Booking history

- **Payment Integration**
  - Stripe payment processing
  - Payment history
  - Refund handling

- **Admin Dashboard**
  - Analytics and statistics
  - User management
  - Booking management
  - Revenue reports

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Caching:** Redis
- **Authentication:** JWT (jsonwebtoken)
- **Payment:** Stripe
- **File Upload:** Cloudinary
- **Email:** Nodemailer
- **Documentation:** Swagger/OpenAPI
- **Logging:** Winston
- **Security:** Helmet, express-rate-limit

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Redis (optional, for caching)
- Stripe account (for payments)
- Cloudinary account (for image uploads)

### Step 1: Clone the repository

```bash
git clone <repository-url>
cd car-rental-backend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Environment Setup

Create a `.env` file in the root directory and copy contents from `.env.example`:

```bash
cp .env.example .env
```

Update the `.env` file with your actual credentials:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/car-rental
JWT_SECRET=your-secret-key-here
# ... (update all other variables)
```

### Step 4: Start MongoDB

Make sure MongoDB is running on your machine:

```bash
# Using MongoDB service
sudo service mongod start

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Step 5: Start the server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI:** `http://localhost:5000/api-docs`
- **Health Check:** `http://localhost:5000/health`

## 🔑 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/logout            - Logout user
POST   /api/auth/refresh-token     - Refresh access token
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password    - Reset password
GET    /api/auth/verify-email      - Verify email
GET    /api/auth/me                - Get current user
```

### Cars
```
GET    /api/cars                   - Get all cars (with filters)
GET    /api/cars/featured          - Get featured cars
GET    /api/cars/search            - Search available cars
GET    /api/cars/:id               - Get car details
GET    /api/cars/:id/availability  - Check availability
POST   /api/cars                   - Create car (Admin)
PUT    /api/cars/:id               - Update car (Admin)
DELETE /api/cars/:id               - Delete car (Admin)
```

### Bookings
```
POST   /api/bookings               - Create booking
GET    /api/bookings/:id           - Get booking details
PUT    /api/bookings/:id           - Update booking
DELETE /api/bookings/:id           - Cancel booking
GET    /api/bookings/:id/invoice   - Get invoice
```

### Users
```
GET    /api/users/profile          - Get user profile
PUT    /api/users/profile          - Update profile
POST   /api/users/upload-license   - Upload license
GET    /api/users/bookings         - Get user bookings
```

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 🚀 Deployment

### Using PM2 (Recommended)

1. Install PM2 globally:
```bash
npm install -g pm2
```

2. Start the application:
```bash
pm2 start ecosystem.config.js
```

3. View logs:
```bash
pm2 logs
```

4. Monitor:
```bash
pm2 monit
```

### Environment Variables for Production

Ensure all sensitive data is properly configured:
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure proper CORS origins
- Set up SSL/TLS certificates
- Use production database URLs

## 📊 Database Schema

### User
- Authentication details
- Profile information
- Driver's license
- Role-based permissions

### Car
- Vehicle specifications
- Pricing information
- Availability status
- Location
- Features and amenities

### Booking
- Reservation details
- Pricing breakdown
- Status tracking
- Payment information

### Payment
- Transaction records
- Payment methods
- Refund information

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration
- Helmet for security headers
- SQL injection prevention
- XSS protection

## 📝 Code Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
└── validators/      # Input validation
```

## 🤝 Contributing

1. Fork the repository
