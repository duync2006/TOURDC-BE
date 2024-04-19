const userRouter = require('./userRoutes')
const destinationRoute = require('./destinationRoutes');
const postRoute = require('./postRoutes')
const transactionRoute = require('./transactionRoutes')
const { notFound, errHandler } = require('../middleware/errorHandler');
const initRoutes = (app) => {
  app.use('/api/user', userRouter);
  app.use('/api/destination', destinationRoute)
  app.use('/api/post', postRoute)
  app.use('/api/transaction', transactionRoute)
  app.use(notFound)
  app.use(errHandler)
}

module.exports = initRoutes