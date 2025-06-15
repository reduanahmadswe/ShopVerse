export const getAllProducts = (req, res) => {
  res.status(200).json({
    message: "All products are listed here",
  });
};

