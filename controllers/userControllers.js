const User = require('../models/Users')
const web3 = require('../config/web3')

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
}

module.exports = new UserController();