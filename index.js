const express = require('express')
const userRoutes = require('./routers/userRoutes')
const multer = require('multer');
const db = require('./config/databaseConfig')
require('dotenv').config({ path: '.env' })
const destinationRoute = require('./routers/destinationRoutes');
var cookieParser = require('cookie-parser')

const initRoutes = require('./routers/index');
// const upload = require('./views/upload.ejs')

const app = express();
const port = process.env.PORT;

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.json());
// app.use(bodyParser.text({type: '/'}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// Routes
initRoutes(app)

app.set('views', './views')
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  return res.render('upload.ejs')
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  
});

