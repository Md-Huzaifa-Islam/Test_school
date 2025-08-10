# Gmail Setup Guide for Test_School Email Production

## Current Configuration
Your application is configured to use Gmail SMTP for production email sending.

## Steps to Enable Gmail Email Sending:

### 1. Enable 2-Factor Authentication
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", click "2-Step Verification"
4. Follow the steps to enable 2FA (required for app passwords)

### 2. Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" from the dropdown
3. Click "Generate"
4. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

### 3. Update Environment Variables
1. Open your `.env.local` file
2. Replace `your-16-character-app-password` with the generated app password
3. Save the file

### 4. Test Email Functionality
After setup, your application will be able to send:
- ✅ **Registration verification emails**
- ✅ **OTP codes for email verification**
- ✅ **Password reset emails**

## Email Limits (Free Gmail)
- **500 emails per day** (more than enough for assessment purposes)
- No monthly limits
- Professional email templates included

## Features Your Email System Includes:
1. **Professional HTML Templates** - Beautiful, responsive email designs
2. **OTP Verification** - 6-digit codes with 10-minute expiry
3. **Password Reset** - Secure token-based password reset
4. **Email Verification** - Account activation via email links
5. **Error Handling** - Graceful fallbacks if email fails

## Security Features:
- ✅ App passwords (not your main Gmail password)
- ✅ Token-based verification
- ✅ Time-limited OTPs
- ✅ Secure SMTP connection

## Sample Emails Your System Will Send:

### 1. Registration Verification
```
Subject: Verify your email - Test_School

Welcome to Test_School!
Please verify your email address by clicking the link below...
```

### 2. OTP Verification
```
Subject: Your verification code - Test_School

Your verification code: 123456
This code will expire in 10 minutes.
```

### 3. Password Reset
```
Subject: Reset your password - Test_School

You requested a password reset. Click the link below to set a new password...
```

Once you complete the Gmail setup, your Test_School platform will have fully functional production-ready email capabilities!
