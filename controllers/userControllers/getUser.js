import User from "../../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -verrificationCode");
    res.json(users);
  } catch (error) {
    res.json({ message: "internal server", error: error.message });
  }
};

export const getAUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password -verificationCode");
    if (!user) {
      return;
      res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.json({ message: "Internal server error", error: error.message });
  }
};

export const getAUserByParam = async (req, res) => {
  const { param } = req.params;

  try {
    const user = await User.findOne({
      $or: [{ email: param }, { userName: param }],
    }).select("-password -verificationCode");
    //check if user detail is provided
    if (!param) {
      return res.status(400).json({ message: "User detail is required" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.json({ message: "Internal server error", error: error.message });
  }
};
