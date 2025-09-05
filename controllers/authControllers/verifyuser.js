import User from "../../models/User.js";
import { generateOTP } from "../../jwt/accessToken.js";

// Verify email
export const verifyEmail = async (req, res) => {
  const { email, verificationCode } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code" });
    }
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Resend verification code
export const resendVerificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }
    if (user.lastVerificationRequest) {
      const timeSinceLastRequest = Date.now() - user.lastVerificationRequest;
      if (timeSinceLastRequest < 30 * 60 * 1000) {
        return res.status(429).json({
          message:
            "Please wait for 30 minutes before requesting a new verification code",
        });
      }
    }

    // Generate and send new verification code
    const { otp, otpExpires } = generateOTP();
    user.verificationCode = otp;
    user.verificationCodeExpires = otpExpires;
    user.lastVerificationRequest = Date.now();
    await user.save();

    await sendMail({
      mailFrom: `EcommApp ${process.env.EMAIL_USER}`,
      mailTo: email,
      subject: "Email Verification Code",
      body: `Your email verification code is: ${otp}. It will expire in 30 minutes.`,
    });

    res.status(200).json({ message: "Verification code resent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
