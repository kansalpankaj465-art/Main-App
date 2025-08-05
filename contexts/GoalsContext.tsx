import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { 
  getAllGoals, 
  createGoal as createGoalAPI, 
  updateGoal as updateGoalAPI, 
  deleteGoal as deleteGoalAPI,
  addContribution as addContributionAPI,
  getGoalContributions,
  calculateGoalProgress,
  getGoalInsights
} from '../redux/services/operations/goalsServices';

export interface Goal {
  _id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  monthlyTarget: number;
  progress: number;
  createdDate: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Contribution {
  _id: string;
  userId: string;
  goalId: string;
  amount: number;
  date: string;
  type: 'initial' | 'monthly' | 'bonus' | 'extra';
  description?: string;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: string;
}

interface GoalsContextType {
  goals: Goal[];
  contributions: Record<string, Contribution[]>;
  loading: boolean;
  error: string | null;
  
  // Goal operations
  fetchGoals: () => Promise<void>;
  addGoal: (goal: Omit<Goal, '_id' | 'userId' | 'progress' | 'createdDate' | 'createdAt' | 'updatedAt' | 'isActive' | 'currentAmount'>) => Promise<boolean>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<boolean>;
  deleteGoal: (id: string) => Promise<boolean>;
  
  // Contribution operations
  fetchContributions: (goalId: string) => Promise<void>;
  addContribution: (goalId: string, amount: number, type?: string, description?: string) => Promise<boolean>;
  
  // Utility functions
  getGoalById: (id: string) => Goal | undefined;
  getContributionsByGoalId: (goalId: string) => Contribution[];
  getGoalInsights: (goalId: string) => any;
  
  // Statistics
  getTotalGoalsValue: () => number;
  getCompletedGoalsCount: () => number;
  getActiveGoalsCount: () => number;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
};

interface GoalsProviderProps {
  children: ReactNode;
}

export const GoalsProvider: React.FC<GoalsProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [contributions, setContributions] = useState<Record<string, Contribution[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all goals from backend
  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dispatch(getAllGoals() as any);
      
      if (response.success) {
        // Transform backend goals to match frontend interface
        const transformedGoals = response.goals.map((goal: any) => ({
          ...goal,
          createdDate: goal.createdAt,
          progress: calculateGoalProgress(goal)
        }));
        
        setGoals(transformedGoals);
        console.log('✅ Goals fetched successfully:', transformedGoals.length);
      } else {
        throw new Error(response.error || 'Failed to fetch goals');
      }
    } catch (err: any) {
      console.error('❌ Error fetching goals:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add new goal
  const addGoal = async (goalData: Omit<Goal, '_id' | 'userId' | 'progress' | 'createdDate' | 'createdAt' | 'updatedAt' | 'isActive' | 'currentAmount'>) => {
    try {
      setLoading(true);
      setError(null);
      
      // Transform frontend goal data to backend format
      const backendGoalData = {
        title: goalData.title,
        targetAmount: goalData.targetAmount,
        targetDate: goalData.targetDate,
        category: goalData.category,
        description: goalData.description,
        monthlyTarget: goalData.monthlyTarget,
        priority: goalData.priority || 'medium'
      };
      
      const response = await dispatch(createGoalAPI(backendGoalData) as any);
      
      if (response.success) {
        // Add the new goal to local state
        const newGoal = {
          ...response.goal,
          createdDate: response.goal.createdAt,
          progress: calculateGoalProgress(response.goal)
        };
        
        setGoals(prev => [newGoal, ...prev]);
        console.log('✅ Goal created successfully');
        return true;
      } else {
        throw new Error(response.error || 'Failed to create goal');
      }
    } catch (err: any) {
      console.error('❌ Error creating goal:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update existing goal
  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dispatch(updateGoalAPI(id, updates) as any);
      
      if (response.success) {
        // Update the goal in local state
        const updatedGoal = {
          ...response.goal,
          createdDate: response.goal.createdAt,
          progress: calculateGoalProgress(response.goal)
        };
        
        setGoals(prev => prev.map(goal => 
          goal._id === id ? updatedGoal : goal
        ));
        
        console.log('✅ Goal updated successfully');
        return true;
      } else {
        throw new Error(response.error || 'Failed to update goal');
      }
    } catch (err: any) {
      console.error('❌ Error updating goal:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete goal
  const deleteGoal = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dispatch(deleteGoalAPI(id) as any);
      
      if (response.success) {
        // Remove the goal from local state
        setGoals(prev => prev.filter(goal => goal._id !== id));
        
        // Also remove its contributions
        setContributions(prev => {
          const newContributions = { ...prev };
          delete newContributions[id];
          return newContributions;
        });
        
        console.log('✅ Goal deleted successfully');
        return true;
      } else {
        throw new Error(response.error || 'Failed to delete goal');
      }
    } catch (err: any) {
      console.error('❌ Error deleting goal:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch contributions for a specific goal
  const fetchContributions = async (goalId: string) => {
    try {
      const response = await dispatch(getGoalContributions(goalId) as any);
      
      if (response.success) {
        setContributions(prev => ({
          ...prev,
          [goalId]: response.contributions
        }));
        console.log('✅ Contributions fetched successfully');
      } else {
        throw new Error(response.error || 'Failed to fetch contributions');
      }
    } catch (err: any) {
      console.error('❌ Error fetching contributions:', err);
      setError(err.message);
    }
  };

  // Add contribution to goal
  const addContribution = async (goalId: string, amount: number, type: string = 'extra', description?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const contributionData = {
        amount,
        type,
        description
      };
      
      const response = await dispatch(addContributionAPI(goalId, contributionData) as any);
      
      if (response.success) {
        // Update contributions in local state
        setContributions(prev => ({
          ...prev,
          [goalId]: [response.contribution, ...(prev[goalId] || [])]
        }));
        
        // Update the goal's current amount and progress
        if (response.updatedGoal) {
          const updatedGoal = {
            ...response.updatedGoal,
            createdDate: response.updatedGoal.createdAt,
            progress: calculateGoalProgress(response.updatedGoal)
          };
          
          setGoals(prev => prev.map(goal => 
            goal._id === goalId ? updatedGoal : goal
          ));
        }
        
        console.log('✅ Contribution added successfully');
        return true;
      } else {
        throw new Error(response.error || 'Failed to add contribution');
      }
    } catch (err: any) {
      console.error('❌ Error adding contribution:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Utility functions
  const getGoalById = (id: string): Goal | undefined => {
    return goals.find(goal => goal._id === id);
  };

  const getContributionsByGoalId = (goalId: string): Contribution[] => {
    return contributions[goalId] || [];
  };

  const getGoalInsightsById = (goalId: string) => {
    const goal = getGoalById(goalId);
    if (!goal) return null;
    
    return getGoalInsights(goal);
  };

  // Statistics
  const getTotalGoalsValue = (): number => {
    return goals.reduce((total, goal) => total + goal.targetAmount, 0);
  };

  const getCompletedGoalsCount = (): number => {
    return goals.filter(goal => goal.progress >= 100).length;
  };

  const getActiveGoalsCount = (): number => {
    return goals.filter(goal => goal.isActive && goal.progress < 100).length;
  };

  // Load goals on component mount
  useEffect(() => {
    fetchGoals();
  }, []);

  const contextValue: GoalsContextType = {
    goals,
    contributions,
    loading,
    error,
    
    // Goal operations
    fetchGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    
    // Contribution operations
    fetchContributions,
    addContribution,
    
    // Utility functions
    getGoalById,
    getContributionsByGoalId,
    getGoalInsights: getGoalInsightsById,
    
    // Statistics
    getTotalGoalsValue,
    getCompletedGoalsCount,
    getActiveGoalsCount,
  };

  return (
    <GoalsContext.Provider value={contextValue}>
      {children}
    </GoalsContext.Provider>
  );
};
