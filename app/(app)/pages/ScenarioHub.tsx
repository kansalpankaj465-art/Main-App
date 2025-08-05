import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScenarioList } from "../../../components/ScenarioList";
import { ScenarioSimulator } from "../../../components/ScenarioSimulator";
import AsyncStorage from "@react-native-async-storage/async-storage";

const COMPLETED_SCENARIOS_KEY = "completed_scenarios";

export default function ScenarioHub() {
  const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(
    null
  );
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);

  useEffect(() => {
    loadCompletedScenarios();
  }, []);

  const loadCompletedScenarios = async () => {
    try {
      const stored = await AsyncStorage.getItem(COMPLETED_SCENARIOS_KEY);
      if (stored) {
        setCompletedScenarios(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load completed scenarios:", error);
    }
  };

  const saveCompletedScenario = async (scenarioId: string) => {
    try {
      const updated = [...new Set([...completedScenarios, scenarioId])];
      setCompletedScenarios(updated);
      await AsyncStorage.setItem(
        COMPLETED_SCENARIOS_KEY,
        JSON.stringify(updated)
      );
    } catch (error) {
      console.error("Failed to save completed scenario:", error);
    }
  };

  const handleScenarioSelect = (scenarioId: string) => {
    setCurrentScenarioId(scenarioId);
  };

  const handleScenarioComplete = (result: any) => {
    if (result.scenarioId) {
      saveCompletedScenario(result.scenarioId);
    }
    setCurrentScenarioId(null);
  };

  const handleExit = () => {
    setCurrentScenarioId(null);
  };

  if (currentScenarioId) {
    return (
      <ScenarioSimulator
        scenarioId={currentScenarioId}
        onComplete={handleScenarioComplete}
        onExit={handleExit}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScenarioList
        onScenarioSelect={handleScenarioSelect}
        completedScenarios={completedScenarios}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e293b",
  },
});
