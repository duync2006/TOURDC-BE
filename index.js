const express = require('express')

const db = require('./config/databaseConfig')

const app = express();
const port = 3005;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});