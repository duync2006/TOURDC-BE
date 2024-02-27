const userRouter = require('./userRoutes')
const destinationRoute = require('./destinationRoutes');
const { notFound, errHandler } = require('../middleware/errorHandler');
const initRoutes = (app) => {
  app.use('/api/user', userRouter);
  app.use('/api/destination', destinationRoute)

  app.use(notFound)
  app.use(errHandler)
}

module.exports = initRoutes