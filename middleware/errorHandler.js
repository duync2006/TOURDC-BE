const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not Found!`)
  res.status(404)
  next()
}

const errHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  // console.log("ERROR: ", (err.message))
  return res.status(statusCode).json({
    success: false,
    messege: err?.message
  }) 
}

module.exports = {
  notFound,
  errHandler
}