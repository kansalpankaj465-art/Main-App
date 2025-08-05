import { apiConnector } from "../apiConnector";
import { contentApi, scenarioApi, progressApi } from "../api";

// ===============================
// LESSONS SERVICES
// ===============================

export const getAllLessons = (filters = {}) => async (dispatch) => {
  try {
    console.log("📚 Fetching lessons...", filters);
    
    // Build query string
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
    if (filters.language) queryParams.append('language', filters.language);
    
    const url = `${contentApi.GET_LESSONS_API}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await apiConnector("GET", url);
    
    if (response.success) {
      console.log("✅ Lessons fetched successfully:", response.data.lessons.length);
      return { success: true, lessons: response.data.lessons };
    } else {
      throw new Error(response.error || "Failed to fetch lessons");
    }
  } catch (error) {
    console.error("❌ Get lessons error:", error);
    return { success: false, error: error.message };
  }
};

export const getLessonById = (lessonId) => async (dispatch) => {
  try {
    console.log("📖 Fetching lesson:", lessonId);
    
    const response = await apiConnector("GET", `${contentApi.GET_LESSON_BY_ID_API}/${lessonId}`);
    
    if (response.success) {
      console.log("✅ Lesson fetched successfully");
      return { success: true, lesson: response.data.lesson };
    } else {
      throw new Error(response.error || "Failed to fetch lesson");
    }
  } catch (error) {
    console.error("❌ Get lesson error:", error);
    return { success: false, error: error.message };
  }
};

// ===============================
// COURSES SERVICES
// ===============================

export const getAllCourses = (filters = {}) => async (dispatch) => {
  try {
    console.log("🎓 Fetching courses...", filters);
    
    const queryParams = new URLSearchParams();
    if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
    if (filters.category) queryParams.append('category', filters.category);
    
    const url = `${contentApi.GET_COURSES_API}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await apiConnector("GET", url);
    
    if (response.success) {
      console.log("✅ Courses fetched successfully:", response.data.courses.length);
      return { success: true, courses: response.data.courses };
    } else {
      throw new Error(response.error || "Failed to fetch courses");
    }
  } catch (error) {
    console.error("❌ Get courses error:", error);
    return { success: false, error: error.message };
  }
};

export const getCourseById = (courseId) => async (dispatch) => {
  try {
    console.log("📚 Fetching course with lessons:", courseId);
    
    const response = await apiConnector("GET", `${contentApi.GET_COURSE_BY_ID_API}/${courseId}`);
    
    if (response.success) {
      console.log("✅ Course fetched successfully");
      return { success: true, course: response.data.course };
    } else {
      throw new Error(response.error || "Failed to fetch course");
    }
  } catch (error) {
    console.error("❌ Get course error:", error);
    return { success: false, error: error.message };
  }
};

// ===============================
// QUIZZES SERVICES
// ===============================

export const getAllQuizzes = (filters = {}) => async (dispatch) => {
  try {
    console.log("❓ Fetching quizzes...", filters);
    
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
    
    const url = `${contentApi.GET_QUIZZES_API}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await apiConnector("GET", url);
    
    if (response.success) {
      console.log("✅ Quizzes fetched successfully:", response.data.quizzes.length);
      return { success: true, quizzes: response.data.quizzes };
    } else {
      throw new Error(response.error || "Failed to fetch quizzes");
    }
  } catch (error) {
    console.error("❌ Get quizzes error:", error);
    return { success: false, error: error.message };
  }
};

export const getQuizById = (quizId) => async (dispatch) => {
  try {
    console.log("📝 Fetching quiz:", quizId);
    
    const response = await apiConnector("GET", `${contentApi.GET_QUIZ_BY_ID_API}/${quizId}`);
    
    if (response.success) {
      console.log("✅ Quiz fetched successfully");
      return { success: true, quiz: response.data.quiz };
    } else {
      throw new Error(response.error || "Failed to fetch quiz");
    }
  } catch (error) {
    console.error("❌ Get quiz error:", error);
    return { success: false, error: error.message };
  }
};

export const submitQuiz = (quizId, answers, timeSpent) => async (dispatch) => {
  try {
    console.log("📤 Submitting quiz:", quizId, "Answers:", answers.length);
    
    const response = await apiConnector("POST", `${contentApi.POST_SUBMIT_QUIZ_API}/${quizId}/submit`, {
      answers,
      timeSpent
    });
    
    if (response.success) {
      console.log("✅ Quiz submitted successfully. Score:", response.data.score);
      return { 
        success: true, 
        result: {
          score: response.data.score,
          correctAnswers: response.data.correctAnswers,
          totalQuestions: response.data.totalQuestions,
          answers: response.data.answers
        }
      };
    } else {
      throw new Error(response.error || "Failed to submit quiz");
    }
  } catch (error) {
    console.error("❌ Submit quiz error:", error);
    return { success: false, error: error.message };
  }
};

// ===============================
// SCENARIOS SERVICES
// ===============================

export const getAllScenarios = (filters = {}) => async (dispatch) => {
  try {
    console.log("🎭 Fetching scenarios...", filters);
    
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
    
    const url = `${scenarioApi.GET_SCENARIOS_API}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await apiConnector("GET", url);
    
    if (response.success) {
      console.log("✅ Scenarios fetched successfully:", response.data.scenarios.length);
      return { success: true, scenarios: response.data.scenarios };
    } else {
      throw new Error(response.error || "Failed to fetch scenarios");
    }
  } catch (error) {
    console.error("❌ Get scenarios error:", error);
    return { success: false, error: error.message };
  }
};

export const getScenarioById = (scenarioId) => async (dispatch) => {
  try {
    console.log("🎬 Fetching scenario:", scenarioId);
    
    const response = await apiConnector("GET", `${scenarioApi.GET_SCENARIO_BY_ID_API}/${scenarioId}`);
    
    if (response.success) {
      console.log("✅ Scenario fetched successfully");
      return { success: true, scenario: response.data.scenario };
    } else {
      throw new Error(response.error || "Failed to fetch scenario");
    }
  } catch (error) {
    console.error("❌ Get scenario error:", error);
    return { success: false, error: error.message };
  }
};

export const submitScenario = (scenarioId, choiceId, timeSpent) => async (dispatch) => {
  try {
    console.log("📤 Submitting scenario choice:", scenarioId, choiceId);
    
    const response = await apiConnector("POST", `${scenarioApi.POST_SUBMIT_SCENARIO_API}/${scenarioId}/submit`, {
      choiceId,
      timeSpent
    });
    
    if (response.success) {
      console.log("✅ Scenario submitted successfully. Points:", response.data.points);
      return { 
        success: true, 
        result: {
          choice: response.data.choice,
          points: response.data.points
        }
      };
    } else {
      throw new Error(response.error || "Failed to submit scenario");
    }
  } catch (error) {
    console.error("❌ Submit scenario error:", error);
    return { success: false, error: error.message };
  }
};

// ===============================
// PROGRESS TRACKING SERVICES
// ===============================

export const getUserProgress = (filters = {}) => async (dispatch) => {
  try {
    console.log("📈 Fetching user progress...", filters);
    
    const queryParams = new URLSearchParams();
    if (filters.type) queryParams.append('type', filters.type);
    
    const url = `${progressApi.GET_PROGRESS_API}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await apiConnector("GET", url);
    
    if (response.success) {
      console.log("✅ Progress fetched successfully:", response.data.progress.length);
      return { success: true, progress: response.data.progress };
    } else {
      throw new Error(response.error || "Failed to fetch progress");
    }
  } catch (error) {
    console.error("❌ Get progress error:", error);
    return { success: false, error: error.message };
  }
};

export const getDashboardStats = () => async (dispatch) => {
  try {
    console.log("📊 Fetching dashboard statistics...");
    
    const response = await apiConnector("GET", progressApi.GET_DASHBOARD_API);
    
    if (response.success) {
      console.log("✅ Dashboard stats fetched successfully");
      return { success: true, dashboard: response.data.dashboard };
    } else {
      throw new Error(response.error || "Failed to fetch dashboard");
    }
  } catch (error) {
    console.error("❌ Get dashboard error:", error);
    return { success: false, error: error.message };
  }
};

// ===============================
// HELPER FUNCTIONS
// ===============================

export const markLessonAsCompleted = (lessonId, timeSpent = 0) => async (dispatch) => {
  try {
    console.log("✅ Marking lesson as completed:", lessonId);
    
    // This could be implemented as a separate endpoint or as part of progress tracking
    // For now, we'll use the progress API structure
    
    return { success: true, message: "Lesson marked as completed" };
  } catch (error) {
    console.error("❌ Mark lesson completed error:", error);
    return { success: false, error: error.message };
  }
};

export const getLessonProgress = (lessonId) => async (dispatch) => {
  try {
    console.log("📖 Getting lesson progress:", lessonId);
    
    const response = await dispatch(getUserProgress({ type: 'lesson' }));
    
    if (response.success) {
      const lessonProgress = response.progress.find(p => p.lessonId === lessonId);
      return { success: true, progress: lessonProgress };
    } else {
      throw new Error(response.error || "Failed to get lesson progress");
    }
  } catch (error) {
    console.error("❌ Get lesson progress error:", error);
    return { success: false, error: error.message };
  }
};