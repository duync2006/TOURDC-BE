// const cloudinary = require('cloudinary')
// require('dotenv').config({ path: '.env' })
// cloudinary.config({
//   clould_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET
// })
const cloudinary = require('cloudinary');

cloudinary.v2.config({
  cloud_name: 'dstmhhmqq',
  api_key: '174342384892492',
  api_secret: 'Dw4EzyUtCUAkG4UeP2Of_nLVAu0',
  secure: true,
});


uploadToCloudDinary = (path, folder) => {
  return cloudinary.v2.uploader.upload(path, 
    {folder,
     width: 340,
     height: 120,
     crop: 'fill'
    }).then((data) => {
    return {url: data.url, public_id: data.public_id};
  }).catch((error) => {
    console.log(error)
  })
}

removeFromCloundinary = async(public_id) => {
  await cloudinary.v2.uploader.destroy(public_id, function(error, result) {
    console.log(result, error)
  })
}

module.exports = {uploadToCloudDinary, removeFromCloundinary}