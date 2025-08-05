const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database connection
const MONGO_URI = process.env.MONGODB_URI || 
  "mongodb+srv://nishantmanocha885:Yic2Wxl1A7iBluFB@cluster1.r4mvn.mongodb.net/finguard";

// Import schemas (copy the schemas from unified-server.js)
const lessonSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  courseId: { type: String, ref: 'Course' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  duration: { type: Number, required: true },
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

const quizSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ["fraud", "financial"], required: true },
  difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
  estimatedTime: { type: Number, required: true },
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
  timeLimit: { type: Number },
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

const courseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  color: { type: String, required: true },
  icon: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  rating: { type: Number, min: 0, max: 5 },
  totalDuration: { type: Number, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create models
const Lesson = mongoose.model('Lesson', lessonSchema);
const Quiz = mongoose.model('Quiz', quizSchema);
const Scenario = mongoose.model('Scenario', scenarioSchema);
const Course = mongoose.model('Course', courseSchema);

// Helper function to read and parse data files
function readDataFile(filename) {
  try {
    const filePath = path.join(__dirname, '..', 'data', filename);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Remove TypeScript imports/exports and parse
    const cleanContent = content
      .replace(/^import.*$/gm, '')
      .replace(/^export.*$/gm, '')
      .replace(/export\s+const\s+(\w+)\s*=/, 'const $1 =')
      .replace(/export\s+interface.*$/gm, '');
    
    // Use eval to parse the data (in production, use a proper parser)
    const sandbox = { require, console };
    const vm = require('vm');
    const context = vm.createContext(sandbox);
    vm.runInContext(cleanContent, context);
    
    return context;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error.message);
    return null;
  }
}

// Data transformation functions
function transformLessonsData(lessonsData) {
  const lessons = [];
  
  // Process lessons from lessonsData.ts
  if (lessonsData.lessonsData && lessonsData.lessonsData.en) {
    lessonsData.lessonsData.en.forEach((lesson, index) => {
      lessons.push({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        content: lesson.description, // Use description as content
        category: 'fraud-awareness',
        duration: parseInt(lesson.duration) || 5,
        order: index + 1,
        keyTakeaways: [],
        audioUrl: lesson.audio ? lesson.audio.toString() : null,
        difficulty: lesson.difficulty || 'Beginner',
        language: 'en',
        quiz: lesson.quiz || []
      });
    });
  }
  
  // Process lessons from lessons.ts
  if (lessonsData.lessons) {
    lessonsData.lessons.forEach((lesson, index) => {
      lessons.push({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        content: lesson.content,
        category: lesson.category,
        duration: lesson.duration,
        order: lesson.order,
        keyTakeaways: lesson.keyTakeaways || [],
        imageUrl: lesson.imageUrl,
        difficulty: lesson.difficulty || 'Beginner',
        language: 'en'
      });
    });
  }
  
  return lessons;
}

function transformQuizzesData(quizzesData) {
  if (!quizzesData.quizzes) return [];
  
  return quizzesData.quizzes.map(quiz => ({
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    category: quiz.category,
    difficulty: quiz.difficulty,
    estimatedTime: quiz.estimatedTime,
    questions: quiz.questions
  }));
}

function transformScenariosData(scenariosData) {
  if (!scenariosData.scenarios) return [];
  
  return scenariosData.scenarios.map(scenario => ({
    id: scenario.id,
    title: scenario.title,
    description: scenario.description,
    situation: scenario.situation,
    imageUrl: scenario.imageUrl,
    category: scenario.category,
    difficulty: scenario.difficulty,
    timeLimit: scenario.timeLimit,
    choices: scenario.choices,
    learningObjective: scenario.learningObjective,
    relatedLessonId: scenario.relatedLessonId
  }));
}

// Sample courses data
const sampleCourses = [
  {
    id: 'fraud-detection-basics',
    title: 'Fraud Detection Basics',
    description: 'Learn the fundamentals of identifying and preventing fraud',
    color: '#FF6B6B',
    icon: 'shield',
    difficulty: 'Beginner',
    rating: 4.5,
    totalDuration: 120,
    category: 'fraud-awareness'
  },
  {
    id: 'financial-security',
    title: 'Financial Security',
    description: 'Protect your finances from scams and fraud',
    color: '#4ECDC4',
    icon: 'lock',
    difficulty: 'Intermediate',
    rating: 4.7,
    totalDuration: 180,
    category: 'financial-security'
  },
  {
    id: 'advanced-threat-detection',
    title: 'Advanced Threat Detection',
    description: 'Advanced techniques for detecting sophisticated threats',
    color: '#45B7D1',
    icon: 'eye',
    difficulty: 'Advanced',
    rating: 4.8,
    totalDuration: 240,
    category: 'advanced-security'
  }
];

// Main seeding function
async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      Lesson.deleteMany({}),
      Quiz.deleteMany({}),
      Scenario.deleteMany({}),
      Course.deleteMany({})
    ]);
    console.log('✅ Existing data cleared');

    // Seed Courses
    console.log('📚 Seeding courses...');
    const courses = await Course.insertMany(sampleCourses);
    console.log(`✅ Seeded ${courses.length} courses`);

    // Read and process data files
    console.log('📖 Reading data files...');
    
    // Process lessons
    const lessonsData1 = readDataFile('lessonsData.ts');
    const lessonsData2 = readDataFile('lessons.ts');
    
    let allLessons = [];
    if (lessonsData1) {
      allLessons = allLessons.concat(transformLessonsData(lessonsData1));
    }
    if (lessonsData2) {
      allLessons = allLessons.concat(transformLessonsData(lessonsData2));
    }
    
    if (allLessons.length > 0) {
      console.log('📝 Seeding lessons...');
      const lessons = await Lesson.insertMany(allLessons);
      console.log(`✅ Seeded ${lessons.length} lessons`);
    }

    // Process quizzes
    const quizzesData = readDataFile('quizData.ts');
    if (quizzesData) {
      console.log('❓ Seeding quizzes...');
      const transformedQuizzes = transformQuizzesData(quizzesData);
      if (transformedQuizzes.length > 0) {
        const quizzes = await Quiz.insertMany(transformedQuizzes);
        console.log(`✅ Seeded ${quizzes.length} quizzes`);
      }
    }

    // Process scenarios
    const scenariosData = readDataFile('scenarios.ts');
    if (scenariosData) {
      console.log('🎭 Seeding scenarios...');
      const transformedScenarios = transformScenariosData(scenariosData);
      if (transformedScenarios.length > 0) {
        const scenarios = await Scenario.insertMany(transformedScenarios);
        console.log(`✅ Seeded ${scenarios.length} scenarios`);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    
    // Print summary
    const counts = await Promise.all([
      Course.countDocuments(),
      Lesson.countDocuments(),
      Quiz.countDocuments(),
      Scenario.countDocuments()
    ]);
    
    console.log('\n📊 Seeding Summary:');
    console.log(`   Courses: ${counts[0]}`);
    console.log(`   Lessons: ${counts[1]}`);
    console.log(`   Quizzes: ${counts[2]}`);
    console.log(`   Scenarios: ${counts[3]}`);
    console.log(`   Total: ${counts.reduce((a, b) => a + b, 0)} items`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Alternative manual seeding for specific data types
async function seedManualData() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Manual lessons data (based on the structure seen in the files)
    const manualLessons = [
      {
        id: 'otp-scam-awareness',
        title: 'OTP Scam Awareness',
        description: 'Learn how to identify and protect yourself from OTP scams and fake verification calls.',
        content: 'OTP (One-Time Password) scams are becoming increasingly common. Scammers often pose as bank representatives or service providers and ask for your OTP under various pretexts. Remember: legitimate organizations will NEVER ask for your OTP over phone calls, SMS, or emails. Always verify the authenticity of any request before sharing sensitive information.',
        category: 'fraud-awareness',
        duration: 5,
        order: 1,
        keyTakeaways: [
          'Never share OTP with anyone over phone or email',
          'Banks never ask for OTP to cancel transactions',
          'Always verify caller identity through official channels',
          'Report suspicious calls to cyber crime helpline'
        ],
        difficulty: 'Beginner',
        language: 'en',
        quiz: [
          {
            id: 'q1',
            question: 'Should you share your OTP with someone claiming to be from your bank?',
            options: ['Yes', 'No'],
            correct: 1,
            explanation: 'Banks never ask for OTP over phone calls. This is always a scam attempt.'
          }
        ]
      },
      {
        id: 'phishing-email-detection',
        title: 'Phishing Email Detection',
        description: 'Master the art of identifying phishing emails and protecting your personal information.',
        content: 'Phishing emails are fraudulent messages designed to steal your personal information, passwords, or financial details. They often mimic legitimate organizations and create urgency to make you act quickly without thinking. Learn to spot red flags such as suspicious sender addresses, urgent language, spelling errors, and requests for sensitive information.',
        category: 'fraud-awareness',
        duration: 7,
        order: 2,
        keyTakeaways: [
          'Check sender email address carefully',
          'Look for spelling and grammar errors',
          'Verify links before clicking',
          'Never provide sensitive information via email'
        ],
        difficulty: 'Beginner',
        language: 'en'
      },
      {
        id: 'social-engineering-tactics',
        title: 'Social Engineering Tactics',
        description: 'Understand how scammers manipulate human psychology to gain unauthorized access.',
        content: 'Social engineering is the art of manipulating people to divulge confidential information or perform actions that compromise security. Scammers use psychological tricks like creating false trust, urgency, fear, or authority to bypass security measures. Understanding these tactics helps you recognize and resist manipulation attempts.',
        category: 'fraud-awareness',
        duration: 10,
        order: 3,
        keyTakeaways: [
          'Recognize psychological manipulation tactics',
          'Verify identity through independent channels',
          'Take time to think before acting on urgent requests',
          'Trust your instincts when something feels wrong'
        ],
        difficulty: 'Intermediate',
        language: 'en'
      }
    ];

    console.log('🗑️  Clearing existing lessons...');
    await Lesson.deleteMany({});
    
    console.log('📝 Seeding manual lessons...');
    const lessons = await Lesson.insertMany(manualLessons);
    console.log(`✅ Seeded ${lessons.length} lessons manually`);

    // Manual quiz data
    const manualQuizzes = [
      {
        id: 'phishing-basics-quiz',
        title: 'Phishing Email Recognition',
        description: 'Test your ability to identify phishing attempts',
        category: 'fraud',
        difficulty: 'beginner',
        estimatedTime: 10,
        questions: [
          {
            id: 'q1',
            question: 'What is the most common sign of a phishing email?',
            options: [
              'Professional company logo',
              'Urgent language demanding immediate action',
              'Proper grammar and spelling',
              'Personalized greeting with your full name'
            ],
            correctAnswer: 1,
            explanation: 'Phishing emails often use urgent language to pressure you into acting quickly without thinking.'
          },
          {
            id: 'q2',
            question: 'You receive an email claiming to be from your bank asking you to verify your account. What should you do?',
            options: [
              'Click the link and enter your information',
              'Reply with your account details',
              'Contact your bank directly using their official phone number',
              'Forward the email to friends for advice'
            ],
            correctAnswer: 2,
            explanation: 'Always verify suspicious requests by contacting the organization directly through official channels.'
          }
        ]
      }
    ];

    console.log('🗑️  Clearing existing quizzes...');
    await Quiz.deleteMany({});
    
    console.log('❓ Seeding manual quizzes...');
    const quizzes = await Quiz.insertMany(manualQuizzes);
    console.log(`✅ Seeded ${quizzes.length} quizzes manually`);

    console.log('🎉 Manual seeding completed!');

  } catch (error) {
    console.error('❌ Error in manual seeding:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

// Run the appropriate seeding function
const seedType = process.argv[2] || 'auto';

if (seedType === 'manual') {
  seedManualData();
} else {
  seedDatabase();
}