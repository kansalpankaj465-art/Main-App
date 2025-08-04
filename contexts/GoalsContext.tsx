import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Goal {
  id: number;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  monthlyTarget: number;
  progress: number;
  createdDate: string;
  description: string;
}

export interface Contribution {
  id: number;
  goalId: number;
  amount: number;
  date: string;
  type: 'initial' | 'monthly' | 'bonus' | 'extra';
}

interface GoalsContextType {
  goals: Goal[];
  contributions: Contribution[];
  addGoal: (goal: Omit<Goal, 'id' | 'progress' | 'createdDate'>) => void;
  updateGoal: (id: number, updates: Partial<Goal>) => void;
  deleteGoal: (id: number) => void;
  addContribution: (goalId: number, amount: number, type?: string) => void;
  getGoalById: (id: number) => Goal | undefined;
  getContributionsByGoalId: (goalId: number) => Contribution[];
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
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      title: 'Buy Dream House in Bangalore',
      targetAmount: 8000000,
      currentAmount: 2500000,
      targetDate: '2027-06-15',
      category: 'house',
      monthlyTarget: 114583,
      progress: 31,
      createdDate: '2024-01-15',
      description:
        'A beautiful 3BHK apartment in Whitefield, Bangalore with all modern amenities and good connectivity.',
    },
    {
      id: 2,
      title: 'Wedding Expenses',
      targetAmount: 1500000,
      currentAmount: 450000,
      targetDate: '2025-12-01',
      category: 'wedding',
      monthlyTarget: 52500,
      progress: 30,
      createdDate: '2024-01-10',
      description:
        'Complete wedding arrangements including venue, catering, photography, and decorations.',
    },
    {
      id: 3,
      title: 'Emergency Fund (6 months)',
      targetAmount: 500000,
      currentAmount: 400000,
      targetDate: '2024-08-01',
      category: 'emergency',
      monthlyTarget: 16667,
      progress: 80,
      createdDate: '2024-01-05',
      description:
        'Emergency fund to cover 6 months of living expenses for financial security.',
    },
  ]);

  const [contributions, setContributions] = useState<Contribution[]>([
    { id: 1, goalId: 1, amount: 500000, date: '2024-01-15', type: 'initial' },
    { id: 2, goalId: 1, amount: 100000, date: '2024-02-15', type: 'monthly' },
    { id: 3, goalId: 1, amount: 150000, date: '2024-03-15', type: 'bonus' },
    { id: 4, goalId: 2, amount: 200000, date: '2024-01-10', type: 'initial' },
    { id: 5, goalId: 2, amount: 50000, date: '2024-02-10', type: 'monthly' },
    { id: 6, goalId: 3, amount: 300000, date: '2024-01-05', type: 'initial' },
    { id: 7, goalId: 3, amount: 100000, date: '2024-02-05', type: 'monthly' },
  ]);

  const calculateProgress = (
    currentAmount: number,
    targetAmount: number
  ): number => {
    return Math.min(100, Math.round((currentAmount / targetAmount) * 100));
  };

  const calculateMonthlyTarget = (
    targetAmount: number,
    currentAmount: number,
    targetDate: string
  ): number => {
    const target = new Date(targetDate);
    const current = new Date();
    const monthsRemaining = Math.max(
      1,
      Math.ceil(
        (target.getTime() - current.getTime()) / (1000 * 60 * 60 * 24 * 30)
      )
    );
    const remainingAmount = targetAmount - currentAmount;
    return Math.ceil(remainingAmount / monthsRemaining);
  };

  const addGoal = (goalData: Omit<Goal, 'id' | 'progress' | 'createdDate'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: Date.now(),
      progress: calculateProgress(
        goalData.currentAmount,
        goalData.targetAmount
      ),
      createdDate: new Date().toISOString().split('T')[0],
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const updateGoal = (id: number, updates: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === id) {
          const updatedGoal = { ...goal, ...updates };
          if (
            updates.targetAmount ||
            updates.currentAmount ||
            updates.targetDate
          ) {
            updatedGoal.progress = calculateProgress(
              updatedGoal.currentAmount,
              updatedGoal.targetAmount
            );
            updatedGoal.monthlyTarget = calculateMonthlyTarget(
              updatedGoal.targetAmount,
              updatedGoal.currentAmount,
              updatedGoal.targetDate
            );
          }
          return updatedGoal;
        }
        return goal;
      })
    );
  };

  const deleteGoal = (id: number) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
    setContributions((prev) =>
      prev.filter((contribution) => contribution.goalId !== id)
    );
  };

  const addContribution = (
    goalId: number,
    amount: number,
    type: string = 'extra'
  ) => {
    const newContribution: Contribution = {
      id: Date.now(),
      goalId,
      amount,
      date: new Date().toISOString().split('T')[0],
      type: type as Contribution['type'],
    };

    setContributions((prev) => [...prev, newContribution]);

    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId) {
          const newCurrentAmount = goal.currentAmount + amount;
          const newProgress = calculateProgress(
            newCurrentAmount,
            goal.targetAmount
          );
          const newMonthlyTarget = calculateMonthlyTarget(
            goal.targetAmount,
            newCurrentAmount,
            goal.targetDate
          );
          return {
            ...goal,
            currentAmount: newCurrentAmount,
            progress: newProgress,
            monthlyTarget: newMonthlyTarget,
          };
        }
        return goal;
      })
    );
  };

  const getGoalById = (id: number): Goal | undefined => {
    return goals.find((goal) => goal.id === id);
  };

  const getContributionsByGoalId = (goalId: number): Contribution[] => {
    return contributions.filter(
      (contribution) => contribution.goalId === goalId
    );
  };

  const value: GoalsContextType = {
    goals,
    contributions,
    addGoal,
    updateGoal,
    deleteGoal,
    addContribution,
    getGoalById,
    getContributionsByGoalId,
  };

  return (
    <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>
  );
};
