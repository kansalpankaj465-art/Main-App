// Updated API configuration for FinGuard Unified Server
// Check if we're running in development or production
const isDev = process.env.NODE_ENV !== "production";

// Use unified server for all API calls
const BASE_URL = isDev
  ? "http://localhost:4000/api" // Development - unified server
  : "https://your-production-api.com/api"; // Production - update this when deploying

console.log("API Base URL:", BASE_URL);

// AUTHENTICATION API
export const authApi = {
  POST_SIGNUP_USER_API: BASE_URL + "/auth/signup",
  POST_LOGIN_USER_API: BASE_URL + "/auth/login",
  POST_LOGOUT_USER_API: BASE_URL + "/auth/logout",
  POST_FORGOT_PASSWORD_API: BASE_URL + "/auth/forgot-password",
  POST_RESET_PASSWORD_API: BASE_URL + "/auth/reset-password",
  GET_CURRENT_USER_API: BASE_URL + "/users/currentuser",
  PUT_UPDATE_PROFILE_API: BASE_URL + "/users/profile",
};

// EDUCATIONAL CONTENT API
export const contentApi = {
  GET_LESSONS_API: BASE_URL + "/lessons",
  GET_LESSON_BY_ID_API: BASE_URL + "/lessons", // append /:id
  GET_COURSES_API: BASE_URL + "/courses",
  GET_COURSE_BY_ID_API: BASE_URL + "/courses", // append /:id
  GET_QUIZZES_API: BASE_URL + "/quizzes",
  GET_QUIZ_BY_ID_API: BASE_URL + "/quizzes", // append /:id
  POST_SUBMIT_QUIZ_API: BASE_URL + "/quizzes", // append /:id/submit
};

// SCENARIOS API
export const scenarioApi = {
  GET_SCENARIOS_API: BASE_URL + "/scenarios",
  GET_SCENARIO_BY_ID_API: BASE_URL + "/scenarios", // append /:id
  POST_SUBMIT_SCENARIO_API: BASE_URL + "/scenarios", // append /:id/submit
};

// PROGRESS TRACKING API
export const progressApi = {
  GET_PROGRESS_API: BASE_URL + "/progress",
  GET_DASHBOARD_API: BASE_URL + "/progress/dashboard",
};

// FINANCIAL GOALS API
export const goalsApi = {
  GET_GOALS_API: BASE_URL + "/goals",
  POST_CREATE_GOAL_API: BASE_URL + "/goals",
  PUT_UPDATE_GOAL_API: BASE_URL + "/goals", // append /:id
  DELETE_GOAL_API: BASE_URL + "/goals", // append /:id
  GET_CONTRIBUTIONS_API: BASE_URL + "/goals", // append /:goalId/contributions
  POST_ADD_CONTRIBUTION_API: BASE_URL + "/goals", // append /:goalId/contributions
};

// REPORTS & SECURITY API
export const securityApi = {
  GET_REPORTS_API: BASE_URL + "/reports",
  POST_SUBMIT_REPORT_API: BASE_URL + "/reports",
  GET_REPORT_BY_ID_API: BASE_URL + "/reports", // append /:id
  DELETE_REPORT_API: BASE_URL + "/reports", // append /:id
  POST_ANALYZE_URL_API: BASE_URL + "/security/analyze-url",
  POST_ANALYZE_EMAIL_API: BASE_URL + "/security/analyze-email",
};

// NOTIFICATIONS API
export const notificationApi = {
  GET_NOTIFICATIONS_API: BASE_URL + "/notifications",
  PUT_MARK_READ_API: BASE_URL + "/notifications", // append /:id/read
};

// LEGACY COMPATIBILITY - Keep for gradual migration
export const userApi = {
  GET_CURRENT_LOGGED_USER_API: BASE_URL + "/users/currentuser",
};

// ADMIN API
export const adminApi = {
  POST_SEED_DATA_API: BASE_URL + "/admin/seed",
};

// Health check
export const healthApi = {
  GET_HEALTH_API: BASE_URL + "/health",
};
