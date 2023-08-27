module.exports = (user, status) => {
  user['on_session'] = status
  return user
}
