# FinGuard Unified Server

A comprehensive backend server for the FinGuard application that combines all functionality into a single, robust Node.js/Express server with MongoDB database.

## 🚀 Features

### Complete Database Schema
- **Users**: Authentication, profiles, preferences, security settings
- **Educational Content**: Lessons, courses, quizzes with progress tracking
- **Scenarios**: Interactive decision-making scenarios for fraud detection
- **Financial Goals**: Personal goal setting and contribution tracking
- **Reports**: Scam/fraud reporting with geolocation
- **Security Analysis**: URL/email analysis for threat detection
- **Progress Tracking**: User learning progress and achievements
- **Notifications**: In-app notification system

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

#### User Management
- `GET /api/users/currentuser` - Get current user profile
- `PUT /api/users/profile` - Update user profile

#### Educational Content
- `GET /api/lessons` - Get lessons (with filters)
- `GET /api/lessons/:id` - Get specific lesson
- `GET /api/courses` - Get courses
- `GET /api/courses/:id` - Get course with lessons
- `GET /api/quizzes` - Get quizzes
- `GET /api/quizzes/:id` - Get specific quiz
- `POST /api/quizzes/:id/submit` - Submit quiz answers

#### Scenarios
- `GET /api/scenarios` - Get scenarios
- `GET /api/scenarios/:id` - Get specific scenario
- `POST /api/scenarios/:id/submit` - Submit scenario choice

#### Progress Tracking
- `GET /api/progress` - Get user progress
- `GET /api/progress/dashboard` - Get dashboard statistics

#### Financial Goals
- `GET /api/goals` - Get user goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `GET /api/goals/:goalId/contributions` - Get goal contributions
- `POST /api/goals/:goalId/contributions` - Add contribution

#### Reports & Security
- `GET /api/reports` - Get scam reports
- `POST /api/reports` - Submit scam report
- `GET /api/reports/:id` - Get specific report
- `DELETE /api/reports/:id` - Delete report
- `POST /api/security/analyze-url` - Analyze URL for threats
- `POST /api/security/analyze-email` - Analyze email for phishing

#### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

#### Admin
- `POST /api/admin/seed` - Seed database with content

## 🛠 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone and navigate to the project**
   ```bash
   cd /workspace
   ```

2. **Install dependencies**
   ```bash
   npm install --save express mongoose cors bcrypt jsonwebtoken body-parser axios node-fetch dotenv multer helmet express-rate-limit morgan
   npm install --save-dev nodemon @types/node
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=4000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_MAPS_KEY=your_google_maps_api_key
   VT_API_KEY=your_virustotal_api_key
   ```

4. **Create the scripts directory**
   ```bash
   mkdir -p scripts
   ```

5. **Seed the database**
   ```bash
   # For manual seeding with sample data
   node scripts/seed-data.js manual
   
   # For automatic seeding from data files
   node scripts/seed-data.js auto
   ```

6. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

The server will run on `http://localhost:4000`

## 📊 Database Schema

### User Schema
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  dateOfBirth: Date,
  profileImage: String,
  isVerified: Boolean,
  role: ['user', 'admin'],
  preferences: {
    language: String,
    notifications: Boolean,
    darkMode: Boolean
  },
  securitySettings: {
    twoFactorEnabled: Boolean,
    lastPasswordChange: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Lesson Schema
```javascript
{
  id: String (unique),
  courseId: String,
  title: String,
  description: String,
  content: String,
  category: String,
  duration: Number,
  order: Number,
  keyTakeaways: [String],
  imageUrl: String,
  audioUrl: String,
  difficulty: ['Beginner', 'Intermediate', 'Advanced'],
  language: String,
  quiz: [{
    id: String,
    question: String,
    options: [String],
    correct: Number,
    explanation: String
  }]
}
```

### Quiz Schema
```javascript
{
  id: String (unique),
  title: String,
  description: String,
  category: ['fraud', 'financial'],
  difficulty: ['beginner', 'intermediate', 'advanced'],
  estimatedTime: Number,
  questions: [{
    id: String,
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String
  }]
}
```

### Scenario Schema
```javascript
{
  id: String (unique),
  title: String,
  description: String,
  situation: String,
  imageUrl: String,
  category: ['fraud-detection', 'investment', 'budgeting', 'insurance', 'retirement'],
  difficulty: ['beginner', 'intermediate', 'advanced'],
  timeLimit: Number,
  choices: [{
    id: String,
    text: String,
    isCorrect: Boolean,
    consequence: String,
    explanation: String,
    points: Number
  }],
  learningObjective: String,
  relatedLessonId: String
}
```

### Goal Schema
```javascript
{
  userId: ObjectId,
  title: String,
  targetAmount: Number,
  currentAmount: Number,
  targetDate: Date,
  category: String,
  monthlyTarget: Number,
  progress: Number,
  description: String,
  priority: ['low', 'medium', 'high'],
  isActive: Boolean
}
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: Protection against abuse
- **CORS Configuration**: Controlled cross-origin requests
- **Input Validation**: Request validation and sanitization
- **Security Headers**: Helmet.js for security headers

## 🧪 API Testing

### Authentication Flow
```bash
# Register a new user
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe", 
    "email": "john@example.com",
    "password": "securePassword123"
  }'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'

# Use the token from login response
export TOKEN="your_jwt_token_here"

# Get current user
curl -X GET http://localhost:4000/api/users/currentuser \
  -H "Authorization: Bearer $TOKEN"
```

### Content Access
```bash
# Get lessons
curl -X GET http://localhost:4000/api/lessons

# Get quizzes
curl -X GET http://localhost:4000/api/quizzes

# Get scenarios
curl -X GET http://localhost:4000/api/scenarios

# Submit quiz
curl -X POST http://localhost:4000/api/quizzes/phishing-basics-quiz/submit \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [{"selectedAnswer": 1, "timeSpent": 30}],
    "timeSpent": 300
  }'
```

## 🌍 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/finguard
JWT_SECRET=super-secure-production-secret
GOOGLE_MAPS_KEY=production-google-maps-key
VT_API_KEY=production-virustotal-key
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

### PM2 Deployment
```bash
npm install -g pm2
pm2 start unified-server.js --name finguard-server
pm2 startup
pm2 save
```

## 📝 Data Migration

The server includes data seeding functionality to populate the database with educational content from your existing data files:

1. **Lessons**: From `data/lessonsData.ts` and `data/lessons.ts`
2. **Quizzes**: From `data/quizData.ts`
3. **Scenarios**: From `data/scenarios.ts`

Note: Simulator input data is excluded as requested.

## 🔧 Monitoring & Logging

The server includes:
- Request logging with Morgan
- Error handling and logging
- Health check endpoint: `GET /api/health`
- Database connection monitoring

## 🚫 Excluded Features

As per requirements, the following simulator input data is excluded from the database:
- Simulator input forms and interactive elements
- Live simulation data that requires user input
- Real-time simulation state management

The database focuses on static educational content, user progress, and core application functionality.

## 📈 Performance Considerations

- Database indexing on frequently queried fields
- Pagination for large result sets
- Caching strategies for static content
- Optimized database queries with proper projections
- Rate limiting to prevent abuse

## 🔄 API Versioning

All endpoints are versioned with `/api/` prefix. Future versions can be added as `/api/v2/` etc.

## 📞 Support

For issues or questions:
1. Check the health endpoint: `GET /api/health`
2. Review server logs
3. Verify environment variables
4. Ensure MongoDB connection is active

---

**Note**: This unified server replaces both `server.js` and the separate `server/` folder, combining all functionality into a single, maintainable codebase with comprehensive database schemas for the entire FinGuard application.