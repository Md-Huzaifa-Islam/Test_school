# Test_School - Digital Competency Assessment Platform

A full-stack TypeScript application for digital competency assessment with progressive evaluation system.

## 🚀 Features

- **Progressive Assessment System**: 3-step evaluation (A1-A2, B1-B2, C1-C2)
- **Timer System**: Auto-submit functionality with time tracking
- **Question Pool Management**: 22 competencies × 6 levels
- **Automatic Certification**: PDF generation for completed assessments
- **Secure Authentication**: JWT with refresh tokens and OTP verification
- **Role-Based Access**: Admin, Student, and Supervisor roles
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🛠️ Tech Stack

### Frontend

- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **React Query (TanStack Query)** for data fetching
- **Tailwind CSS v4** for styling
- **Lucide React** for icons
- **shadcn/ui** for UI components
- **React Hook Form** with Zod validation
- **React Hot Toast** for notifications

### Backend

- **Next.js API Routes** for backend endpoints
- **MongoDB** with Mongoose ODM
- **JWT** authentication with refresh tokens
- **bcryptjs** for password hashing
- **TypeScript** for type safety

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # Backend API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── assessments/   # Assessment endpoints
│   │   ├── questions/     # Question management
│   │   └── users/         # User management
│   ├── auth/              # Auth pages
│   ├── dashboard/         # Dashboard page
│   ├── assessments/       # Assessment pages
│   ├── certificates/      # Certificate pages
│   └── profile/           # Profile page
├── components/            # React components
│   ├── auth/             # Authentication forms
│   ├── pages/            # Page components
│   ├── layout/           # Layout components
│   ├── providers/        # Context providers
│   ├── hoc/              # Higher-order components
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── models/               # MongoDB models
├── store/                # Redux store (if needed)
└── types/                # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd assignment/final_app/i-school
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy `.env.local` and update the variables:

   ```bash
   cp .env.local .env.local
   ```

   **Required Environment Variables:**

   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/test_school_db

   # JWT Secrets (minimum 32 characters)
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-minimum-32-characters-long

   # Email (for OTP verification)
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   ```

4. **Database Setup**

   **Local MongoDB:**

   ```bash
   # Install MongoDB Community Edition
   # Start MongoDB service
   mongod
   ```

   **MongoDB Atlas:**

   - Create a cluster at https://cloud.mongodb.com
   - Get connection string and update `MONGODB_URI`

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api

## 🔐 Authentication System

### User Registration

- Email/password registration
- OTP verification (email-based)
- Password strength validation
- Duplicate email prevention

### Login System

- JWT access tokens (15 minutes)
- Refresh tokens (7 days)
- Automatic token refresh
- Secure logout

### Route Protection

- Protected routes redirect to login
- Role-based access control
- Automatic authentication checks

## 📊 Assessment System

### Question Structure

- **22 Competencies** across 6 levels (A1, A2, B1, B2, C1, C2)
- Multiple choice questions
- Timed assessments
- Progress tracking

### Assessment Flow

1. **Level Selection**: Choose competency level
2. **Question Pool**: Random question selection
3. **Timer System**: Countdown with auto-submit
4. **Results**: Immediate scoring and feedback
5. **Certification**: Automatic PDF generation

### Competency Areas

- Digital Literacy
- Communication
- Problem Solving
- Creative Thinking
- Critical Thinking
- And 17 more areas...

## 👥 User Roles

### Student

- Take assessments
- View results and progress
- Download certificates
- Update profile

### Supervisor

- Monitor student progress
- View assessment results
- Generate reports

### Admin

- Full system management
- User management
- Question pool management
- System analytics

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/certificates` - Get user certificates

### Assessments

- `GET /api/assessments` - Get user assessments
- `POST /api/assessments` - Create new assessment
- `GET /api/assessments/[id]` - Get specific assessment
- `PUT /api/assessments/[id]` - Update assessment

### Questions

- `GET /api/questions` - Get questions (filtered)
- `POST /api/questions` - Create new question (admin)

## 🎨 Styling Guide

### Tailwind CSS Configuration

- Custom color palette
- Responsive breakpoints
- Component variants
- Dark mode support

### UI Components

- Form components with validation
- Loading states
- Error boundaries
- Toast notifications
- Modal dialogs

## 🔒 Security Features

### Data Protection

- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

### Authentication Security

- Password hashing with bcrypt
- JWT token expiration
- Refresh token rotation
- Rate limiting

### API Security

- Request validation
- Error handling
- Logging and monitoring

## 📝 Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Database
npm run db:seed      # Seed database with sample data
npm run db:reset     # Reset database
```

## 🚀 Deployment

### Environment Setup

1. Set production environment variables
2. Update MongoDB connection string
3. Configure email service
4. Set secure JWT secrets

### Production Checklist

- [ ] Environment variables configured
- [ ] Database connection established
- [ ] Email service configured
- [ ] SSL certificates installed
- [ ] Domain configured
- [ ] Monitoring setup

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the code comments

---

**Built with ❤️ using Next.js, TypeScript, and MongoDB**
