import express from "express";
import twilio from "twilio";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { connect, connection } from "mongoose";

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Initialize Nodemailer transporter
const emailTransporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// In-memory storage for OTPs (in production, use Redis or database)
const otpStore = new Map();

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP with expiration
const storeOTP = (identifier, otp, type = "sms") => {
  const expiration = Date.now() + 10 * 60 * 1000; // 10 minutes
  otpStore.set(identifier, {
    otp,
    type,
    expiration,
    attempts: 0,
  });
};

// Verify OTP
const verifyOTP = (identifier, otp) => {
  const stored = otpStore.get(identifier);
  if (!stored) {
    return { valid: false, message: "OTP not found or expired" };
  }

  if (Date.now() > stored.expiration) {
    otpStore.delete(identifier);
    return { valid: false, message: "OTP expired" };
  }

  if (stored.attempts >= 3) {
    otpStore.delete(identifier);
    return { valid: false, message: "Too many attempts" };
  }

  if (stored.otp === otp) {
    otpStore.delete(identifier);
    return { valid: true, message: "OTP verified successfully" };
  }

  stored.attempts += 1;
  return { valid: false, message: "Invalid OTP" };
};

// Send SMS OTP
const sendSMSOTP = async (phoneNumber, otp) => {
  try {
    const message = await twilioClient.messages.create({
      body: `Your PSB Fraud Shield verification code is: ${otp}. Valid for 10 minutes. Do not share this code with anyone.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error("SMS sending failed:", error);
    return { success: false, error: error.message };
  }
};

// Send Email OTP
const sendEmailOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "PSB Fraud Shield - Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #00563F; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">PSB Fraud Shield</h1>
          </div>
          <div style="padding: 30px; background-color: #f8f9fa;">
            <h2 style="color: #00563F;">Verification Code</h2>
            <p>Your verification code is:</p>
            <div style="background-color: #FFD700; color: #00563F; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; border-radius: 8px;">
              ${otp}
            </div>
            <p><strong>Important:</strong></p>
            <ul>
              <li>This code is valid for 10 minutes only</li>
              <li>Do not share this code with anyone</li>
              <li>PSB will never ask for this code via phone or email</li>
            </ul>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              This is an automated message from PSB Fraud Shield. Please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    };

    const result = await emailTransporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error: error.message };
  }
};

// OTP Routes
const otpRoutes = (app) => {
  // Send OTP via SMS
  app.post("/api/send-otp-sms", async (req, res) => {
    try {
      const { phoneNumber, purpose = "verification" } = req.body;

      if (!phoneNumber) {
        return res.status(400).json({
          success: false,
          error: "Phone number is required",
        });
      }

      // Validate phone number format
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({
          success: false,
          error: "Invalid phone number format",
        });
      }

      const otp = generateOTP();
      const identifier = `sms_${phoneNumber}_${purpose}`;

      // Store OTP
      storeOTP(identifier, otp, "sms");

      // Send SMS
      const smsResult = await sendSMSOTP(phoneNumber, otp);

      if (smsResult.success) {
        res.json({
          success: true,
          message: "OTP sent successfully",
          purpose,
          expiresIn: "10 minutes",
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Failed to send OTP",
          details: smsResult.error,
        });
      }
    } catch (error) {
      console.error("Send OTP SMS error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  });

  // Send OTP via Email
  app.post("/api/send-otp-email", async (req, res) => {
    try {
      const { email, purpose = "verification" } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: "Email is required",
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: "Invalid email format",
        });
      }

      const otp = generateOTP();
      const identifier = `email_${email}_${purpose}`;

      // Store OTP
      storeOTP(identifier, otp, "email");

      // Send Email
      const emailResult = await sendEmailOTP(email, otp);

      if (emailResult.success) {
        res.json({
          success: true,
          message: "OTP sent successfully",
          purpose,
          expiresIn: "10 minutes",
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Failed to send OTP",
          details: emailResult.error,
        });
      }
    } catch (error) {
      console.error("Send OTP Email error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  });

  // Verify OTP
  app.post("/api/verify-otp", async (req, res) => {
    try {
      const { identifier, otp, type = "sms" } = req.body;

      if (!identifier || !otp) {
        return res.status(400).json({
          success: false,
          error: "Identifier and OTP are required",
        });
      }

      const result = verifyOTP(identifier, otp);

      if (result.valid) {
        res.json({
          success: true,
          message: result.message,
          verified: true,
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.message,
          verified: false,
        });
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  });

  // Resend OTP
  app.post("/api/resend-otp", async (req, res) => {
    try {
      const { identifier, type = "sms" } = req.body;

      if (!identifier) {
        return res.status(400).json({
          success: false,
          error: "Identifier is required",
        });
      }

      // Extract contact info from identifier
      const parts = identifier.split("_");
      if (parts.length < 3) {
        return res.status(400).json({
          success: false,
          error: "Invalid identifier format",
        });
      }

      const contact = parts[1];
      const purpose = parts[2];
      const otp = generateOTP();

      // Store new OTP
      storeOTP(identifier, otp, type);

      let sendResult;
      if (type === "email") {
        sendResult = await sendEmailOTP(contact, otp);
      } else {
        sendResult = await sendSMSOTP(contact, otp);
      }

      if (sendResult.success) {
        res.json({
          success: true,
          message: "OTP resent successfully",
          expiresIn: "10 minutes",
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Failed to resend OTP",
          details: sendResult.error,
        });
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  });

  // Get OTP status
  app.get("/api/otp-status/:identifier", (req, res) => {
    try {
      const { identifier } = req.params;
      const stored = otpStore.get(identifier);

      if (!stored) {
        return res.json({
          success: true,
          exists: false,
          message: "OTP not found",
        });
      }

      const isExpired = Date.now() > stored.expiration;
      const remainingTime = Math.max(0, stored.expiration - Date.now());

      res.json({
        success: true,
        exists: true,
        expired: isExpired,
        remainingTime: Math.floor(remainingTime / 1000), // seconds
        attempts: stored.attempts,
        type: stored.type,
      });
    } catch (error) {
      console.error("OTP status error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  });

  // Clear expired OTPs (cleanup endpoint)
  app.post("/api/cleanup-otps", (req, res) => {
    try {
      const now = Date.now();
      let cleanedCount = 0;

      for (const [identifier, data] of otpStore.entries()) {
        if (now > data.expiration) {
          otpStore.delete(identifier);
          cleanedCount++;
        }
      }

      res.json({
        success: true,
        message: `Cleaned up ${cleanedCount} expired OTPs`,
        cleanedCount,
      });
    } catch (error) {
      console.error("Cleanup OTPs error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  });
};

export default otpRoutes;