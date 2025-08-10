# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Database cluster ready
3. **Gmail App Password**: For email functionality

## Deployment Steps

### 1. Connect Repository

- Import your repository to Vercel
- Select the `final_app/i-school` folder as the root directory

### 2. Configure Environment Variables

Go to your Vercel project settings → Environment Variables and add:

```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-app-name.vercel.app/api
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
JWT_SECRET=7k9m2p5q8r1s4t7u0w3x6y9z2b5c8e1f4g7h0j3k6m9n2p5q8r1s4t7u0w3x6y9z
JWT_REFRESH_SECRET=9z6y3x0w7u4t1s8r5q2p9n6m3k0j7h4g1f8e5c2b9z6y3x0w7u4t1s8r5q2p9n6m
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NEXT_PUBLIC_APP_NAME=Test_School
NEXT_PUBLIC_APP_VERSION=1.0.0
EMAIL_FROM=your-email@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
BCRYPT_SALT_ROUNDS=12
SESSION_SECRET=3f6h9k2m5p8s1v4y7b0e3g6j9l2o5r8u1x4z7c0f3h6k9n2q5t8w1z4b7e0h3k6n
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
ADMIN_EMAIL=admin@testschool.com
ADMIN_PASSWORD=admin123
DEFAULT_ASSESSMENT_TIME_LIMIT=60
MAX_QUESTIONS_PER_ASSESSMENT=50
FRONTEND_URL=https://your-app-name.vercel.app
```

### 3. Build Settings

- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Root Directory**: `final_app/i-school`

### 4. Domain Configuration

After deployment, update:

- `NEXT_PUBLIC_API_URL` with your actual Vercel URL
- `FRONTEND_URL` with your actual Vercel URL

## Post-Deployment

### 1. Seed Questions

Visit: `https://your-app.vercel.app/api/admin/seed-comprehensive-questions`

### 2. Test Admin Login

- Email: `admin@testschool.com`
- Password: `admin123`

### 3. Verify Features

- User registration/login
- Assessment creation and taking
- Certificate generation
- Supervisor dashboard

## Important Notes

- Replace `your-app-name` with your actual Vercel app name
- Use your actual MongoDB Atlas connection string
- Use your Gmail app-specific password for SMTP
- Keep JWT secrets secure and unique

## Troubleshooting

1. **Build Errors**: Check the build logs in Vercel dashboard
2. **Database Connection**: Verify MongoDB Atlas allows connections from `0.0.0.0/0`
3. **Email Issues**: Ensure Gmail app password is correctly set
4. **CORS Issues**: Check `FRONTEND_URL` matches your Vercel domain
