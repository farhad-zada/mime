module.exports = (req, res) => {
  // Here we return the updated restaurant
  res.status(200).json({
    status: 'success',
    data: {
      restaurant: req.restaurant, // VULNERABLE CODE:
    },
  })
}
