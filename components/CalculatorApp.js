import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Calculator, CreditCard, TrendingUp, Sparkles, Repeat } from 'lucide-react-native';
import SimpleInterestCalculator from './SimpleInterestCalculator';
import LoanEmiCalculator from './LoanEmiCalculator';
import CompoundInterestCalculator from './CompoundInterestCalculator';
import PSBColors from '../constants/colors';

const CalculatorApp = () => {
  const [activeTab, setActiveTab] = useState('simple');

  const tabs = [
    { id: 'simple', label: 'Simple Interest', icon: TrendingUp },
    { id: 'emi', label: 'Loan EMI', icon: CreditCard },
    { id: 'compound', label: 'Compound Interest', icon: Repeat },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <View style={styles.iconContainer}>
                <Calculator size={32} color={PSBColors.white} />
              </View>
              <Text style={styles.title}>PSB Calculator</Text>
              <Sparkles size={24} color={PSBColors.secondary} opacity={0.8} />
            </View>
            <Text style={styles.subtitle}>
              Punjab & Sind Bank's comprehensive financial calculator suite
            </Text>
          </View>
        </View>

        {/* Scrollable Tabs */}
        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tabWrapper}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    style={[styles.tab, activeTab === tab.id && styles.activeTab]}
                    onPress={() => setActiveTab(tab.id)}
                  >
                    <Icon size={20} color={activeTab === tab.id ? PSBColors.white : PSBColors.text.secondary} />
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === tab.id && styles.activeTabText,
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Calculator Content */}
        <View style={styles.content}>
          {activeTab === 'simple' && <SimpleInterestCalculator />}
          {activeTab === 'emi' && <LoanEmiCalculator />}
          {activeTab === 'compound' && <CompoundInterestCalculator />}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Calculator size={20} color={PSBColors.primary} />
            <Text style={styles.footerTitle}>PSB Calculator</Text>
          </View>
          <Text style={styles.footerSubtitle}>
            Punjab & Sind Bank • Calculate with confidence
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PSBColors.gray[50],
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: PSBColors.primary,
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  headerContent: {
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  iconContainer: {
    backgroundColor: PSBColors.secondary + '40',
    padding: 12,
    borderRadius: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: PSBColors.white,
  },
  subtitle: {
    fontSize: 18,
    color: PSBColors.gray[200],
    textAlign: 'center',
    maxWidth: 320,
  },
  tabContainer: {
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  tabWrapper: {
    flexDirection: 'row',
    backgroundColor: PSBColors.white,
    borderRadius: 20,
    padding: 8,
    shadowColor: PSBColors.card.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: PSBColors.card.border,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 12,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: PSBColors.primary,
    shadowColor: PSBColors.card.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  tabText: {
    fontSize: 17,
    fontWeight: '700',
    color: PSBColors.text.secondary,
    letterSpacing: 0.3,
  },
  activeTabText: {
    color: PSBColors.white,
  },
  content: {
    paddingHorizontal: 16,
  },
  footer: {
    backgroundColor: PSBColors.gray[100],
    borderTopWidth: 1,
    borderTopColor: PSBColors.card.border,
    paddingVertical: 32,
    paddingHorizontal: 16,
    marginTop: 64,
    alignItems: 'center',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PSBColors.text.primary,
  },
  footerSubtitle: {
    fontSize: 14,
    color: PSBColors.text.secondary,
    textAlign: 'center',
  },
});

export default CalculatorApp;
