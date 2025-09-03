import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { registerSchema, loginSchema } from "../validators/authValidation.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const registerUser = async (req, res) => {
  const parsed = registerSchema.parse(req.body);

  const exists = await User.findOne({
    $or: [{ email: parsed.email }, { username: parsed.username }],
  });
  if (exists) return res.status(409).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(parsed.password, 10);
  const user = await User.create({
    username: parsed.username,
    email: parsed.email,
    password: hashedPassword,
    role: parsed.role ?? "user",
  });

  res.status(201).json({
    token: generateToken(user._id),
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
};

export const loginUser = async (req, res) => {
  try {
    const validated = loginSchema.parse(req.body);

    const user = await User.findOne({ email: validated.email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(validated.password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(200)
      .json({ message: "If that email exists, a reset link has been sent" });

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(rawToken).digest("hex");

  user.resetPasswordTokenHash = hash;
  user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 15); // 15 mins
  await user.save();

  const resetUrl = `${
    process.env.APP_URL ?? "http://localhost:5000"
  }/api/auth/reset-password?token=${rawToken}&email=${encodeURIComponent(
    user.email
  )}`;

  // Replace this with nodemailer later; for now, log the link
  console.log("🔐 Password reset link:", resetUrl);

  res.json({ message: "If that email exists, a reset link has been sent" });
};

export const resetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body;
  if (!token || !email || !newPassword) {
    return res
      .status(400)
      .json({ message: "token, email and newPassword are required" });
  }

  const hash = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    email,
    resetPasswordTokenHash: hash,
    resetPasswordExpires: { $gt: new Date() },
  });
  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  user.resetPasswordTokenHash = null;
  user.resetPasswordExpires = null;
  await user.save();

  res.json({ message: "Password reset successful" });
};

// export const loginUser = async (req, res) => {
//   const { email, password } = loginSchema.parse(req.body);

//   const user = await User.findOne({ email });
//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   res.json({
//     token: generateToken(user._id),
//     user: { id: user._id, username: user.username, email: user.email, role: user.role }
//   });
// }
