// Simple integration test for FinGuard Unified Server
// Run with: node test-integration.js

const BASE_URL = "http://localhost:4000/api";

async function testAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    const data = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function runIntegrationTests() {
  console.log("🧪 Starting FinGuard Integration Tests...\n");

  let testsPassed = 0;
  let testsFailed = 0;
  let authToken = null;

  // Test 1: Health Check
  console.log("1️⃣ Testing Health Check...");
  const healthTest = await testAPI("/health");
  if (healthTest.success) {
    console.log("✅ Health check passed:", healthTest.data.message);
    testsPassed++;
  } else {
    console.log("❌ Health check failed:", healthTest.error);
    testsFailed++;
  }

  // Test 2: Get Lessons (No Auth Required)
  console.log("\n2️⃣ Testing Lessons API...");
  const lessonsTest = await testAPI("/lessons");
  if (lessonsTest.success && lessonsTest.data.lessons) {
    console.log(`✅ Lessons API passed: ${lessonsTest.data.lessons.length} lessons found`);
    testsPassed++;
  } else {
    console.log("❌ Lessons API failed:", lessonsTest.error || lessonsTest.data);
    testsFailed++;
  }

  // Test 3: Get Quizzes (No Auth Required)
  console.log("\n3️⃣ Testing Quizzes API...");
  const quizzesTest = await testAPI("/quizzes");
  if (quizzesTest.success && quizzesTest.data.quizzes) {
    console.log(`✅ Quizzes API passed: ${quizzesTest.data.quizzes.length} quizzes found`);
    testsPassed++;
  } else {
    console.log("❌ Quizzes API failed:", quizzesTest.error || quizzesTest.data);
    testsFailed++;
  }

  // Test 4: User Registration
  console.log("\n4️⃣ Testing User Registration...");
  const signupData = {
    firstName: "Test",
    lastName: "User",
    email: `test${Date.now()}@example.com`,
    password: "testPassword123"
  };
  
  const signupTest = await testAPI("/auth/signup", {
    method: 'POST',
    body: signupData
  });
  
  if (signupTest.success && signupTest.data.token) {
    console.log("✅ User registration passed");
    authToken = signupTest.data.token;
    testsPassed++;
  } else {
    console.log("❌ User registration failed:", signupTest.error || signupTest.data);
    testsFailed++;
  }

  // Test 5: Get Current User (Auth Required)
  if (authToken) {
    console.log("\n5️⃣ Testing Authenticated User API...");
    const userTest = await testAPI("/users/currentuser", {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (userTest.success && userTest.data.user) {
      console.log("✅ Authenticated user API passed:", userTest.data.user.email);
      testsPassed++;
    } else {
      console.log("❌ Authenticated user API failed:", userTest.error || userTest.data);
      testsFailed++;
    }

    // Test 6: Create Goal (Auth Required)
    console.log("\n6️⃣ Testing Goal Creation...");
    const goalData = {
      title: "Test Emergency Fund",
      targetAmount: 100000,
      targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      category: "emergency",
      description: "Test goal for integration testing",
      monthlyTarget: 8333
    };
    
    const goalTest = await testAPI("/goals", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: goalData
    });
    
    if (goalTest.success && goalTest.data.goal) {
      console.log("✅ Goal creation passed:", goalTest.data.goal.title);
      testsPassed++;
    } else {
      console.log("❌ Goal creation failed:", goalTest.error || goalTest.data);
      testsFailed++;
    }
  } else {
    console.log("\n5️⃣ ⚠️ Skipping authenticated tests (no auth token)");
    testsFailed += 2;
  }

  // Test 7: Submit Report (Optional Auth)
  console.log("\n7️⃣ Testing Report Submission...");
  const reportData = {
    type: "Test Report",
    description: "This is a test report for integration testing purposes",
    contactInfo: "test@example.com",
    address: "Test Address, Test City",
    latitude: 28.6139,
    longitude: 77.2090
  };
  
  const reportTest = await testAPI("/reports", {
    method: 'POST',
    headers: authToken ? {
      'Authorization': `Bearer ${authToken}`
    } : {},
    body: reportData
  });
  
  if (reportTest.success && reportTest.data.report) {
    console.log("✅ Report submission passed");
    testsPassed++;
  } else {
    console.log("❌ Report submission failed:", reportTest.error || reportTest.data);
    testsFailed++;
  }

  // Test 8: URL Analysis
  console.log("\n8️⃣ Testing URL Analysis...");
  const urlAnalysisTest = await testAPI("/security/analyze-url", {
    method: 'POST',
    body: {
      url: "https://example.com"
    }
  });
  
  if (urlAnalysisTest.success && urlAnalysisTest.data.analysis) {
    console.log("✅ URL analysis passed, risk score:", urlAnalysisTest.data.analysis.riskScore);
    testsPassed++;
  } else {
    console.log("❌ URL analysis failed:", urlAnalysisTest.error || urlAnalysisTest.data);
    testsFailed++;
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("🧪 INTEGRATION TEST RESULTS");
  console.log("=".repeat(50));
  console.log(`✅ Tests Passed: ${testsPassed}`);
  console.log(`❌ Tests Failed: ${testsFailed}`);
  console.log(`📊 Success Rate: ${Math.round((testsPassed / (testsPassed + testsFailed)) * 100)}%`);
  
  if (testsFailed === 0) {
    console.log("\n🎉 ALL TESTS PASSED! Integration is successful!");
  } else if (testsPassed > testsFailed) {
    console.log("\n⚠️ Most tests passed, but some issues need attention.");
  } else {
    console.log("\n❌ Integration has significant issues that need fixing.");
  }
  
  console.log("\n📋 Next Steps:");
  console.log("1. Update your React Native app to use the new API endpoints");
  console.log("2. Replace old server files with unified-server.js");
  console.log("3. Test all app functionality with the new backend");
  console.log("4. Deploy to production when ready");
}

// Check if fetch is available (for Node.js environments)
if (typeof fetch === 'undefined') {
  console.log("Installing node-fetch for testing...");
  try {
    global.fetch = require('node-fetch');
  } catch (error) {
    console.log("❌ node-fetch not available. Please install it:");
    console.log("npm install node-fetch");
    process.exit(1);
  }
}

// Run the tests
runIntegrationTests().catch(error => {
  console.error("❌ Test runner error:", error);
  process.exit(1);
});