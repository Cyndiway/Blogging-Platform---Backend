import User from "../../models/User.js";

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!id) {
      return res
        .status(404)
        .json({ "Invalid request, User ID is required": id });
    }
    if (!user) {
      return res.status(404).json({ "User not found": id });
    }
    res.json({ "User deleted successfully": user });
  } catch (error) {
    res.json({ "Internal server error": error.message });
  }
};
