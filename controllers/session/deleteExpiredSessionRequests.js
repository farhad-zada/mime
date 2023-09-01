//TODO:

const SessionRequest = require('../../models/sessionJoinRequestModel')
const catchAsync = require('../../utils/catchAsync')

module.exports = catchAsync(async (req, res, next) => {
  const deletedRequests = await SessionRequest.deleteMany({
    at: { $lt: Date.now() - 10 * 60 * 1000 },
  }) // Deletes all the requests that have been done before 10 minutes

  console.log(
    `Expired requests have been deleted\nNumber of deleted requests: ${deletedRequests.deleteCount}\nid=deleted_requests`,
  )
})
