import bcrypt from "bcryptjs";
import User from "../../models/User.js";

//reset password
export const passwordReset = async (req, res) => {
  const { otp, newPassword } = req.body;

  try {
    const user = await User.findOne({
      passwordResetOTP: otp,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({
        message:
          "Password reset OTP is invalid or expired. Please enter a valid OTP",
      });

    user.password = bcrypt.hashSync(newPassword, 10);
    user.passwordResetOTP = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    res.status(200).json({
      message:
        "Password reset successful, proceed to login with your new password",
    });
  } catch (error) {
    console.log(error);
  }
};
