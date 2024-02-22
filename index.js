const express = require('express')
const userRoutes = require('./routers/userRoutes')
const multer = require('multer');
const db = require('./config/databaseConfig')
require('dotenv').config({ path: '.env' })
const destinationRoute = require('./routers/destinationRoutes')
const helpers = require('./helper/imageFilter');
const UploadController = require('./controllers/uploadController')
// const htmlFile = require('./upload.html')

const app = express();
const port = process.env.PORT;

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

app.get('/', (req, res) => {
  res.render('upload.ejs')
})

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null,appRoot + '/public/imgs/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) 
    // console.log("uniqueSuffix: ", uniqueSuffix)
    // cb(null, file.fieldname + '-' + uniqueSuffix)
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage, fileFilter: helpers.imageFilter });
app.post('/upload-profile-pic',upload.single('profile_pic'), UploadController.handleUploadFile);