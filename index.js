const express = require('express')
const userRoutes = require('./routers/userRoutes')
const multer = require('multer');
const db = require('./config/databaseConfig')
require('dotenv').config({ path: '.env' })
const destinationRoute = require('./routers/destinationRoutes')

const app = express();
const port = process.env.PORT;

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.json());
// app.use(bodyParser.text({type: '/'}));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/destination', destinationRoute)

app.set('views', './views')
app.set('view engine', 'ejs')

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  
});

