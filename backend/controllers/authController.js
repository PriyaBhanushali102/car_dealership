export const registerUser = async (req, res) => {
  res.status(201).json({
    message: "User Registered",
  });
};

export const loginUser = async (req, res) => {
  res.status(200).json({
    message: "Login Success",
  });
};

export const getMe = async (req, res) => {
  res.status(200).json({
    message: "My Profile",
  });
};
