# PSB Fraud Shield - Database & Server Integration Guide

## Overview
This guide provides comprehensive instructions for integrating the PSB Fraud Shield application with the backend server and database systems.

## 🏗️ Architecture

### Frontend (React Native/Expo)
- **Location**: `/app/` - Main application screens
- **Theme**: PSB Colors (`/utils/PSBColors.ts`)
- **State Management**: Redux + Context API
- **Navigation**: Expo Router

### Backend Server
- **Location**: `/server/`
- **Framework**: Express.js + MongoDB
- **Port**: 5000 (default)
- **API Base URL**: `http://localhost:5000/api`

### Database
- **Type**: MongoDB
- **Connection**: MongoDB Atlas (cloud-hosted)
- **Collections**: Users, Simulations, Analytics, Reports

## 🚀 Quick Start

### 1. Server Setup
```bash
cd server
npm install
npm start
```

### 2. Environment Variables
Create `.env` file in server directory:
```env
MONGODB_URI=mongodb+srv://your-connection-string
PORT=5000
JWT_SECRET=your-jwt-secret
```

### 3. Frontend Configuration
Update API base URL in your app:
```typescript
// utils/api.ts
export const API_BASE_URL = 'http://localhost:5000/api';
```

### 4. OTP Configuration
Add OTP environment variables to your `.env` file:
```env
# Twilio Configuration (for SMS OTP)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Email Configuration (for Email OTP)
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASSWORD=your_app_specific_password
```

## 📱 Application Structure

### Tab Navigation (`app/(app)/(tabs)/`)
1. **Home** (`index.tsx`) - Dashboard with PSB branding
2. **Simulators** (`simulator.tsx`) - Fraud simulation modules
3. **Education** (`education.tsx`) - Learning resources
4. **Tools** (`tools.tsx`) - Utility tools
5. **Profile** (`profile.tsx`) - User profile & settings

### PSB Theme Integration
All screens now use the comprehensive PSB color scheme:

```typescript
// Primary PSB Colors
primary: {
  green: "#00563F",    // PSB Forest Green
  gold: "#FFD700",     // PSB Gold
  darkGreen: "#004025", // Darker shade
  lightGreen: "#E8F5E8" // Light background
}
```

## 🎨 PSB Theme Implementation

### Color System
- **Primary Green**: `#00563F` - Main brand color
- **Gold Accent**: `#FFD700` - Secondary brand color
- **Backgrounds**: Clean whites and light grays
- **Text**: Dark grays for readability
- **Status Colors**: Success, warning, error states

### Typography
- **Headings**: Bold, professional fonts
- **Body Text**: Clean, readable fonts
- **Spacing**: Consistent 8px grid system

### Components Styled
- ✅ Tab bars with PSB green active states
- ✅ Headers with PSB green backgrounds
- ✅ Cards with subtle shadows and borders
- ✅ Buttons with PSB color scheme
- ✅ Progress bars and indicators
- ✅ Icons and badges

## 🔌 API Integration

### Available Endpoints

#### Document Hash Verification
```typescript
POST /api/verify-document-hash
{
  "documentHash": "sha256-hash",
  "originalHash": "original-hash"
}
```

#### Phishing Detection
```typescript
POST /api/analyze-url
{
  "url": "https://example.com",
  "userId": "user-id"
}
```

#### User Analytics
```typescript
GET /api/user-analytics/:userId
POST /api/track-activity
```

#### OTP Verification
```typescript
POST /api/send-otp-sms
{
  "phoneNumber": "+1234567890",
  "purpose": "verification"
}

POST /api/send-otp-email
{
  "email": "user@example.com",
  "purpose": "verification"
}

POST /api/verify-otp
{
  "identifier": "sms_+1234567890_verification",
  "otp": "123456",
  "type": "sms"
}
```

### Integration Example
```typescript
// components/UrlAnalyzer.tsx
import { API_BASE_URL } from '../utils/api';

const analyzeUrl = async (url: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, userId: currentUser.id }),
    });
    return await response.json();
  } catch (error) {
    console.error('URL analysis failed:', error);
  }
};
```

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  name: String,
  profile: {
    level: String,
    experiencePoints: Number,
    badges: Array,
    achievements: Array
  },
  analytics: {
    simulationsCompleted: Number,
    fraudDetected: Number,
    learningProgress: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Simulations Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  type: String, // 'ponzi', 'phishing', 'identity-theft'
  score: Number,
  timeSpent: Number,
  redFlagsDetected: Array,
  completedAt: Date
}
```

### Reports Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  type: String, // 'fraud-report', 'suspicious-activity'
  details: {
    description: String,
    evidence: Array,
    severity: String
  },
  status: String, // 'pending', 'investigating', 'resolved'
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Development Workflow

### 1. Local Development
```bash
# Terminal 1: Start server
cd server && npm start

# Terminal 2: Start frontend
npm start
```

### 2. Testing API Endpoints
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test document hash verification
curl -X POST http://localhost:5000/api/verify-document-hash \
  -H "Content-Type: application/json" \
  -d '{"documentHash":"test","originalHash":"test"}'
```

### 3. Database Operations
```bash
# Connect to MongoDB (if local)
mongosh "your-connection-string"

# View collections
show collections

# Query users
db.users.find().pretty()
```

## 🎯 Key Features Implemented

### 1. PSB Branding
- ✅ Consistent color scheme across all screens
- ✅ Professional typography and spacing
- ✅ Brand-appropriate icons and imagery
- ✅ Trustworthy, banking-focused design

### 2. User Experience
- ✅ Intuitive navigation with tab bar
- ✅ Clear visual hierarchy
- ✅ Responsive design for different screen sizes
- ✅ Accessibility considerations

### 3. Security Features
- ✅ Document hash verification
- ✅ URL phishing analysis
- ✅ Fraud detection algorithms
- ✅ Secure user authentication

### 4. Educational Content
- ✅ Interactive simulations
- ✅ Comprehensive glossary
- ✅ Real-world case studies
- ✅ Progress tracking

### 5. OTP Security
- ✅ SMS and email OTP delivery
- ✅ 6-digit secure OTP generation
- ✅ 10-minute expiration period
- ✅ Maximum 3 verification attempts
- ✅ PSB-branded email templates

## 🚨 Error Handling

### Frontend Error Handling
```typescript
try {
  const result = await apiCall();
  // Handle success
} catch (error) {
  // Show user-friendly error message
  Alert.alert('Error', 'Unable to complete operation. Please try again.');
}
```

### Backend Error Handling
```javascript
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});
```

## 📊 Analytics & Monitoring

### User Analytics
- Track simulation completions
- Monitor fraud detection accuracy
- Analyze learning progress
- Generate user engagement reports

### System Monitoring
- Server health checks
- Database performance metrics
- API response times
- Error rate tracking

## 🔄 Deployment

### Server Deployment
```bash
# Build for production
npm run build

# Deploy to cloud platform
# (Heroku, AWS, Google Cloud, etc.)
```

### Frontend Deployment
```bash
# Build Expo app
expo build:android
expo build:ios

# Or publish to Expo
expo publish
```

## 📝 Maintenance

### Regular Tasks
- Monitor server logs for errors
- Update dependencies regularly
- Backup database weekly
- Review user analytics monthly
- Update fraud detection algorithms

### Security Updates
- Keep dependencies updated
- Monitor for security vulnerabilities
- Regular security audits
- Update API keys and secrets

## 🤝 Support

For technical support or questions about the integration:
1. Check the server logs for errors
2. Verify database connectivity
3. Test API endpoints individually
4. Review the PSB theme implementation
5. Consult the comprehensive documentation

---

**PSB Fraud Shield** - Empowering safe and secure banking through education and technology.