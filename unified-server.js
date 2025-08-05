const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI || 
  "mongodb+srv://nishantmanocha885:Yic2Wxl1A7iBluFB@cluster1.r4mvn.mongodb.net/finguard";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected to FinGuard Database"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "finguard-secret-key-2024";

// ✅ Database Schemas

// User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  dateOfBirth: { type: Date },
  profileImage: { type: String },
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  preferences: {
    language: { type: String, default: 'en' },
    notifications: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: false }
  },
  securitySettings: {
    twoFactorEnabled: { type: Boolean, default: false },
    lastPasswordChange: { type: Date, default: Date.now }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Course Schema
const courseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  color: { type: String, required: true },
  icon: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  rating: { type: Number, min: 0, max: 5 },
  totalDuration: { type: Number, required: true }, // in minutes
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Lesson Schema
const lessonSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  courseId: { type: String, ref: 'Course' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  order: { type: Number, required: true },
  keyTakeaways: [{ type: String }],
  imageUrl: { type: String },
  audioUrl: { type: String },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  language: { type: String, default: 'en' },
  quiz: [{
    id: { type: String, required: true },
    question: { type: String, required: true },
    options: [{ type: String }],
    correct: { type: Number, required: true },
    explanation: { type: String }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Quiz Schema
const quizSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ["fraud", "financial"], required: true },
  difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
  estimatedTime: { type: Number, required: true }, // in minutes
  questions: [{
    id: { type: String, required: true },
    question: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: Number, required: true },
    explanation: { type: String, required: true }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Scenario Schema
const scenarioSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  situation: { type: String, required: true },
  imageUrl: { type: String },
  category: { 
    type: String, 
    enum: ['fraud-detection', 'investment', 'budgeting', 'insurance', 'retirement'], 
    required: true 
  },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  timeLimit: { type: Number }, // in seconds
  choices: [{
    id: { type: String, required: true },
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    consequence: { type: String, required: true },
    explanation: { type: String, required: true },
    points: { type: Number, required: true }
  }],
  learningObjective: { type: String, required: true },
  relatedLessonId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// User Progress Schema
const userProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: String },
  lessonId: { type: String },
  quizId: { type: String },
  scenarioId: { type: String },
  type: { type: String, enum: ['course', 'lesson', 'quiz', 'scenario'], required: true },
  status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
  score: { type: Number },
  timeSpent: { type: Number }, // in minutes
  completedAt: { type: Date },
  answers: [{
    questionId: { type: String },
    selectedAnswer: { type: Number },
    isCorrect: { type: Boolean },
    timeSpent: { type: Number }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Financial Goal Schema
const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  targetDate: { type: Date, required: true },
  category: { type: String, required: true },
  monthlyTarget: { type: Number, required: true },
  progress: { type: Number, default: 0 },
  description: { type: String },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Contribution Schema
const contributionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['initial', 'monthly', 'bonus', 'extra'], required: true },
  description: { type: String },
  paymentMethod: { type: String },
  transactionId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Report Schema (for scam/fraud reports)
const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, required: true },
  description: { type: String, required: true },
  contactInfo: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  evidence: [{
    type: { type: String, enum: ['image', 'document', 'screenshot'] },
    url: { type: String },
    description: { type: String }
  }],
  status: { type: String, enum: ['pending', 'investigating', 'resolved', 'closed'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolution: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Security Analysis Schema (for URL/Hash verification)
const securityAnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['url', 'hash', 'email', 'file'], required: true },
  input: { type: String, required: true },
  results: {
    riskScore: { type: Number, min: 0, max: 100 },
    threats: [{ type: String }],
    analysis: { type: String },
    recommendation: { type: String }
  },
  analysisEngine: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// User Achievement Schema
const achievementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String },
  points: { type: Number, default: 0 },
  level: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum'] },
  earnedAt: { type: Date, default: Date.now }
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['goal_reminder', 'course_completion', 'security_alert', 'general'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  actionUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// ✅ Create Models
const User = mongoose.model("User", userSchema);
const Course = mongoose.model("Course", courseSchema);
const Lesson = mongoose.model("Lesson", lessonSchema);
const Quiz = mongoose.model("Quiz", quizSchema);
const Scenario = mongoose.model("Scenario", scenarioSchema);
const UserProgress = mongoose.model("UserProgress", userProgressSchema);
const Goal = mongoose.model("Goal", goalSchema);
const Contribution = mongoose.model("Contribution", contributionSchema);
const Report = mongoose.model("Report", reportSchema);
const SecurityAnalysis = mongoose.model("SecurityAnalysis", securityAnalysisSchema);
const Achievement = mongoose.model("Achievement", achievementSchema);
const Notification = mongoose.model("Notification", notificationSchema);

// ✅ Middleware for JWT Authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ✅ Helper Functions
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Reverse Geocode Helper
const API_KEY = process.env.GOOGLE_MAPS_KEY || "YOUR_GOOGLE_MAPS_KEY";
async function getReadableAddress(lat, lng) {
  try {
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
    );
    if (res.data.results.length > 0) {
      const formatted = res.data.results[0].formatted_address;
      const cityComponent = res.data.results[0].address_components.find((c) =>
        c.types.includes("locality")
      );
      return {
        address: formatted,
        city: cityComponent ? cityComponent.long_name : "",
      };
    }
  } catch (error) {
    console.error("Reverse geocode failed:", error.message);
  }
  return { address: "Unknown Location", city: "" };
}

// ✅ Authentication Routes
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone
    });

    await user.save();

    // Generate token
    const token = generateToken(user);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: userResponse
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: userResponse
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error during login", error: error.message });
  }
});

app.post("/api/auth/logout", authenticateToken, async (req, res) => {
  try {
    // In a more sophisticated setup, you might maintain a blacklist of tokens
    res.json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    res.status(500).json({ message: "Error during logout", error: error.message });
  }
});

app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token (in production, send via email)
    const resetToken = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET + user.password, // Include password hash for extra security
      { expiresIn: '15m' }
    );

    res.json({
      success: true,
      message: "Password reset token generated",
      resetToken // In production, don't send this in response, send via email
    });
  } catch (error) {
    res.status(500).json({ message: "Error processing forgot password", error: error.message });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    
    // Find user by email from token payload (without verifying)
    const decoded = jwt.decode(resetToken);
    if (!decoded) {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify token with user's current password hash
    try {
      jwt.verify(resetToken, JWT_SECRET + user.password);
    } catch (error) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    user.password = hashedPassword;
    user.securitySettings.lastPasswordChange = new Date();
    await user.save();

    res.json({
      success: true,
      message: "Password reset successful"
    });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password", error: error.message });
  }
});

// ✅ User Profile Routes
app.get("/api/users/currentuser", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
});

app.put("/api/users/profile", authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, dateOfBirth, preferences } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    
    user.updatedAt = new Date();
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
});

// ✅ Lessons & Courses Routes
app.get("/api/lessons", async (req, res) => {
  try {
    const { category, difficulty, language = 'en' } = req.query;
    
    let filter = { language };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const lessons = await Lesson.find(filter).sort({ order: 1 });
    
    res.json({
      success: true,
      lessons
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching lessons", error: error.message });
  }
});

app.get("/api/lessons/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findOne({ id: req.params.id });
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.json({
      success: true,
      lesson
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching lesson", error: error.message });
  }
});

app.get("/api/courses", async (req, res) => {
  try {
    const { difficulty, category } = req.query;
    
    let filter = {};
    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = category;

    const courses = await Course.find(filter);
    
    res.json({
      success: true,
      courses
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error: error.message });
  }
});

app.get("/api/courses/:id", async (req, res) => {
  try {
    const course = await Course.findOne({ id: req.params.id });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Get lessons for this course
    const lessons = await Lesson.find({ courseId: req.params.id }).sort({ order: 1 });
    
    res.json({
      success: true,
      course: {
        ...course.toObject(),
        lessons
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching course", error: error.message });
  }
});

// ✅ Quiz Routes
app.get("/api/quizzes", async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    
    let filter = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const quizzes = await Quiz.find(filter);
    
    res.json({
      success: true,
      quizzes
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching quizzes", error: error.message });
  }
});

app.get("/api/quizzes/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ id: req.params.id });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json({
      success: true,
      quiz
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz", error: error.message });
  }
});

app.post("/api/quizzes/:id/submit", authenticateToken, async (req, res) => {
  try {
    const { answers, timeSpent } = req.body;
    const quizId = req.params.id;

    const quiz = await Quiz.findOne({ id: quizId });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Calculate score
    let correctAnswers = 0;
    const processedAnswers = answers.map((answer, index) => {
      const question = quiz.questions[index];
      const isCorrect = question && question.correctAnswer === answer.selectedAnswer;
      if (isCorrect) correctAnswers++;
      
      return {
        questionId: question?.id,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        timeSpent: answer.timeSpent || 0
      };
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);

    // Save progress
    const progress = new UserProgress({
      userId: req.user.id,
      quizId,
      type: 'quiz',
      status: 'completed',
      score,
      timeSpent,
      answers: processedAnswers,
      completedAt: new Date()
    });

    await progress.save();

    res.json({
      success: true,
      score,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      answers: processedAnswers
    });
  } catch (error) {
    res.status(500).json({ message: "Error submitting quiz", error: error.message });
  }
});

// ✅ Scenario Routes
app.get("/api/scenarios", async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    
    let filter = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const scenarios = await Scenario.find(filter);
    
    res.json({
      success: true,
      scenarios
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching scenarios", error: error.message });
  }
});

app.get("/api/scenarios/:id", async (req, res) => {
  try {
    const scenario = await Scenario.findOne({ id: req.params.id });
    if (!scenario) {
      return res.status(404).json({ message: "Scenario not found" });
    }

    res.json({
      success: true,
      scenario
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching scenario", error: error.message });
  }
});

app.post("/api/scenarios/:id/submit", authenticateToken, async (req, res) => {
  try {
    const { choiceId, timeSpent } = req.body;
    const scenarioId = req.params.id;

    const scenario = await Scenario.findOne({ id: scenarioId });
    if (!scenario) {
      return res.status(404).json({ message: "Scenario not found" });
    }

    const selectedChoice = scenario.choices.find(choice => choice.id === choiceId);
    if (!selectedChoice) {
      return res.status(400).json({ message: "Invalid choice" });
    }

    // Save progress
    const progress = new UserProgress({
      userId: req.user.id,
      scenarioId,
      type: 'scenario',
      status: 'completed',
      score: selectedChoice.points,
      timeSpent,
      answers: [{
        questionId: scenarioId,
        selectedAnswer: choiceId,
        isCorrect: selectedChoice.isCorrect,
        timeSpent
      }],
      completedAt: new Date()
    });

    await progress.save();

    res.json({
      success: true,
      choice: selectedChoice,
      points: selectedChoice.points
    });
  } catch (error) {
    res.status(500).json({ message: "Error submitting scenario", error: error.message });
  }
});

// ✅ User Progress Routes
app.get("/api/progress", authenticateToken, async (req, res) => {
  try {
    const { type } = req.query;
    
    let filter = { userId: req.user.id };
    if (type) filter.type = type;

    const progress = await UserProgress.find(filter).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      progress
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching progress", error: error.message });
  }
});

app.get("/api/progress/dashboard", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get overall statistics
    const totalLessons = await Lesson.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();
    const totalScenarios = await Scenario.countDocuments();

    const completedLessons = await UserProgress.countDocuments({
      userId,
      type: 'lesson',
      status: 'completed'
    });

    const completedQuizzes = await UserProgress.countDocuments({
      userId,
      type: 'quiz',
      status: 'completed'
    });

    const completedScenarios = await UserProgress.countDocuments({
      userId,
      type: 'scenario',
      status: 'completed'
    });

    // Get average scores
    const quizScores = await UserProgress.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), type: 'quiz', status: 'completed' } },
      { $group: { _id: null, avgScore: { $avg: '$score' } } }
    ]);

    const scenarioPoints = await UserProgress.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), type: 'scenario', status: 'completed' } },
      { $group: { _id: null, totalPoints: { $sum: '$score' } } }
    ]);

    res.json({
      success: true,
      dashboard: {
        lessons: {
          completed: completedLessons,
          total: totalLessons,
          percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
        },
        quizzes: {
          completed: completedQuizzes,
          total: totalQuizzes,
          percentage: totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0,
          averageScore: quizScores.length > 0 ? Math.round(quizScores[0].avgScore) : 0
        },
        scenarios: {
          completed: completedScenarios,
          total: totalScenarios,
          percentage: totalScenarios > 0 ? Math.round((completedScenarios / totalScenarios) * 100) : 0,
          totalPoints: scenarioPoints.length > 0 ? scenarioPoints[0].totalPoints : 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard", error: error.message });
  }
});

// ✅ Financial Goals Routes
app.get("/api/goals", authenticateToken, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id, isActive: true }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      goals
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching goals", error: error.message });
  }
});

app.post("/api/goals", authenticateToken, async (req, res) => {
  try {
    const { title, targetAmount, targetDate, category, description, monthlyTarget } = req.body;

    const goal = new Goal({
      userId: req.user.id,
      title,
      targetAmount,
      targetDate,
      category,
      description,
      monthlyTarget
    });

    await goal.save();

    res.status(201).json({
      success: true,
      message: "Goal created successfully",
      goal
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating goal", error: error.message });
  }
});

app.put("/api/goals/:id", authenticateToken, async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user.id });
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    const { title, targetAmount, targetDate, category, description, monthlyTarget } = req.body;

    if (title) goal.title = title;
    if (targetAmount) goal.targetAmount = targetAmount;
    if (targetDate) goal.targetDate = targetDate;
    if (category) goal.category = category;
    if (description) goal.description = description;
    if (monthlyTarget) goal.monthlyTarget = monthlyTarget;

    // Recalculate progress
    goal.progress = goal.targetAmount > 0 ? Math.round((goal.currentAmount / goal.targetAmount) * 100) : 0;
    goal.updatedAt = new Date();

    await goal.save();

    res.json({
      success: true,
      message: "Goal updated successfully",
      goal
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating goal", error: error.message });
  }
});

app.delete("/api/goals/:id", authenticateToken, async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user.id });
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    goal.isActive = false;
    await goal.save();

    res.json({
      success: true,
      message: "Goal deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting goal", error: error.message });
  }
});

// ✅ Contributions Routes
app.get("/api/goals/:goalId/contributions", authenticateToken, async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.goalId, userId: req.user.id });
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    const contributions = await Contribution.find({ goalId: req.params.goalId }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      contributions
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching contributions", error: error.message });
  }
});

app.post("/api/goals/:goalId/contributions", authenticateToken, async (req, res) => {
  try {
    const { amount, type, description, paymentMethod } = req.body;

    const goal = await Goal.findOne({ _id: req.params.goalId, userId: req.user.id });
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    const contribution = new Contribution({
      userId: req.user.id,
      goalId: req.params.goalId,
      amount,
      type,
      description,
      paymentMethod
    });

    await contribution.save();

    // Update goal's current amount and progress
    goal.currentAmount += amount;
    goal.progress = goal.targetAmount > 0 ? Math.round((goal.currentAmount / goal.targetAmount) * 100) : 0;
    goal.updatedAt = new Date();
    await goal.save();

    res.status(201).json({
      success: true,
      message: "Contribution added successfully",
      contribution,
      updatedGoal: goal
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding contribution", error: error.message });
  }
});

// ✅ Reports Routes (Scam/Fraud Reports)
app.get("/api/reports", async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    
    // Auto-fix old records missing address
    for (const r of reports) {
      if (!r.address && r.latitude && r.longitude) {
        const { address, city } = await getReadableAddress(r.latitude, r.longitude);
        r.address = address;
        r.city = city;
        await r.save();
      }
    }

    res.json({
      success: true,
      reports
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports", error: error.message });
  }
});

app.post("/api/reports", async (req, res) => {
  try {
    const { type, description, contactInfo, latitude, longitude, address, city } = req.body;

    let finalAddress = address;
    let finalCity = city;

    // Auto-fill address if missing but coordinates provided
    if (!address && latitude && longitude) {
      const geoResult = await getReadableAddress(latitude, longitude);
      finalAddress = geoResult.address;
      finalCity = geoResult.city;
    }

    const report = new Report({
      userId: req.user?.id, // Optional, can be anonymous
      type,
      description,
      contactInfo,
      address: finalAddress,
      city: finalCity,
      latitude,
      longitude
    });

    await report.save();

    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      report
    });
  } catch (error) {
    res.status(500).json({ message: "Error saving report", error: error.message });
  }
});

app.get("/api/reports/:id", async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json({
      success: true,
      report
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching report", error: error.message });
  }
});

app.delete("/api/reports/:id", async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Report deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting report", error: error.message });
  }
});

// ✅ Security Analysis Routes (URL/Hash/Email Analysis)
const VT_API_KEY = process.env.VT_API_KEY;

const redFlagDomains = [
  "xyz", "tk", "ml", "phishing.com", "scamlink.net", "secure-login.com",
  "bank-secure-update.com", "login-alert.net", "verify-payment.net",
  "signin-now.com", "customer-support-online.com", "secure-access.cloud"
];

const suspiciousEmails = [
  "support@paypal.verify.com", "admin@updatemybank.ru", "secure@m1crosoft.com",
  "verify@paypa1.com", "help@goog1e.com", "alerts@chase-online-update.com",
  "billing@netfIix.com"
];

const phishingKeywords = [
  "urgent", "verify account", "suspended", "click here", "act now",
  "limited time", "congratulations", "you've won", "claim now",
  "update payment", "confirm identity", "security alert", "unusual activity",
  "account locked", "expires today", "final notice", "immediate action",
  "verify now", "account closure", "refund pending", "tax refund", "free gift"
];

app.post("/api/security/analyze-url", async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    let riskScore = 0;
    let threats = [];
    let analysis = "";
    let recommendation = "";

    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();
      
      // Check against red flag domains
      const isDangerous = redFlagDomains.some(flag => domain.includes(flag));
      if (isDangerous) {
        riskScore += 40;
        threats.push("Suspicious domain extension");
      }

      // Check for common phishing patterns
      const hasPhishingPattern = phishingKeywords.some(keyword => 
        url.toLowerCase().includes(keyword)
      );
      if (hasPhishingPattern) {
        riskScore += 30;
        threats.push("Contains phishing keywords");
      }

      // Check URL structure
      if (urlObj.pathname.includes('verify') || urlObj.pathname.includes('secure')) {
        riskScore += 20;
        threats.push("Suspicious URL path");
      }

      // Use VirusTotal API if available
      if (VT_API_KEY) {
        try {
          const vtResponse = await fetch(`https://www.virustotal.com/vtapi/v2/url/report?apikey=${VT_API_KEY}&resource=${encodeURIComponent(url)}`);
          const vtData = await vtResponse.json();
          
          if (vtData.positives > 0) {
            riskScore += Math.min(vtData.positives * 10, 50);
            threats.push(`Detected by ${vtData.positives} security vendors`);
          }
        } catch (vtError) {
          console.log("VirusTotal API error:", vtError.message);
        }
      }

      // Generate analysis and recommendation
      if (riskScore >= 70) {
        analysis = "HIGH RISK: This URL shows multiple indicators of being malicious or fraudulent.";
        recommendation = "Do not visit this URL. Report it if received via email or message.";
      } else if (riskScore >= 40) {
        analysis = "MEDIUM RISK: This URL has some suspicious characteristics.";
        recommendation = "Exercise caution. Verify the source before clicking.";
      } else if (riskScore >= 20) {
        analysis = "LOW RISK: Minor suspicious elements detected.";
        recommendation = "Generally safe, but remain vigilant for any unusual behavior.";
      } else {
        analysis = "LOW RISK: No immediate threats detected.";
        recommendation = "URL appears safe, but always practice safe browsing.";
      }

    } catch (urlError) {
      riskScore = 80;
      threats.push("Invalid URL format");
      analysis = "INVALID URL: The provided URL is malformed.";
      recommendation = "Do not attempt to visit this URL.";
    }

    // Save analysis
    const securityAnalysis = new SecurityAnalysis({
      userId: req.user?.id,
      type: 'url',
      input: url,
      results: {
        riskScore: Math.min(riskScore, 100),
        threats,
        analysis,
        recommendation
      },
      analysisEngine: 'FinGuard Security Scanner',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await securityAnalysis.save();

    res.json({
      success: true,
      analysis: {
        riskScore: Math.min(riskScore, 100),
        threats,
        analysis,
        recommendation
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Error analyzing URL", error: error.message });
  }
});

app.post("/api/security/analyze-email", async (req, res) => {
  try {
    const { emailContent, senderEmail, subject } = req.body;
    
    let riskScore = 0;
    let threats = [];
    let analysis = "";
    let recommendation = "";

    // Check sender email
    if (senderEmail) {
      const isSuspicious = suspiciousEmails.some(sus => 
        senderEmail.toLowerCase().includes(sus.toLowerCase())
      );
      if (isSuspicious) {
        riskScore += 50;
        threats.push("Sender email matches known phishing patterns");
      }
    }

    // Check subject and content for phishing keywords
    const contentToCheck = `${subject || ''} ${emailContent || ''}`.toLowerCase();
    const keywordMatches = phishingKeywords.filter(keyword => 
      contentToCheck.includes(keyword)
    );

    if (keywordMatches.length > 0) {
      riskScore += Math.min(keywordMatches.length * 15, 60);
      threats.push(`Contains ${keywordMatches.length} phishing keywords: ${keywordMatches.join(', ')}`);
    }

    // Check for urgency indicators
    const urgencyWords = ['urgent', 'immediate', 'expires', 'act now', 'limited time'];
    const urgencyCount = urgencyWords.filter(word => contentToCheck.includes(word)).length;
    if (urgencyCount > 1) {
      riskScore += 25;
      threats.push("Multiple urgency indicators detected");
    }

    // Generate analysis
    if (riskScore >= 70) {
      analysis = "HIGH RISK: This email shows strong indicators of being a phishing attempt.";
      recommendation = "Do not click any links or download attachments. Report as spam/phishing.";
    } else if (riskScore >= 40) {
      analysis = "MEDIUM RISK: This email has suspicious characteristics.";
      recommendation = "Exercise extreme caution. Verify sender through alternative means before taking any action.";
    } else if (riskScore >= 20) {
      analysis = "LOW RISK: Some suspicious elements detected.";
      recommendation = "Be cautious with links and attachments. When in doubt, contact the sender directly.";
    } else {
      analysis = "LOW RISK: No immediate phishing indicators detected.";
      recommendation = "Email appears legitimate, but always remain vigilant.";
    }

    // Save analysis
    const securityAnalysis = new SecurityAnalysis({
      userId: req.user?.id,
      type: 'email',
      input: JSON.stringify({ senderEmail, subject, contentLength: emailContent?.length || 0 }),
      results: {
        riskScore: Math.min(riskScore, 100),
        threats,
        analysis,
        recommendation
      },
      analysisEngine: 'FinGuard Email Scanner',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await securityAnalysis.save();

    res.json({
      success: true,
      analysis: {
        riskScore: Math.min(riskScore, 100),
        threats,
        analysis,
        recommendation,
        keywordMatches
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Error analyzing email", error: error.message });
  }
});

// ✅ Notifications Routes
app.get("/api/notifications", authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({
      success: true,
      notifications
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error: error.message });
  }
});

app.put("/api/notifications/:id/read", authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.json({
      success: true,
      message: "Notification marked as read"
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating notification", error: error.message });
  }
});

// ✅ Admin Routes (for data seeding and management)
app.post("/api/admin/seed", async (req, res) => {
  try {
    const { type, data } = req.body;
    
    if (!type || !data) {
      return res.status(400).json({ message: "Type and data are required" });
    }

    let result;
    
    switch (type) {
      case 'lessons':
        await Lesson.deleteMany({});
        result = await Lesson.insertMany(data);
        break;
      case 'quizzes':
        await Quiz.deleteMany({});
        result = await Quiz.insertMany(data);
        break;
      case 'scenarios':
        await Scenario.deleteMany({});
        result = await Scenario.insertMany(data);
        break;
      case 'courses':
        await Course.deleteMany({});
        result = await Course.insertMany(data);
        break;
      default:
        return res.status(400).json({ message: "Invalid data type" });
    }

    res.json({
      success: true,
      message: `${type} data seeded successfully`,
      count: result.length
    });
  } catch (error) {
    res.status(500).json({ message: "Error seeding data", error: error.message });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "FinGuard Unified Server is running",
    timestamp: new Date().toISOString()
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 FinGuard Unified Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: Connected to MongoDB`);
  console.log(`🔐 JWT Secret: ${JWT_SECRET.substring(0, 10)}...`);
});

module.exports = app;