import jwt from "jsonwebtoken";

export const getToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30m",
  });
};

export const generateOTP = () => {
  return {
    otp: Math.floor(100000 + Math.random() * 900000).toString(),
    otpExpires: new Date(Date.now() + 20 * 60 * 1000),
  };
};
