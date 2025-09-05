import User from "../../models/User.js";
import { sendMail } from "../../Utils/emailSender.js";
import { generateOTP } from "../../jwt/accessToken.js";

//request password reset
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(400)
        .json({ message: "User not found please register first to continue" });
      return;
    }

    const { otp, otpExpires } = generateOTP();
    user.passwordResetOTP = otp;
    user.passwordResetExpires = otpExpires;
    await user.save();

    await sendMail({
      mailFrom: `EcommApp ${process.env.EMAIL_USER}`,
      mailTo: email,
      subject: "Password Reset OTP",
      body: `Your password reset OTP is: ${otp}. It will expire in 20 minutes.`,
    });
    res.status(200).json({
      message:
        "Password reset request sent successfully. Check you email for OTP!",
    });
  } catch (error) {
    console.log(error);
  }
};
