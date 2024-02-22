const User = require('../models/Users')
const web3 = require('../config/web3')
const { uploadToCloudDinary, resizeUrlCloundinary } = require('../service/cloudinary')

class UserController {
  async createUser(req, res) {

    try {
      if (req.body.waller_address == "" || req.body.waller_address == null) {
        let newWallet = web3.eth.accounts.create()
        console.log(newWallet.address)
        req.body.wallet_address = newWallet.address
        req.body.private_key = newWallet.privateKey
      }
      const newUser = await User.create(req.body);
      res.json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async uploadUserAvatar(req, res) {
    try {
      // console.log(req.file)
      const data = await uploadToCloudDinary(req.file.path, 'avatar');
      console.log(data)
      const savingImg = await User.updateOne(
        { _id: req.params.id },
        {
          $set: {
            avatar: data.url
          }
        }
      )
      res.status(200).send('Upload Success')
    } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }
  }
}

module.exports = new UserController();