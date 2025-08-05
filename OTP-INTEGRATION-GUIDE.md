# PSB Fraud Shield - OTP Integration Guide

## 🔐 OTP Functionality Overview

The PSB Fraud Shield application now includes comprehensive OTP (One-Time Password) functionality for secure user verification. This system supports both SMS and email OTP delivery methods.

## 🚀 Quick Start

### 1. Environment Variables Setup

Add these environment variables to your `.env` file:

```env
# Twilio Configuration (for SMS OTP)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Email Configuration (for Email OTP)
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# Database Configuration
MONGODB_URI=your_mongodb_connection_string
```

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Start the Server

```bash
npm start
```

## 📱 Available OTP Endpoints

### 1. Send SMS OTP
```http
POST /api/send-otp-sms
Content-Type: application/json

{
  "phoneNumber": "+1234567890",
  "purpose": "verification"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "purpose": "verification",
  "expiresIn": "10 minutes"
}
```

### 2. Send Email OTP
```http
POST /api/send-otp-email
Content-Type: application/json

{
  "email": "user@example.com",
  "purpose": "verification"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "purpose": "verification",
  "expiresIn": "10 minutes"
}
```

### 3. Verify OTP
```http
POST /api/verify-otp
Content-Type: application/json

{
  "identifier": "sms_+1234567890_verification",
  "otp": "123456",
  "type": "sms"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "verified": true
}
```

### 4. Resend OTP
```http
POST /api/resend-otp
Content-Type: application/json

{
  "identifier": "sms_+1234567890_verification",
  "type": "sms"
}
```

### 5. Get OTP Status
```http
GET /api/otp-status/sms_+1234567890_verification
```

**Response:**
```json
{
  "success": true,
  "exists": true,
  "expired": false,
  "remainingTime": 480,
  "attempts": 0,
  "type": "sms"
}
```

## 🔧 Frontend Integration

### Using the API Utility

```typescript
import { sendSMSOTP, sendEmailOTP, verifyOTP, resendOTP } from '../utils/api';

// Send SMS OTP
const sendOTP = async (phoneNumber: string) => {
  try {
    const response = await sendSMSOTP(phoneNumber, 'verification');
    if (response.success) {
      console.log('OTP sent successfully');
      // Store identifier for verification
      const identifier = `sms_${phoneNumber}_verification`;
      // Proceed to verification screen
    } else {
      console.error('Failed to send OTP:', response.error);
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
};

// Verify OTP
const verifyOTPCode = async (identifier: string, otp: string) => {
  try {
    const response = await verifyOTP(identifier, otp, 'sms');
    if (response.success && response.data?.verified) {
      console.log('OTP verified successfully');
      // Proceed with user authentication
    } else {
      console.error('OTP verification failed:', response.error);
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
  }
};

// Resend OTP
const resendOTPCode = async (identifier: string) => {
  try {
    const response = await resendOTP(identifier, 'sms');
    if (response.success) {
      console.log('OTP resent successfully');
    } else {
      console.error('Failed to resend OTP:', response.error);
    }
  } catch (error) {
    console.error('Error resending OTP:', error);
  }
};
```

### React Native Component Example

```typescript
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { sendSMSOTP, verifyOTP } from '../utils/api';
import { PSBColors } from '../utils/PSBColors';

const OTPVerificationScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }

    setIsLoading(true);
    try {
      const response = await sendSMSOTP(phoneNumber, 'verification');
      if (response.success) {
        setIdentifier(`sms_${phoneNumber}_verification`);
        Alert.alert('Success', 'OTP sent to your phone number');
      } else {
        Alert.alert('Error', response.error || 'Failed to send OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || !identifier) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyOTP(identifier, otp, 'sms');
      if (response.success && response.data?.verified) {
        Alert.alert('Success', 'OTP verified successfully');
        // Navigate to main app
      } else {
        Alert.alert('Error', response.error || 'Invalid OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: PSBColors.background.primary }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: PSBColors.primary.green, marginBottom: 20 }}>
        PSB Fraud Shield Verification
      </Text>
      
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: PSBColors.border.primary,
          borderRadius: 8,
          padding: 15,
          marginBottom: 15,
          fontSize: 16,
        }}
        placeholder="Enter phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      
      <TouchableOpacity
        style={{
          backgroundColor: PSBColors.primary.green,
          padding: 15,
          borderRadius: 8,
          marginBottom: 20,
        }}
        onPress={handleSendOTP}
        disabled={isLoading}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
          {isLoading ? 'Sending...' : 'Send OTP'}
        </Text>
      </TouchableOpacity>
      
      {identifier && (
        <>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: PSBColors.border.primary,
              borderRadius: 8,
              padding: 15,
              marginBottom: 15,
              fontSize: 16,
            }}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            maxLength={6}
          />
          
          <TouchableOpacity
            style={{
              backgroundColor: PSBColors.primary.gold,
              padding: 15,
              borderRadius: 8,
            }}
            onPress={handleVerifyOTP}
            disabled={isLoading}
          >
            <Text style={{ color: PSBColors.text.primary, textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default OTPVerificationScreen;
```

## 🔒 Security Features

### 1. OTP Generation
- ✅ 6-digit numeric OTP
- ✅ Cryptographically secure random generation
- ✅ Unique for each request

### 2. OTP Storage
- ✅ In-memory storage with expiration
- ✅ 10-minute validity period
- ✅ Automatic cleanup of expired OTPs

### 3. Verification Limits
- ✅ Maximum 3 attempts per OTP
- ✅ Automatic blocking after failed attempts
- ✅ Rate limiting protection

### 4. Input Validation
- ✅ Phone number format validation
- ✅ Email format validation
- ✅ OTP format validation

## 📧 Email Template

The email OTP uses a professional PSB-branded template with:
- ✅ PSB green header
- ✅ Gold accent for OTP display
- ✅ Security warnings
- ✅ Professional styling
- ✅ Mobile-responsive design

## 🔧 Configuration Options

### Twilio Setup
1. Create a Twilio account
2. Get your Account SID and Auth Token
3. Purchase a phone number
4. Add credentials to `.env` file

### Gmail Setup
1. Enable 2-factor authentication
2. Generate app-specific password
3. Add credentials to `.env` file

### Customization
- Modify OTP expiration time in `otpRoutes.js`
- Customize email template styling
- Adjust SMS message format
- Change OTP generation algorithm

## 🚨 Error Handling

### Common Error Responses
```json
{
  "success": false,
  "error": "Phone number is required"
}
```

```json
{
  "success": false,
  "error": "Invalid phone number format"
}
```

```json
{
  "success": false,
  "error": "OTP expired"
}
```

```json
{
  "success": false,
  "error": "Too many attempts"
}
```

## 📊 Monitoring & Analytics

### OTP Status Tracking
- Track OTP generation rates
- Monitor verification success rates
- Analyze failure patterns
- Clean up expired OTPs

### Performance Metrics
- SMS delivery success rate
- Email delivery success rate
- Average verification time
- Error rate analysis

## 🔄 Production Considerations

### 1. Database Storage
Replace in-memory storage with:
- MongoDB for OTP storage
- Redis for high-performance caching
- Automatic cleanup jobs

### 2. Rate Limiting
Implement rate limiting:
- Per phone number limits
- Per IP address limits
- Global rate limits

### 3. Monitoring
Add monitoring:
- OTP delivery metrics
- Error tracking
- Performance monitoring
- Security alerts

### 4. Backup Systems
Implement fallbacks:
- Multiple SMS providers
- Multiple email providers
- Offline OTP generation

## 🎯 Best Practices

### 1. User Experience
- Clear error messages
- Loading states
- Retry mechanisms
- Accessibility support

### 2. Security
- Secure OTP generation
- Input validation
- Rate limiting
- Audit logging

### 3. Performance
- Efficient storage
- Quick response times
- Caching strategies
- Load balancing

### 4. Reliability
- Multiple providers
- Fallback mechanisms
- Error recovery
- Monitoring alerts

---

**PSB Fraud Shield OTP System** - Secure, reliable, and user-friendly verification for banking applications.