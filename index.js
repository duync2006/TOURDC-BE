const express = require('express')
const userRoutes = require('./routers/userRoutes')
const db = require('./config/databaseConfig')
require('dotenv').config({ path: '.env' })


const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use('/api/user', userRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});