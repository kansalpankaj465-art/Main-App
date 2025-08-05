import { apiConnector } from "../apiConnector";
import { securityApi } from "../api";

// ===============================
// REPORTS SERVICES
// ===============================

export const getAllReports = () => async (dispatch) => {
  try {
    console.log("🚨 Fetching reports...");
    
    const response = await apiConnector("GET", securityApi.GET_REPORTS_API);
    
    if (response.success) {
      console.log("✅ Reports fetched successfully:", response.data.reports.length);
      return { success: true, reports: response.data.reports };
    } else {
      throw new Error(response.error || "Failed to fetch reports");
    }
  } catch (error) {
    console.error("❌ Get reports error:", error);
    return { success: false, error: error.message };
  }
};

export const submitReport = (reportData) => async (dispatch) => {
  try {
    console.log("🚨 Submitting report...", reportData.type);
    
    const response = await apiConnector("POST", securityApi.POST_SUBMIT_REPORT_API, reportData);
    
    if (response.success) {
      console.log("✅ Report submitted successfully");
      return { success: true, report: response.data.report };
    } else {
      throw new Error(response.error || "Failed to submit report");
    }
  } catch (error) {
    console.error("❌ Submit report error:", error);
    return { success: false, error: error.message };
  }
};

export const getReportById = (reportId) => async (dispatch) => {
  try {
    console.log("🚨 Fetching report:", reportId);
    
    const response = await apiConnector("GET", `${securityApi.GET_REPORT_BY_ID_API}/${reportId}`);
    
    if (response.success) {
      console.log("✅ Report fetched successfully");
      return { success: true, report: response.data.report };
    } else {
      throw new Error(response.error || "Failed to fetch report");
    }
  } catch (error) {
    console.error("❌ Get report error:", error);
    return { success: false, error: error.message };
  }
};

export const deleteReport = (reportId) => async (dispatch) => {
  try {
    console.log("🚨 Deleting report:", reportId);
    
    const response = await apiConnector("DELETE", `${securityApi.DELETE_REPORT_API}/${reportId}`);
    
    if (response.success) {
      console.log("✅ Report deleted successfully");
      return { success: true, message: response.data.message };
    } else {
      throw new Error(response.error || "Failed to delete report");
    }
  } catch (error) {
    console.error("❌ Delete report error:", error);
    return { success: false, error: error.message };
  }
};

// ===============================
// SECURITY ANALYSIS SERVICES
// ===============================

export const analyzeURL = (url) => async (dispatch) => {
  try {
    console.log("🔍 Analyzing URL:", url);
    
    const response = await apiConnector("POST", securityApi.POST_ANALYZE_URL_API, { url });
    
    if (response.success) {
      console.log("✅ URL analysis completed. Risk Score:", response.data.analysis.riskScore);
      return { 
        success: true, 
        analysis: response.data.analysis 
      };
    } else {
      throw new Error(response.error || "Failed to analyze URL");
    }
  } catch (error) {
    console.error("❌ URL analysis error:", error);
    return { success: false, error: error.message };
  }
};

export const analyzeEmail = (emailData) => async (dispatch) => {
  try {
    console.log("📧 Analyzing email...");
    
    const response = await apiConnector("POST", securityApi.POST_ANALYZE_EMAIL_API, emailData);
    
    if (response.success) {
      console.log("✅ Email analysis completed. Risk Score:", response.data.analysis.riskScore);
      return { 
        success: true, 
        analysis: response.data.analysis 
      };
    } else {
      throw new Error(response.error || "Failed to analyze email");
    }
  } catch (error) {
    console.error("❌ Email analysis error:", error);
    return { success: false, error: error.message };
  }
};

// ===============================
// HELPER FUNCTIONS
// ===============================

export const validateReportData = (reportData) => {
  const errors = [];
  
  if (!reportData.type) {
    errors.push("Report type is required");
  }
  
  if (!reportData.description || reportData.description.length < 10) {
    errors.push("Description must be at least 10 characters long");
  }
  
  if (!reportData.contactInfo) {
    errors.push("Contact information is required");
  }
  
  if (!reportData.address && (!reportData.latitude || !reportData.longitude)) {
    errors.push("Either address or location coordinates are required");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getRiskLevelFromScore = (riskScore) => {
  if (riskScore >= 80) return { level: 'critical', color: '#FF0000', text: 'CRITICAL RISK' };
  if (riskScore >= 60) return { level: 'high', color: '#FF4500', text: 'HIGH RISK' };
  if (riskScore >= 40) return { level: 'medium', color: '#FFA500', text: 'MEDIUM RISK' };
  if (riskScore >= 20) return { level: 'low', color: '#FFD700', text: 'LOW RISK' };
  return { level: 'safe', color: '#32CD32', text: 'SAFE' };
};

export const formatAnalysisResult = (analysis) => {
  const riskLevel = getRiskLevelFromScore(analysis.riskScore);
  
  return {
    ...analysis,
    riskLevel,
    formattedScore: `${analysis.riskScore}/100`,
    threatCount: analysis.threats ? analysis.threats.length : 0,
    hasThreats: analysis.threats && analysis.threats.length > 0
  };
};

// ===============================
// REPORT CATEGORIES & TEMPLATES
// ===============================

export const getReportCategories = () => {
  return [
    {
      id: 'phone-scam',
      title: 'Phone Scam',
      description: 'Fraudulent phone calls asking for personal information',
      icon: '📞',
      examples: [
        'Fake bank calls asking for OTP',
        'Lottery/prize scam calls',
        'Tech support scams',
        'IRS/tax scam calls'
      ]
    },
    {
      id: 'online-fraud',
      title: 'Online Fraud',
      description: 'Internet-based fraudulent activities',
      icon: '💻',
      examples: [
        'Fake shopping websites',
        'Phishing emails',
        'Social media scams',
        'Investment fraud online'
      ]
    },
    {
      id: 'financial-fraud',
      title: 'Financial Fraud',
      description: 'Banking and financial scams',
      icon: '💳',
      examples: [
        'Credit card fraud',
        'ATM skimming',
        'Fake loan offers',
        'Investment scams'
      ]
    },
    {
      id: 'identity-theft',
      title: 'Identity Theft',
      description: 'Unauthorized use of personal information',
      icon: '🆔',
      examples: [
        'Document fraud',
        'Fake government calls',
        'Social security scams',
        'Medical identity theft'
      ]
    },
    {
      id: 'romance-scam',
      title: 'Romance Scam',
      description: 'Dating and relationship frauds',
      icon: '💕',
      examples: [
        'Dating app scams',
        'Fake profiles',
        'Emergency money requests',
        'Catfishing'
      ]
    },
    {
      id: 'job-scam',
      title: 'Job Scam',
      description: 'Employment-related frauds',
      icon: '💼',
      examples: [
        'Fake job offers',
        'Work from home scams',
        'Advance fee employment',
        'Pyramid schemes'
      ]
    }
  ];
};

export const getReportTemplate = (categoryId) => {
  const templates = {
    'phone-scam': {
      type: 'Phone Scam',
      description: 'I received a fraudulent call from [phone number] claiming to be from [organization]. They asked for [what they requested]. The call happened on [date] at approximately [time].',
      tips: [
        'Include the caller\'s phone number if available',
        'Mention what organization they claimed to be from',
        'Note what information they requested',
        'Include date and time of the call'
      ]
    },
    'online-fraud': {
      type: 'Online Fraud',
      description: 'I encountered a fraudulent website/email at [URL/address]. They were [what they were doing]. I [what action you took/didn\'t take].',
      tips: [
        'Include the website URL or email address',
        'Describe what the scammers were offering',
        'Mention if you provided any information',
        'Include screenshots if possible'
      ]
    },
    'financial-fraud': {
      type: 'Financial Fraud',
      description: 'I experienced financial fraud involving [bank/financial institution]. The fraudulent activity was [describe the fraud]. I discovered this on [date].',
      tips: [
        'Mention the financial institution involved',
        'Describe the unauthorized transactions',
        'Include when you discovered the fraud',
        'Note any suspicious communications received'
      ]
    }
  };
  
  return templates[categoryId] || {
    type: 'General Fraud',
    description: 'Please describe the fraudulent activity you experienced, including dates, times, and any relevant details.',
    tips: [
      'Be as specific as possible with details',
      'Include dates and times',
      'Mention any financial losses',
      'Describe how you were contacted'
    ]
  };
};

// ===============================
// LOCATION SERVICES
// ===============================

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000 // 10 minutes
      }
    );
  });
};

export const submitReportWithLocation = (reportData) => async (dispatch) => {
  try {
    // Validate report data
    const validation = validateReportData(reportData);
    if (!validation.isValid) {
      return { 
        success: false, 
        error: validation.errors.join(', ') 
      };
    }
    
    let finalReportData = { ...reportData };
    
    // Try to get current location if not provided
    if (!reportData.latitude || !reportData.longitude) {
      try {
        console.log("🌍 Getting current location...");
        const location = await getCurrentLocation();
        finalReportData.latitude = location.latitude;
        finalReportData.longitude = location.longitude;
        console.log("✅ Location obtained successfully");
      } catch (locationError) {
        console.log("⚠️ Could not get location:", locationError.message);
        // Continue without location if user doesn't provide it
      }
    }
    
    // Submit the report
    const response = await dispatch(submitReport(finalReportData));
    
    if (response.success) {
      console.log("✅ Report with location submitted successfully");
      return response;
    } else {
      throw new Error(response.error || "Failed to submit report");
    }
  } catch (error) {
    console.error("❌ Submit report with location error:", error);
    return { success: false, error: error.message };
  }
};