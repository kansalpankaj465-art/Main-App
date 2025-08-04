import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Settings, TrendingDown, Calendar } from 'lucide-react-native';
import { SipInputs } from '../hooks/useSipCalculator';

interface AdvancedOptionsProps {
  inputs: SipInputs;
  updateInput: (field: keyof SipInputs, value: number) => void;
  getFieldError: (field: keyof SipInputs) => string | undefined;
}

export const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({
  inputs,
  updateInput,
  getFieldError,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Settings size={18} color="#1e40af" />
        <Text style={styles.headerText}>Advanced Settings</Text>
      </View>

      {/* Inflation Rate */}
      <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
          <TrendingDown size={16} color="#64748b" />
          <Text style={styles.label}>Expected Inflation Rate (%)</Text>
        </View>
        <TextInput
          style={styles.input}
          value="6"
          keyboardType="numeric"
          placeholder="6"
          editable={false}
        />
        <Slider
          style={styles.slider}
          minimumValue={3}
          maximumValue={10}
          step={0.5}
          value={6}
          minimumTrackTintColor="#1e40af"
          maximumTrackTintColor="#e2e8f0"
          thumbStyle={styles.sliderThumb}
          disabled
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>3%</Text>
          <Text style={styles.sliderValue}>6% (Default)</Text>
          <Text style={styles.sliderLabel}>10%</Text>
        </View>
      </View>

      {/* Step-up Rate */}
      <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
          <Calendar size={16} color="#64748b" />
          <Text style={styles.label}>Annual Step-up Rate (%)</Text>
        </View>
        <TextInput
          style={styles.input}
          value="10"
          keyboardType="numeric"
          placeholder="10"
          editable={false}
        />
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={20}
          step={1}
          value={10}
          minimumTrackTintColor="#1e40af"
          maximumTrackTintColor="#e2e8f0"
          thumbStyle={styles.sliderThumb}
          disabled
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>0%</Text>
          <Text style={styles.sliderValue}>10% (Recommended)</Text>
          <Text style={styles.sliderLabel}>20%</Text>
        </View>
        <Text style={styles.helperText}>
          Increase your SIP amount annually to beat inflation
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 Advanced features coming soon! These settings will help you create more sophisticated investment strategies.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    borderTopWidth: 3,
    borderTopColor: PSBColors.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: -0.3,
  },
  inputGroup: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 0.3,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 17,
    backgroundColor: '#f9fafb',
    marginBottom: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 8,
  },
  sliderThumb: {
    backgroundColor: '#9ca3af',
    width: 20,
    height: 20,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
  },
  helperText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
    fontStyle: 'italic',
  },
  infoBox: {
    backgroundColor: PSBColors.secondary + '15',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: PSBColors.secondary,
    borderWidth: 1,
    borderColor: PSBColors.secondary + '30',
  },
  infoText: {
    fontSize: 15,
    color: PSBColors.brand.heritage,
    lineHeight: 20,
    fontWeight: '600',
  },
});