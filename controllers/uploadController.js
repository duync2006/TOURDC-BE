const multer = require('multer');

const upload = multer().single('profile_pic')

const UploadController = {
  handleUploadFile: async(req, res)=>{
    console.log(req.file)
  
    upload(req, res, function(err) {
      // req.file contains information of uploaded file
      // req.body contains information of text fields, if there were any
  
      if (req.fileValidationError) {
          return res.send(req.fileValidationError);
      }
      else if (!req.file) {
          return res.send('Please select an image to upload');
      }
      else if (err instanceof multer.MulterError) {
          return res.send(err);
      }
      else if (err) {
          return res.send(err);
      }
  
      // Display uploaded image for user validation
      
      res.send(`You have uploaded this image: <hr/><img src="../uploads/${req.file.filename}" width="500"><hr /><a href="./">Upload another image</a>`);
  });
  }
}


module.exports = UploadController