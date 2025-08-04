import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Calculator, TrendingUp, Sparkles } from 'lucide-react-native';
import { useSipCalculator } from '../hooks/useSipCalculator';
import { InputSection } from './InputSection';
import { ResultsCard } from './ResultsCard';
import { SipChart } from './SipChart';
import { QuickPresets } from './QuickPresets';
import { AdvancedOptions } from './AdvancedOptions';
import PSBColors from '../constants/colors';

const { width, height } = Dimensions.get('window');

export const SipCalculator: React.FC = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const {
    inputs,
    results,
    errors,
    isValid,
    updateInput,
    resetInputs,
    getFieldError,
  } = useSipCalculator();

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Enhanced Header with Gradient Background */}
        <Animated.View 
          entering={FadeInUp.duration(800).springify()}
          style={styles.headerContainer}
        >
          <View style={[styles.headerGradient, { backgroundColor: PSBColors.primary }]}>
            <View style={styles.headerContent}>
              <View style={styles.headerBadge}>
                <Calculator size={18} color={PSBColors.white} />
                <Sparkles size={16} color={PSBColors.secondary} style={styles.sparkleIcon} />
                <Text style={styles.headerBadgeText}>PSB SIP Calculator</Text>
              </View>
              <Text style={styles.title}>Build Wealth with PSB</Text>
              <Text style={styles.subtitle}>
                Systematic Investment Planning with Punjab & Sind Bank
              </Text>
              
              {/* Stats Row */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>8-12%</Text>
                  <Text style={styles.statLabel}>Avg Return</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>₹5K</Text>
                  <Text style={styles.statLabel}>Min SIP</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>PSB</Text>
                  <Text style={styles.statLabel}>Long Term</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Quick Presets */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <QuickPresets onPresetSelect={updateInput} />
        </Animated.View>

        {/* Input Section */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <InputSection
            inputs={inputs}
            updateInput={updateInput}
            resetInputs={resetInputs}
            getFieldError={getFieldError}
            showAdvanced={showAdvanced}
            setShowAdvanced={setShowAdvanced}
          />
        </Animated.View>

        {/* Advanced Options */}
        {showAdvanced && (
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <AdvancedOptions
              inputs={inputs}
              updateInput={updateInput}
              getFieldError={getFieldError}
            />
          </Animated.View>
        )}

        {/* Results Section */}
        <Animated.View entering={FadeInDown.delay(600).duration(600)}>
          <ResultsCard
            totalInvested={results.totalInvested}
            totalInterest={results.totalInterest}
            maturityValue={results.maturityValue}
            monthlyInvestment={inputs.monthlyInvestment}
            isValid={isValid}
            inputs={inputs}
          />
        </Animated.View>

        {/* Chart Section */}
        {isValid && results.yearlyData.length > 0 && (
          <Animated.View 
            entering={FadeInDown.delay(800).duration(600)}
            style={styles.chartSection}
          >
            <View style={styles.chartHeader}>
              <TrendingUp size={20} color="#1e40af" />
              <Text style={styles.chartTitle}>Investment Growth Journey</Text>
            </View>
            <SipChart data={results.yearlyData} />
          </Animated.View>
        )}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: PSBColors.white,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PSBColors.secondaryLight + '30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: PSBColors.secondary + '50',
  },
  sparkleIcon: {
    marginLeft: 4,
  },
  headerBadgeText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '600',
    color: PSBColors.white,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: PSBColors.white,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: PSBColors.gray[200],
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: width - 80,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PSBColors.secondary + '20',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: PSBColors.secondary + '30',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PSBColors.white,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: PSBColors.gray[200],
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: PSBColors.secondary + '40',
    marginHorizontal: 16,
  },
  chartSection: {
    backgroundColor: PSBColors.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: PSBColors.card.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '700',
    color: PSBColors.text.primary,
  },
  bottomSpacing: {
    height: 20,
  },
});