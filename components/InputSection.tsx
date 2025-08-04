import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import Slider from "@react-native-community/slider";
import {
  TrendingUp,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Percent,
  Clock,
} from "lucide-react-native";
import { SipInputs, formatCurrency } from "../hooks/useSipCalculator";
import PSBColors from "../constants/colors";

interface InputSectionProps {
  inputs: SipInputs;
  updateInput: (field: keyof SipInputs, value: number) => void;
  resetInputs: () => void;
  getFieldError: (field: keyof SipInputs) => string | undefined;
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  inputs,
  updateInput,
  resetInputs,
  getFieldError,
  showAdvanced,
  setShowAdvanced,
}) => {
  const handleReset = () => {
    Alert.alert(
      "Reset All Values",
      "This will reset all inputs to their default values. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: resetInputs },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TrendingUp size={20} color={PSBColors.primary} />
        <Text style={styles.headerText}>Investment Parameters</Text>
      </View>

      {/* Monthly Investment */}
      <InputField
        icon={<DollarSign size={18} color="#64748b" />}
        label="Monthly SIP Amount"
        value={inputs.monthlyInvestment}
        onChangeValue={(value) => updateInput("monthlyInvestment", value)}
        error={getFieldError("monthlyInvestment")}
        sliderProps={{
          minimumValue: 500,
          maximumValue: 100000,
          step: 500,
        }}
        sliderLabels={["₹500", formatCurrency(inputs.monthlyInvestment), "₹1L"]}
        placeholder="Enter monthly amount"
      />

      {/* Expected Annual Return */}
      <InputField
        icon={<Percent size={18} color="#64748b" />}
        label="Expected Annual Return"
        value={inputs.annualReturnRate}
        onChangeValue={(value) => updateInput("annualReturnRate", value)}
        error={getFieldError("annualReturnRate")}
        sliderProps={{
          minimumValue: 1,
          maximumValue: 30,
          step: 0.5,
        }}
        sliderLabels={["1%", `${inputs.annualReturnRate}%`, "30%"]}
        placeholder="Enter return rate"
        suffix="%"
      />

      {/* Investment Duration */}
      <InputField
        icon={<Clock size={18} color="#64748b" />}
        label="Investment Duration"
        value={inputs.investmentDuration}
        onChangeValue={(value) => updateInput("investmentDuration", value)}
        error={getFieldError("investmentDuration")}
        sliderProps={{
          minimumValue: 1,
          maximumValue: 40,
          step: 1,
        }}
        sliderLabels={[
          "1 Year",
          `${inputs.investmentDuration} Years`,
          "40 Years",
        ]}
        placeholder="Enter duration"
        suffix=" Years"
      />

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.advancedButton}
          onPress={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? (
            <ChevronUp size={16} color="#64748b" />
          ) : (
            <ChevronDown size={16} color="#64748b" />
          )}
          <Text style={styles.advancedButtonText}>
            {showAdvanced ? "Hide Advanced" : "Show Advanced"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <RotateCcw size={16} color="#64748b" />
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface InputFieldProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  onChangeValue: (value: number) => void;
  error?: string;
  sliderProps: {
    minimumValue: number;
    maximumValue: number;
    step: number;
  };
  sliderLabels: [string, string, string];
  placeholder: string;
  suffix?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  icon,
  label,
  value,
  onChangeValue,
  error,
  sliderProps,
  sliderLabels,
  placeholder,
  suffix = "",
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleFocus = () => {
    scale.value = withSpring(1.02);
  };

  const handleBlur = () => {
    scale.value = withSpring(1);
  };

  return (
    <View style={styles.inputGroup}>
      <View style={styles.labelRow}>
        {icon}
        <Text style={styles.label}>{label}</Text>
      </View>

      <Animated.View style={animatedStyle}>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          value={value.toString()}
          onChangeText={(text) => onChangeValue(Number(text) || 0)}
          keyboardType="numeric"
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </Animated.View>

      <Slider
        style={styles.slider}
        minimumValue={sliderProps.minimumValue}
        maximumValue={sliderProps.maximumValue}
        step={sliderProps.step}
        value={value}
        onValueChange={onChangeValue}
        minimumTrackTintColor="#1e40af"
        maximumTrackTintColor="#e2e8f0"
      />

      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabel}>{sliderLabels[0]}</Text>
        <Text style={styles.sliderValue}>{sliderLabels[1]}</Text>
        <Text style={styles.sliderLabel}>{sliderLabels[2]}</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: PSBColors.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: PSBColors.card.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  headerText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "700",
    color: PSBColors.text.primary,
  },
  inputGroup: {
    marginBottom: 28,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "600",
    color: PSBColors.text.primary,
  },
  input: {
    borderWidth: 2,
    borderColor: PSBColors.card.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: PSBColors.gray[50],
    marginBottom: 16,
    color: PSBColors.text.primary,
    fontWeight: "500",
  },
  inputError: {
    borderColor: PSBColors.error,
    backgroundColor: PSBColors.error + "10",
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 12,
  },
  sliderThumb: {
    backgroundColor: PSBColors.primary,
    width: 24,
    height: 24,
    shadowColor: PSBColors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sliderLabel: {
    fontSize: 12,
    color: PSBColors.text.secondary,
    fontWeight: "500",
  },
  sliderValue: {
    fontSize: 15,
    fontWeight: "700",
    color: PSBColors.primary,
  },
  errorContainer: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 12,
    color: PSBColors.error,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  advancedButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: PSBColors.gray[100],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PSBColors.card.border,
  },
  advancedButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
    color: PSBColors.text.secondary,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: PSBColors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PSBColors.card.border,
  },
  resetButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
    color: PSBColors.text.secondary,
  },
});
