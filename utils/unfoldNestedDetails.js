module.exports = (req, res, next) => {
  const { restaurantId, menuItemId } = req.params
  const by = req.user.id
  const to = menuItemId ? menuItemId : restaurantId
  const modelName = menuItemId ? 'MenuItem' : 'Restaurant'

  req.nestedDetails = { by, to, modelName }
  next()
}
