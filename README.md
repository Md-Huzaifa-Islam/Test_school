# Test_School - Digital Competency Assessment Platform

A comprehensive full-stack TypeScript application for digital English competency assessment with progressive evaluation system, admin management, and automatic certification.

## 🌟 Features

### 🎯 **Assessment System**

- **Progressive 3-Step Evaluation**: A1-A2 (Beginner) → B1-B2 (Intermediate) → C1-C2 (Advanced)
- **Timer System**: Auto-submit functionality with countdown timers
- **Question Pool Management**: 22+ competencies × 6 proficiency levels
- **Automatic Certification**: PDF generation with unique certificate numbers
- **Real-time Progress Tracking**: Step completion and score tracking

### 🔐 **Authentication & Security**

- **JWT Authentication**: Access & refresh token system
- **Email Verification**: OTP-based email verification
- **Password Reset**: Secure password reset with email notifications
- **Role-Based Access Control**: Admin, Student, and Supervisor roles
- **Secure Routes**: Protected API endpoints and pages

### 👨‍💼 **Admin Management**

- **Comprehensive Dashboard**: Real-time statistics and system overview
- **User Management**: View, search, manage students and supervisors
- **Question Bank**: Add, edit, delete, and organize assessment questions
- **Certificate Management**: Approve, view, and download certificates
- **Database Tools**: Seed questions, clear data, system health checks

### 🎨 **User Experience**

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Intuitive Interface**: Clean, modern UI with loading states
- **Real-time Feedback**: Toast notifications and error handling
- **Search & Filter**: Advanced search across all management interfaces

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** with App Router and Turbopack
- **TypeScript** for complete type safety
- **Tailwind CSS v4** for modern styling
- **Lucide React** for beautiful icons
- **shadcn/ui** for consistent UI components
- **React Hook Form** with Zod validation
- **React Hot Toast** for notifications

### Backend

- **Next.js API Routes** for serverless backend
- **MongoDB** with Mongoose ODM
- **JWT** authentication with refresh tokens
- **bcryptjs** for secure password hashing
- **Nodemailer** for email functionality

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # Backend API routes
│   │   ├── auth/          # Authentication (login, register, verify)
│   │   ├── admin/         # Admin endpoints (users, questions, certificates)
│   │   ├── assessments/   # Assessment system
│   │   ├── questions/     # Question management
│   │   ├── users/         # User profiles and certificates
│   │   └── debug/         # Development debugging endpoints
│   ├── admin/             # Admin dashboard and management
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── assessments/       # Assessment interface
│   ├── certificates/      # Certificate viewing
│   ├── exam/              # Exam taking interface
│   └── profile/           # User profile management
├── components/            # Reusable components
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components (Navigation, Sidebar)
│   ├── pages/             # Page-specific components
│   ├── providers/         # Context providers
│   └── ui/                # UI components (Button, Card, Table, etc.)
├── lib/                   # Utility libraries
│   ├── mongodb.ts         # Database connection
│   ├── jwt.ts            # JWT utilities
│   ├── email.ts          # Email functionality
│   └── utils.ts          # General utilities
├── models/               # MongoDB models
│   ├── User.ts           # User model
│   ├── Question.ts       # Question model
│   ├── Assessment.ts     # Assessment model
│   └── Certificate.ts    # Certificate model
└── types/                # TypeScript type definitions
    ├── index.ts          # Global types
    └── api.ts            # API response types
```

├── components/ # React components
│ ├── auth/ # Authentication forms
│ ├── pages/ # Page components
│ ├── layout/ # Layout components
│ ├── providers/ # Context providers
│ ├── hoc/ # Higher-order components
│ └── ui/ # Reusable UI components
├── hooks/ # Custom React hooks
├── lib/ # Utility libraries
├── models/ # MongoDB models
├── store/ # Redux store (if needed)
└── types/ # TypeScript type definitions

````

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
````

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

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local or Atlas) - [MongoDB Atlas](https://cloud.mongodb.com/) (recommended)
- **Git** - [Download here](https://git-scm.com/)

### 📥 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Md-Huzaifa-Islam/Test_school.git
   cd Test_school/final_app/i-school
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/test_school_db
   # Or use MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/test_school_db

   # JWT Secrets (generate strong random keys)
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-12345
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-minimum-32-characters-67890

   # Email Configuration (for OTP verification)
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-gmail-app-password
   ```

4. **Start the application**

   ```bash
   npm run dev
   ```

5. **Access the application**
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Admin Panel**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## � Default Admin Credentials

For testing purposes, you can create an admin account:

### Method 1: Using the Setup API

1. **Open your browser and go to:**

   ```
   http://localhost:3000/api/admin/setup
   ```

2. **This will create a default admin account:**
   - **Email**: `admin@testschool.com`
   - **Password**: `Admin@123456`
   - **Role**: Admin

### Method 2: Manual Registration

1. Go to: [http://localhost:3000/auth/register](http://localhost:3000/auth/register)
2. Register with your preferred email
3. Use the API endpoint to promote to admin:
   ```bash
   curl -X POST http://localhost:3000/api/admin/create-admin \
     -H "Content-Type: application/json" \
     -d '{"email": "your-email@example.com"}'
   ```

## 🎯 Testing the Application

### 1. **Admin Testing**

- **Login**: Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Credentials**: `admin@testschool.com` / `Admin@123456`
- **Features to test**:
  - Dashboard with real-time statistics
  - User management (view/search/delete users)
  - Question bank management (add/edit/delete questions)
  - Certificate management (approve/view certificates)
  - System tools (seed questions, health check)

### 2. **Student Testing**

- **Register**: [http://localhost:3000/auth/register](http://localhost:3000/auth/register)
- **Verify email** (check console logs for OTP if email not configured)
- **Take assessments**: Progressive A1→B1→C1 or A2→B2→C2
- **View certificates**: Download PDF certificates

### 3. **Database Seeding**

After admin login, seed the database with sample questions:

1. Go to Admin Dashboard
2. Click "Seed Realistic Questions" button
3. This will create 1000+ questions across all competencies and levels

## 📊 Features Overview

### 🎯 **Admin Dashboard**

- Real-time statistics (users, questions, certificates)
- System health monitoring
- Quick action buttons for common tasks

### 👥 **User Management**

- View all registered users with detailed information
- Search and filter by name, email, or role
- Reset user passwords and delete accounts
- Role-based statistics (students, supervisors, admins)

### 📝 **Question Bank Management**

- Add new questions with multiple choice answers
- Search and filter existing questions
- Delete unwanted questions
- Statistics by competency and difficulty level
- Bulk operations (seed/clear questions)

### 🏆 **Certificate Management**

- View all issued certificates
- Approve pending certificates
- Download certificate PDFs
- Search by student or certificate number
- Level distribution analytics

### ⚙️ **System Tools**

- Database seeding with realistic questions
- System health checks
- User progress monitoring
- Debug endpoints for development
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
- JWT token management
- OTP verification system
- Rate limiting
- Session management

## 📊 Assessment System

### Competency Levels

The platform supports 6 competency levels:

- **A1**: Beginner
- **A2**: Elementary
- **B1**: Intermediate
- **B2**: Upper Intermediate
- **C1**: Advanced
- **C2**: Proficient

### Question Categories

22 competency areas including:

- Reading Comprehension
- Listening Skills
- Grammar
- Vocabulary
- Writing
- Speaking
- And more...

### Certification

- Automatic certificate generation
- PDF download
- Digital verification
- Progress tracking

## 🛠️ Development

### Code Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── admin/          # Admin pages
│   ├── auth/           # Authentication pages
│   └── ...
├── components/         # React components
│   ├── auth/          # Auth components
│   ├── layout/        # Layout components
│   └── ui/            # UI components
├── lib/               # Utilities
├── models/            # MongoDB models
├── store/             # Redux store
└── types/             # TypeScript types
```

### Testing

Run tests with:

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run type-check
```

## 📈 Performance

### Optimizations

- Next.js Image optimization
- Code splitting
- Lazy loading
- Static generation where possible
- MongoDB indexing

### Monitoring

- Error tracking
- Performance metrics
- User analytics
- System health checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

### Code Standards

- Use TypeScript for all new code
- Follow ESLint configuration
- Write meaningful commit messages
- Add JSDoc comments for functions
- Maintain test coverage

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please contact:

- Email: support@testschool.com
- Documentation: [Link to docs]
- Issues: [GitHub Issues]

---

**Test_School Platform** - Digital Competency Assessment for Modern Education

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
