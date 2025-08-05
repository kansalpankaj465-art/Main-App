import { apiConnector } from "../apiConnector";
import { goalsApi } from "../api";

// ===============================
// FINANCIAL GOALS SERVICES
// ===============================

export const getAllGoals = () => async (dispatch) => {
  try {
    console.log("💰 Fetching user goals...");
    
    const response = await apiConnector("GET", goalsApi.GET_GOALS_API);
    
    if (response.success) {
      console.log("✅ Goals fetched successfully:", response.data.goals.length);
      return { success: true, goals: response.data.goals };
    } else {
      throw new Error(response.error || "Failed to fetch goals");
    }
  } catch (error) {
    console.error("❌ Get goals error:", error);
    return { success: false, error: error.message };
  }
};

export const createGoal = (goalData) => async (dispatch) => {
  try {
    console.log("💰 Creating new goal...", goalData.title);
    
    const response = await apiConnector("POST", goalsApi.POST_CREATE_GOAL_API, goalData);
    
    if (response.success) {
      console.log("✅ Goal created successfully");
      return { success: true, goal: response.data.goal };
    } else {
      throw new Error(response.error || "Failed to create goal");
    }
  } catch (error) {
    console.error("❌ Create goal error:", error);
    return { success: false, error: error.message };
  }
};

export const updateGoal = (goalId, goalData) => async (dispatch) => {
  try {
    console.log("💰 Updating goal...", goalId);
    
    const response = await apiConnector("PUT", `${goalsApi.PUT_UPDATE_GOAL_API}/${goalId}`, goalData);
    
    if (response.success) {
      console.log("✅ Goal updated successfully");
      return { success: true, goal: response.data.goal };
    } else {
      throw new Error(response.error || "Failed to update goal");
    }
  } catch (error) {
    console.error("❌ Update goal error:", error);
    return { success: false, error: error.message };
  }
};

export const deleteGoal = (goalId) => async (dispatch) => {
  try {
    console.log("💰 Deleting goal...", goalId);
    
    const response = await apiConnector("DELETE", `${goalsApi.DELETE_GOAL_API}/${goalId}`);
    
    if (response.success) {
      console.log("✅ Goal deleted successfully");
      return { success: true, message: response.data.message };
    } else {
      throw new Error(response.error || "Failed to delete goal");
    }
  } catch (error) {
    console.error("❌ Delete goal error:", error);
    return { success: false, error: error.message };
  }
};

// ===============================
// CONTRIBUTIONS SERVICES
// ===============================

export const getGoalContributions = (goalId) => async (dispatch) => {
  try {
    console.log("💰 Fetching contributions for goal...", goalId);
    
    const response = await apiConnector("GET", `${goalsApi.GET_CONTRIBUTIONS_API}/${goalId}/contributions`);
    
    if (response.success) {
      console.log("✅ Contributions fetched successfully:", response.data.contributions.length);
      return { success: true, contributions: response.data.contributions };
    } else {
      throw new Error(response.error || "Failed to fetch contributions");
    }
  } catch (error) {
    console.error("❌ Get contributions error:", error);
    return { success: false, error: error.message };
  }
};

export const addContribution = (goalId, contributionData) => async (dispatch) => {
  try {
    console.log("💰 Adding contribution...", goalId, contributionData.amount);
    
    const response = await apiConnector("POST", `${goalsApi.POST_ADD_CONTRIBUTION_API}/${goalId}/contributions`, contributionData);
    
    if (response.success) {
      console.log("✅ Contribution added successfully");
      return { 
        success: true, 
        contribution: response.data.contribution,
        updatedGoal: response.data.updatedGoal 
      };
    } else {
      throw new Error(response.error || "Failed to add contribution");
    }
  } catch (error) {
    console.error("❌ Add contribution error:", error);
    return { success: false, error: error.message };
  }
};

// ===============================
// GOAL ANALYTICS & CALCULATIONS
// ===============================

export const calculateGoalProgress = (goal) => {
  try {
    if (!goal || !goal.targetAmount) return 0;
    
    const progress = goal.targetAmount > 0 
      ? Math.round((goal.currentAmount / goal.targetAmount) * 100) 
      : 0;
    
    return Math.min(progress, 100); // Cap at 100%
  } catch (error) {
    console.error("❌ Calculate goal progress error:", error);
    return 0;
  }
};

export const calculateTimeRemaining = (goal) => {
  try {
    if (!goal || !goal.targetDate) return null;
    
    const targetDate = new Date(goal.targetDate);
    const today = new Date();
    const timeDiff = targetDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return {
      days: daysRemaining,
      months: Math.ceil(daysRemaining / 30),
      years: Math.ceil(daysRemaining / 365),
      isOverdue: daysRemaining < 0
    };
  } catch (error) {
    console.error("❌ Calculate time remaining error:", error);
    return null;
  }
};

export const calculateMonthlyRequired = (goal) => {
  try {
    if (!goal || !goal.targetDate || !goal.targetAmount) return 0;
    
    const remaining = goal.targetAmount - (goal.currentAmount || 0);
    if (remaining <= 0) return 0;
    
    const timeRemaining = calculateTimeRemaining(goal);
    if (!timeRemaining || timeRemaining.months <= 0) return remaining;
    
    return Math.ceil(remaining / timeRemaining.months);
  } catch (error) {
    console.error("❌ Calculate monthly required error:", error);
    return 0;
  }
};

export const getGoalInsights = (goal) => {
  try {
    const progress = calculateGoalProgress(goal);
    const timeRemaining = calculateTimeRemaining(goal);
    const monthlyRequired = calculateMonthlyRequired(goal);
    
    let status = 'on-track';
    let message = 'Your goal is on track!';
    
    if (progress >= 100) {
      status = 'completed';
      message = 'Congratulations! Goal achieved!';
    } else if (timeRemaining && timeRemaining.isOverdue) {
      status = 'overdue';
      message = 'This goal is overdue. Consider extending the deadline.';
    } else if (monthlyRequired > (goal.monthlyTarget || 0) * 1.5) {
      status = 'challenging';
      message = 'You may need to increase monthly contributions to reach this goal.';
    } else if (progress > 75) {
      status = 'nearly-there';
      message = 'You\'re almost there! Keep up the great work!';
    }
    
    return {
      progress,
      timeRemaining,
      monthlyRequired,
      status,
      message,
      isAchievable: !timeRemaining?.isOverdue && monthlyRequired <= (goal.monthlyTarget || 0) * 2
    };
  } catch (error) {
    console.error("❌ Get goal insights error:", error);
    return {
      progress: 0,
      timeRemaining: null,
      monthlyRequired: 0,
      status: 'unknown',
      message: 'Unable to calculate insights',
      isAchievable: false
    };
  }
};

// ===============================
// GOAL TEMPLATES & PRESETS
// ===============================

export const getGoalTemplates = () => {
  return [
    {
      id: 'emergency-fund',
      title: 'Emergency Fund',
      description: '6 months of living expenses',
      category: 'emergency',
      suggestedAmount: 300000,
      suggestedMonths: 12,
      tips: [
        'Aim for 3-6 months of expenses',
        'Keep in a high-yield savings account',
        'Start with a small amount and build gradually'
      ]
    },
    {
      id: 'house-down-payment',
      title: 'House Down Payment',
      description: '20% down payment for home purchase',
      category: 'house',
      suggestedAmount: 1000000,
      suggestedMonths: 36,
      tips: [
        'Typical down payment is 10-20%',
        'Consider additional costs like registration',
        'Research home loan eligibility'
      ]
    },
    {
      id: 'vacation-fund',
      title: 'Dream Vacation',
      description: 'Save for that special trip',
      category: 'vacation',
      suggestedAmount: 150000,
      suggestedMonths: 12,
      tips: [
        'Book in advance for better deals',
        'Consider off-season travel',
        'Factor in all expenses: flights, hotels, food'
      ]
    },
    {
      id: 'wedding-fund',
      title: 'Wedding Fund',
      description: 'Your special day expenses',
      category: 'wedding',
      suggestedAmount: 800000,
      suggestedMonths: 18,
      tips: [
        'Create a detailed budget breakdown',
        'Book venues early for better rates',
        'Consider seasonal pricing variations'
      ]
    },
    {
      id: 'education-fund',
      title: 'Education Fund',
      description: 'Higher education or skill development',
      category: 'education',
      suggestedAmount: 500000,
      suggestedMonths: 24,
      tips: [
        'Research course fees and living costs',
        'Look into education loans and scholarships',
        'Consider online vs offline programs'
      ]
    }
  ];
};

export const createGoalFromTemplate = (template, customData = {}) => async (dispatch) => {
  try {
    console.log("💰 Creating goal from template...", template.id);
    
    const goalData = {
      title: customData.title || template.title,
      description: customData.description || template.description,
      category: template.category,
      targetAmount: customData.targetAmount || template.suggestedAmount,
      targetDate: customData.targetDate || new Date(Date.now() + (template.suggestedMonths * 30 * 24 * 60 * 60 * 1000)),
      monthlyTarget: customData.monthlyTarget || Math.ceil((customData.targetAmount || template.suggestedAmount) / template.suggestedMonths),
      priority: customData.priority || 'medium'
    };
    
    const response = await dispatch(createGoal(goalData));
    
    if (response.success) {
      console.log("✅ Goal created from template successfully");
      return { success: true, goal: response.goal };
    } else {
      throw new Error(response.error || "Failed to create goal from template");
    }
  } catch (error) {
    console.error("❌ Create goal from template error:", error);
    return { success: false, error: error.message };
  }
};